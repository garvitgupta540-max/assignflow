import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { 
  getCommunityMessages, 
  sendCommunityMessage, 
  getAssignments 
} from '../../services/dbService';
import { askAssignmentAI } from '../../services/aiService';
import type { CommunityMessage, Assignment } from '../../types';
import { Send, Sparkles, MessageSquare, BookOpen, Clock, Users } from 'lucide-react';

export function CommunityPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [activeClass, setActiveClass] = useState<string>('');
  const [teacherClasses, setTeacherClasses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiTyping, setAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Setup roles & classes
  useEffect(() => {
    if (!user) return;

    if (user.role === 'student') {
      const studentClass = (user as any).class || 'CS-A';
      setActiveClass(studentClass);
    } else if (user.role === 'teacher') {
      const classes = (user as any).classes || ['CS-A', 'CS-B'];
      setTeacherClasses(classes);
      setActiveClass(classes[0]);
    }
  }, [user]);

  // Load messages & assignments
  useEffect(() => {
    if (!activeClass) return;

    async function loadData() {
      setLoading(true);
      const msgs = await getCommunityMessages(activeClass);
      setMessages(msgs);

      const allAssignments = await getAssignments(user?.collegeId || 'c1');
      const filtered = allAssignments.filter(a => a.class === activeClass);
      setAssignments(filtered);
      setLoading(false);
    }
    loadData();
  }, [activeClass]);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, aiTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user || !activeClass) return;

    const userText = inputText.trim();
    setInputText('');

    // 1. Send user message
    const newMsg: Omit<CommunityMessage, 'id' | 'createdAt'> = {
      classCode: activeClass,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      content: userText,
    };

    // Optimistic UI update
    const tempId = `temp-${Date.now()}`;
    const tempMsg: CommunityMessage = {
      id: tempId,
      ...newMsg,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempMsg]);

    await sendCommunityMessage(activeClass, newMsg);

    // Refresh messages to sync correct ID & time from DB
    const freshMsgs = await getCommunityMessages(activeClass);
    setMessages(freshMsgs);

    // 2. Check for AI Trigger (@ai or @AI)
    if (userText.toLowerCase().includes('@ai')) {
      setAiTyping(true);
      
      // Get context from latest assignment if available
      const latestAssignment = assignments[assignments.length - 1];
      const assignmentTitle = latestAssignment?.title || 'General CS Coursework';
      const assignmentDesc = latestAssignment?.description || 'General questions relating to computer science and programming.';

      // Strip the '@ai' trigger from the query
      const userQuery = userText.replace(/@ai/gi, '').trim();

      try {
        const aiResponseText = await askAssignmentAI(
          userQuery || 'Hello, I need help with my assignments.',
          assignmentTitle,
          assignmentDesc
        );

        const aiMsg: Omit<CommunityMessage, 'id' | 'createdAt'> = {
          classCode: activeClass,
          senderId: 'ai-ta',
          senderName: 'AssignFlow AI TA',
          senderRole: 'admin',
          content: aiResponseText,
          isAi: true,
        };

        await sendCommunityMessage(activeClass, aiMsg);
        
        // Reload all messages
        const updatedMsgs = await getCommunityMessages(activeClass);
        setMessages(updatedMsgs);
      } catch (err) {
        console.error('AI Community Assist Error:', err);
      } finally {
        setAiTyping(false);
      }
    }
  };

  return (
    <DashboardLayout title="Batch Community" subtitle="Interact, ask doubts, and collaborate with AI Assistance">
      <div className="grid lg:grid-cols-12 gap-6 h-[calc(100vh-12rem)] min-h-[500px]">
        
        {/* Left Column: Channels & Active Assignments */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full overflow-hidden">
          
          {/* Class Channel Selector */}
          {user?.role === 'teacher' && teacherClasses.length > 1 && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-card">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Your Classes</h3>
              <div className="flex gap-2">
                {teacherClasses.map(cls => (
                  <button
                    key={cls}
                    onClick={() => setActiveClass(cls)}
                    className={`flex-1 py-2.5 px-4 rounded-2xl text-xs font-bold transition-all border ${
                      activeClass === cls
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-glow'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {cls} Channel
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Assignments Panel */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-card flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={18} className="text-indigo-600" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Active Assignments</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 no-scrollbar">
              {assignments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs text-slate-500">No active assignments for this batch.</p>
                </div>
              ) : (
                assignments.map(a => (
                  <div key={a.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{a.title}</span>
                      <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 rounded-full flex-shrink-0">
                        {a.subject}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {a.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <Clock size={12} className="text-rose-500" />
                      <span>Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Tip Widget */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex gap-2 items-start bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl p-3.5">
              <Sparkles size={16} className="text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] font-bold text-indigo-900 dark:text-indigo-300">Need immediate help?</h4>
                <p className="text-[10px] text-indigo-700 dark:text-indigo-400 leading-normal mt-0.5">
                  Type a question in chat and tag <strong className="font-extrabold">@ai</strong>. The AI TA will read active assignments and reply!
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Chat Window */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-card flex flex-col h-full overflow-hidden">
          
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/40 dark:bg-slate-900/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center text-indigo-600">
                <MessageSquare size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">#{activeClass} Discussion</h3>
                <p className="text-xs text-slate-500">Class Batch & Community Discussion Forum</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-xl font-medium">
              <Users size={14} className="text-slate-400" />
              <span>{assignments[0]?.totalStudents || 40} online</span>
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 dark:bg-slate-950/10">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === user?.id;
                const isSystem = msg.senderId === 'sys';
                const isAI = msg.isAi;
                const isTeacher = msg.senderRole === 'teacher';

                if (isSystem) {
                  return (
                    <div key={msg.id} className="flex justify-center my-2">
                      <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/50 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs px-4 py-2.5 rounded-2xl max-w-lg text-center leading-relaxed">
                        {msg.content}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                    {/* User Avatar */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 text-white ${
                      isAI 
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600' 
                        : isTeacher 
                        ? 'bg-emerald-600' 
                        : 'bg-slate-500'
                    }`}>
                      {isAI ? 'AI' : msg.senderName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>

                    {/* Chat Bubble Container */}
                    <div className={`space-y-1 max-w-[70%] ${isMe ? 'text-right' : ''}`}>
                      <div className="flex items-center gap-1.5 justify-start text-[11px] font-semibold text-slate-500">
                        <span className="text-slate-900 dark:text-white">{msg.senderName}</span>
                        {isTeacher && <span className="px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-[9px] text-emerald-600 dark:text-emerald-400 font-extrabold rounded">Faculty</span>}
                        {isAI && <span className="px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-[9px] text-indigo-600 dark:text-indigo-400 font-extrabold rounded flex items-center gap-0.5"><Sparkles size={8} /> AI Assistant</span>}
                        <span className="text-[10px] text-slate-400">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <div className={`p-4 rounded-[20px] text-xs leading-relaxed font-sans text-left shadow-sm ${
                        isMe 
                          ? 'bg-indigo-600 text-white rounded-tr-none' 
                          : isAI
                          ? 'bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100/50 dark:border-indigo-900/30 text-slate-800 dark:text-slate-200 rounded-tl-none whitespace-pre-wrap'
                          : isTeacher
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30 text-slate-800 dark:text-slate-200 rounded-tl-none'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 text-slate-800 dark:text-slate-200 rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* AI Typing Indicator */}
            {aiTyping && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                  AI
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-slate-500">
                    <span className="text-slate-900 dark:text-white">AssignFlow AI TA</span>
                    <span className="ml-1.5 px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-[9px] text-indigo-600 dark:text-indigo-400 font-extrabold rounded">Typing...</span>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-[20px] rounded-tl-none flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Form */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 dark:border-slate-700 flex gap-3 bg-slate-50/40 dark:bg-slate-900/10">
            <input
              type="text"
              placeholder="Ask a doubt or discuss... (type @ai to query the AI assistant)"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-2xl px-5 py-3 text-xs focus:outline-none dark:text-white shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-11 h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex items-center justify-center transition-all disabled:opacity-40 disabled:hover:bg-indigo-600 shadow-glow hover:shadow-glow-lg flex-shrink-0"
            >
              <Send size={16} />
            </button>
          </form>

        </div>

      </div>
    </DashboardLayout>
  );
}
