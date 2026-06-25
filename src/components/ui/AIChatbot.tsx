import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAssignments } from '../../services/dbService';
import { askAssignmentAI, getGroqApiKey } from '../../services/aiService';
import type { Assignment } from '../../types';
import { cn } from '../../utils/cn';

interface Message {
  sender: 'student' | 'ai';
  text: string;
  time: string;
}

export function AIChatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: "Hi! I'm your AssignFlow Assistant. Select an assignment above and ask me questions like 'Explain Question 2' or 'Summarize the task'!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user has saved an API key
    setHasApiKey(!!getGroqApiKey());
  }, [isOpen]);

  useEffect(() => {
    async function loadAssignments() {
      if (!user || user.role !== 'student') return;
      try {
        const list = await getAssignments(user.collegeId);
        // Filter student's class assignments
        const classAssignments = list.filter(a => a.class === ((user as any).class || 'CS-A'));
        setAssignments(classAssignments);
        if (classAssignments.length > 0) {
          setSelectedAssignment(classAssignments[0]);
        }
      } catch (e) {
        console.error('Error loading chatbot contexts:', e);
      }
    }
    loadAssignments();
  }, [user]);

  useEffect(() => {
    // Scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!user || user.role !== 'student') return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    
    const userMessage: Message = {
      sender: 'student',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const title = selectedAssignment?.title || 'General';
      const desc = selectedAssignment?.description || 'N/A';
      
      const aiResponseText = await askAssignmentAI(userText, title, desc);
      
      const aiMessage: Message = {
        sender: 'ai',
        text: aiResponseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'Oops, something went wrong. Please check your network and try again.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-[0_16px_32px_rgba(79,70,229,0.3)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.4)] transition-all cursor-pointer flex items-center justify-center border border-indigo-400/20"
      >
        <Sparkles size={22} className="animate-pulse" />
      </motion.button>

      {/* Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">AssignFlow AI</h4>
                  <p className="text-[10px] text-indigo-300 font-medium">Groq Llama-3 TA</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Context Selector */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Context:</span>
              <select
                value={selectedAssignment?.id || ''}
                onChange={(e) => {
                  const match = assignments.find(a => a.id === e.target.value);
                  if (match) setSelectedAssignment(match);
                }}
                className="flex-1 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1 text-xs focus:outline-none dark:text-white"
              >
                {assignments.map(a => (
                  <option key={a.id} value={a.id}>{a.title}</option>
                ))}
              </select>
            </div>

            {/* API Warning if missing */}
            {!hasApiKey && (
              <div className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 px-4 py-2 flex items-start gap-2">
                <AlertCircle size={14} className="text-slate-500 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">
                  Live AI is not connected yet. Built-in guidance will be used until a Groq API key is added.
                </p>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'flex flex-col max-w-[85%] rounded-2xl p-3 text-sm relative',
                    msg.sender === 'student'
                      ? 'bg-indigo-600 text-white ml-auto rounded-tr-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-250 mr-auto rounded-tl-none'
                  )}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <span className={cn('text-[9px] mt-1 text-right', msg.sender === 'student' ? 'text-indigo-200' : 'text-slate-400')}>
                    {msg.time}
                  </span>
                </div>
              ))}
              {isLoading && (
                <div className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-250 mr-auto rounded-2xl rounded-tl-none p-3 max-w-[85%] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce delay-200" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Assignment AI..."
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs focus:outline-none dark:text-white"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl transition-all cursor-pointer flex items-center justify-center flex-shrink-0"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
