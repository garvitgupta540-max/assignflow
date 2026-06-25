import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Play, Sparkles, CheckCircle, TrendingUp, Clock, 
  Users, Flame, RefreshCw 
} from 'lucide-react';

export function HeroSection() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'student' | 'teacher'>('student');

  // Student simulation states
  const [bstProgress, setBstProgress] = useState(65);
  const [isBstSubmitting, setIsBstSubmitting] = useState(false);
  const [bstSubmitted, setBstSubmitted] = useState(false);

  // Teacher simulation states
  const [pendingGradeList, setPendingGradeList] = useState([
    { id: 'sub1', name: 'Rahul Gupta', task: 'BST Implementation', status: 'pending', marks: '' },
    { id: 'sub2', name: 'Sneha Reddy', task: 'SQL Query Lab', status: 'pending', marks: '' }
  ]);
  const [isGrading, setIsGrading] = useState<string | null>(null);
  const [inputMarks, setInputMarks] = useState('95');
  const [avgMarks, setAvgMarks] = useState(82);
  const [totalSubmitted, setTotalSubmitted] = useState(24);

  const handleStudentSubmit = () => {
    if (bstSubmitted || isBstSubmitting) return;
    setIsBstSubmitting(true);
    let current = 65;
    const interval = setInterval(() => {
      current += 7;
      if (current >= 100) {
        clearInterval(interval);
        setBstProgress(100);
        setBstSubmitted(true);
        setIsBstSubmitting(false);
      } else {
        setBstProgress(current);
      }
    }, 80);
  };

  const resetStudentSimulation = () => {
    setBstProgress(65);
    setBstSubmitted(false);
    setIsBstSubmitting(false);
  };

  const submitTeacherGrade = (id: string) => {
    const marks = parseInt(inputMarks) || 95;
    setPendingGradeList(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'graded', marks: `${marks}/100` } : item
    ));
    setTotalSubmitted(prev => prev + 1);
    setAvgMarks(prev => Math.round((prev * 24 + marks) / 25));
    setIsGrading(null);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 mesh-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(79,70,229,0.15),rgba(255,255,255,0))]" />

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Text */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200/50 dark:border-indigo-700/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-6"
          >
            <Sparkles size={14} />
            <span>Now in Public Beta · Join 500+ Colleges</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.05] mb-6"
          >
            Manage College{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800">
              Assignments Smarter
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-lg"
          >
            Create, submit, evaluate, and track assignments from one beautiful platform.
            Ditch Google Forms. Embrace AssignFlow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap gap-4 mb-10"
          >
            <motion.button
              whileHover={{ y: -2, boxShadow: '0 20px 40px rgba(79,70,229,0.3)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/register')}
              className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all shadow-glow"
            >
              Get Started Free
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold px-8 py-4 rounded-2xl text-lg transition-all border border-slate-200 dark:border-slate-700 shadow-card"
            >
              <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                <Play size={14} className="text-indigo-600 ml-0.5" />
              </div>
              Watch Demo
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex flex-wrap gap-x-6 gap-y-2"
          >
            {['No credit card required', 'Free for up to 30 students', 'Setup in 5 minutes'].map((text) => (
              <div key={text} className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                <CheckCircle size={14} className="text-emerald-500" />
                {text}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: Interactive Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative hidden lg:block"
        >
          {/* Main Dashboard Card */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="bg-white dark:bg-slate-900 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] border border-slate-100 dark:border-slate-800 p-6 relative z-10 w-full max-w-[480px] mx-auto"
          >
            {/* Live Preview Switcher */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-650 dark:bg-indigo-400 animate-pulse" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Live Preview</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl flex border border-slate-200/50 dark:border-slate-800/80 shadow-inner">
                <button
                  onClick={() => setActiveView('student')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    activeView === 'student'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-450 shadow-md border border-slate-100 dark:border-slate-800/85'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Student View
                </button>
                <button
                  onClick={() => setActiveView('teacher')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    activeView === 'teacher'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-450 shadow-md border border-slate-100 dark:border-slate-800/85'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Teacher View
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {activeView === 'student' ? (
                <>
                  <div className="bg-indigo-50/50 dark:bg-indigo-950/20 rounded-[20px] p-4 h-[76px] flex flex-col justify-between border border-indigo-100/10">
                    <div className="text-2xl font-black text-slate-850 dark:text-slate-105 tracking-tight leading-none flex items-center gap-1">
                      8.7 <TrendingUp size={14} className="text-emerald-500" />
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">CGPA</div>
                  </div>
                  <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-[20px] p-4 h-[76px] flex flex-col justify-between border border-emerald-100/10">
                    <div className="text-2xl font-black text-slate-850 dark:text-slate-105 tracking-tight leading-none">
                      {bstSubmitted ? 25 : 24}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Submitted</div>
                  </div>
                  <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-[20px] p-4 h-[76px] flex flex-col justify-between border border-amber-100/10">
                    <div className="text-2xl font-black text-slate-850 dark:text-slate-105 tracking-tight leading-none flex items-center gap-0.5">
                      5 <Flame size={16} className="text-amber-550 fill-amber-500" />
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Day Streak</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-indigo-50/50 dark:bg-indigo-950/20 rounded-[20px] p-4 h-[76px] flex flex-col justify-between border border-indigo-100/10">
                    <div className="text-2xl font-black text-slate-850 dark:text-slate-105 tracking-tight leading-none">3</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Classes</div>
                  </div>
                  <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-[20px] p-4 h-[76px] flex flex-col justify-between border border-emerald-100/10">
                    <div className="text-2xl font-black text-slate-850 dark:text-slate-105 tracking-tight leading-none">
                      {totalSubmitted}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Submitted</div>
                  </div>
                  <div className="bg-purple-50/50 dark:bg-purple-950/20 rounded-[20px] p-4 h-[76px] flex flex-col justify-between border border-purple-100/10">
                    <div className="text-2xl font-black text-slate-850 dark:text-slate-105 tracking-tight leading-none">
                      {pendingGradeList.filter(i => i.status === 'pending').length}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">To Grade</div>
                  </div>
                </>
              )}
            </div>

            {/* Main Interactive Workspace Area */}
            <div className="min-h-[220px]">
              <AnimatePresence mode="wait">
                {activeView === 'student' ? (
                  <motion.div
                    key="student-panel"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* Performance Line Chart Sparkline */}
                    <div className="p-4 rounded-3xl bg-slate-50/40 dark:bg-slate-950/30 border border-slate-100/80 dark:border-slate-800/80 shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><TrendingUp size={12} className="text-indigo-500" /> Grade Progression</span>
                        <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">+4.2% sem-over-sem</span>
                      </div>
                      <div className="h-10 w-full flex items-end">
                        <svg className="w-full h-8 overflow-visible" viewBox="0 0 380 30" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="gradient-spark" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25"/>
                              <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0"/>
                            </linearGradient>
                          </defs>
                          <path 
                            d="M 0 25 C 50 20, 100 24, 150 14 C 200 4, 250 18, 300 6 C 340 -2, 360 2, 380 2 L 380 30 L 0 30 Z" 
                            fill="url(#gradient-spark)"
                          />
                          <path 
                            d="M 0 25 C 50 20, 100 24, 150 14 C 200 4, 250 18, 300 6 C 340 -2, 360 2, 380 2" 
                            fill="none" 
                            stroke="#4F46E5" 
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <circle cx="380" cy="2" r="3.5" fill="#4F46E5" />
                        </svg>
                      </div>
                    </div>

                    {/* Assignment Cards */}
                    <div className="space-y-3">
                      {/* BST Assignment Card */}
                      <div className="p-4 rounded-3xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100/50 dark:border-slate-700/30">
                        <div className="flex items-center gap-3.5">
                          <div className={`w-[5px] h-[34px] rounded-full flex-shrink-0 ${bstSubmitted ? 'bg-emerald-500' : 'bg-indigo-600'}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                              <div className="font-extrabold text-slate-900 dark:text-white text-[13px] tracking-tight truncate">Binary Search Tree</div>
                              <div className="text-[11px] font-black text-slate-800 dark:text-slate-200">{bstProgress}%</div>
                            </div>
                            <div className="h-[5px] bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden w-full mb-2">
                              <motion.div 
                                className={`h-full rounded-full ${bstSubmitted ? 'bg-emerald-500' : 'bg-indigo-600'}`} 
                                animate={{ width: `${bstProgress}%` }}
                                transition={{ type: 'spring', stiffness: 80 }}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-[10px] text-slate-400 font-semibold">DSA · Due Jul 10</div>
                              
                              {bstSubmitted ? (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Submitted!</span>
                                  <button 
                                    onClick={resetStudentSimulation}
                                    className="p-1 text-slate-400 hover:text-indigo-650 hover:rotate-180 transition-transform duration-500"
                                    title="Reset Simulation"
                                  >
                                    <RefreshCw size={10} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={handleStudentSubmit}
                                  disabled={isBstSubmitting}
                                  className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                                >
                                  {isBstSubmitting ? (
                                    <>
                                      <span className="w-2 h-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                      Uploading...
                                    </>
                                  ) : (
                                    'Submit PDF'
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SQL Assignment Card */}
                      <div className="p-4 rounded-3xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100/50 dark:border-slate-700/30 opacity-80">
                        <div className="flex items-center gap-3.5">
                          <div className="w-[5px] h-[34px] rounded-full bg-purple-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                              <div className="font-extrabold text-slate-900 dark:text-white text-[13px] tracking-tight truncate">Dijkstra Algorithm</div>
                              <div className="text-[11px] font-black text-slate-800 dark:text-slate-200">20%</div>
                            </div>
                            <div className="h-[5px] bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden w-full mb-1">
                              <div className="h-full bg-purple-500 rounded-full" style={{ width: '20%' }} />
                            </div>
                            <div className="text-[10px] text-slate-400 font-semibold">Algorithms · Due Jul 15</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="teacher-panel"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Clock size={12} className="text-indigo-500" /> Pending Submissions Queue</div>
                    
                    <div className="space-y-3">
                      {pendingGradeList.map((item) => (
                        <div key={item.id} className="p-4 rounded-3xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100/50 dark:border-slate-700/30">
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="text-[13px] font-extrabold text-slate-900 dark:text-white leading-tight mb-0.5">{item.name}</h5>
                              <p className="text-[10px] text-slate-400 font-semibold">{item.task} · Class CS-A</p>
                            </div>

                            {item.status === 'graded' ? (
                              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                Graded: {item.marks}
                              </span>
                            ) : isGrading === item.id ? (
                              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm max-w-[140px]">
                                <input
                                  type="number"
                                  value={inputMarks}
                                  onChange={(e) => setInputMarks(e.target.value)}
                                  className="w-10 text-center text-xs font-black text-slate-905 dark:text-white focus:outline-none"
                                  min="0"
                                  max="100"
                                />
                                <span className="text-slate-400 text-xs font-bold">/100</span>
                                <button
                                  onClick={() => submitTeacherGrade(item.id)}
                                  className="px-2 py-1 bg-emerald-650 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black transition-colors cursor-pointer bg-emerald-600"
                                >
                                  Save
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setIsGrading(item.id);
                                  setInputMarks('95');
                                }}
                                className="text-[10px] font-black px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-650 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors cursor-pointer"
                              >
                                Grade Submission
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Floating Mini Cards */}
          {/* Floating Card 1: Left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
            transition={{ delay: 0.5, y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 } }}
            className="absolute -left-16 top-10 bg-white dark:bg-slate-900 rounded-[22px] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-800 p-5 w-48 z-20"
          >
            {activeView === 'student' ? (
              <>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-5.5 h-5.5 bg-[#E8F8F0] dark:bg-emerald-950/40 rounded-full flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-[#00B474]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200">Evaluated!</span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mb-1">BST Implementation</p>
                <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight">88 <span className="text-xs font-normal text-slate-400 dark:text-slate-500">/100</span></p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-5.5 h-5.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-full flex items-center justify-center text-indigo-650 dark:text-indigo-400">
                    <Users size={12} />
                  </div>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200">CS-A Batch</span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mb-1">Invite Code Active</p>
                <p className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tracking-wider">MIT-CS-A</p>
              </>
            )}
          </motion.div>

          {/* Floating Card 2: Right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, 8, 0] }}
            transition={{ delay: 0.7, y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 } }}
            className="absolute -right-12 bottom-12 bg-white dark:bg-slate-900 rounded-[22px] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-800 p-5 w-52 z-20"
          >
            {activeView === 'student' ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Flame size={16} className="text-amber-550 fill-amber-500" />
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200">Study Streak</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-0.5">5 days active</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Keep it going! 🔥</p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className="text-emerald-500" />
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200">Avg Class Grade</span>
                </div>
                <p className="text-[11px] text-slate-550 dark:text-slate-400 font-semibold mb-0.5">{avgMarks}% Cumulative</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Target: 85%</p>
              </>
            )}
          </motion.div>

          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl blur-3xl -z-10 scale-110" />
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400"
      >
        <span className="text-xs font-medium">Scroll to explore</span>
        <div className="w-5 h-8 border-2 border-slate-300 dark:border-slate-600 rounded-full flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-slate-400 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
