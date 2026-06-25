import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/ui/Card';
import { Badge, getSubmissionBadgeVariant } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { getAssignments, getStudentSubmissions, getStudentTimetable } from '../../services/dbService';
import { formatDate, getDaysUntil } from '../../utils/cn';
import { BookOpen, CheckCircle, Clock, TrendingUp, Calendar, ArrowRight, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Assignment, Submission } from '../../types';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [timetable, setTimetable] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Student specific details falling back to user properties
  const studentClass = (user as any)?.class || 'CS-A';
  const studentCgpa = (user as any)?.cgpa || 8.7;
  const studentRollNumber = user?.rollNumber || 'CS2021001';
  const streakDays = (user as any)?.streak || 5;

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        setLoading(true);
        const [allAssignments, studentSubs, studentSchedule] = await Promise.all([
          getAssignments(user.collegeId),
          getStudentSubmissions(user.id),
          getStudentTimetable(user.id)
        ]);

        // Filter assignments matching student class
        const classAssignments = allAssignments.filter(a => a.class === studentClass);
        setAssignments(classAssignments);
        setSubmissions(studentSubs);
        setTimetable(studentSchedule);
      } catch (error) {
        console.error('Error fetching student dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user, studentClass]);

  const activeAssignments = assignments.filter(a => a.status === 'active');
  const submittedIds = submissions.map(s => s.assignmentId);
  const pendingAssignmentsCount = activeAssignments.filter(a => !submittedIds.includes(a.id)).length;
  
  const evaluated = submissions.filter(s => s.status === 'evaluated');
  const avgMarks = evaluated.length > 0
    ? Math.round(evaluated.reduce((sum, s) => sum + ((s.marks || 0) / s.totalMarks * 100), 0) / evaluated.length)
    : 0;

  const upcoming = activeAssignments
    .filter(a => !submittedIds.includes(a.id)) // Filter out already submitted
    .map(a => ({ ...a, daysLeft: getDaysUntil(a.dueDate) }))
    .filter(a => a.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 3);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // GPA Chart Data
  const cgpaData = (user as any)?.cgpaTrend || [
    { semester: 1, gpa: 8.2 },
    { semester: 2, gpa: 8.5 },
    { semester: 3, gpa: 8.3 },
    { semester: 4, gpa: 8.8 },
    { semester: 5, gpa: 8.6 },
    { semester: 6, gpa: studentCgpa }
  ];

  if (loading) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Loading metrics...">
        <div className="flex items-center justify-center min-h-[400px]">
          <span className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard" subtitle="Welcome back to AssignFlow">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Welcome Card */}
        <motion.div variants={itemVariants}>
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-[32px] p-8 relative overflow-hidden shadow-[0_16px_32px_rgba(79,70,229,0.15)]">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-8 text-7xl opacity-20 select-none">🎓</div>
            <div className="relative z-10">
              <p className="text-indigo-200 text-sm font-medium mb-1">{greeting}</p>
              <h2 className="text-3xl font-black text-white mb-2">{user?.name}! 👋</h2>
              <p className="text-indigo-200 text-sm max-w-lg">
                You have <strong className="text-white">{pendingAssignmentsCount} assignments</strong> pending and{' '}
                <strong className="text-white">{upcoming.length} due this week</strong>. Keep it up!
              </p>
              <div className="flex flex-wrap gap-3 mt-5">
                <div className="bg-white/10 rounded-2xl px-4 py-2 border border-white/10">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-200">Roll No</div>
                  <div className="font-bold text-white text-sm">{studentRollNumber}</div>
                </div>
                <div className="bg-white/10 rounded-2xl px-4 py-2 border border-white/10">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-200">Class</div>
                  <div className="font-bold text-white text-sm">{studentClass}</div>
                </div>
                <div className="bg-white/10 rounded-2xl px-4 py-2 border border-white/10">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-200">CGPA</div>
                  <div className="font-bold text-white text-sm">{studentCgpa}</div>
                </div>
                <div className="bg-white/10 rounded-2xl px-4 py-2 border border-white/10 flex items-center gap-2">
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-200">Streak</div>
                    <div className="font-bold text-white text-sm">{streakDays} Days</div>
                  </div>
                  <span className="text-xl">🔥</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Active Assignments" value={activeAssignments.length} icon={<BookOpen size={22} />} color="indigo" change="+2 this week" changeType="up" />
          <StatCard title="Submitted" value={submissions.length} icon={<CheckCircle size={22} />} color="emerald" change="On track" changeType="neutral" />
          <StatCard title="Pending" value={pendingAssignmentsCount} icon={<Clock size={22} />} color="amber" change="Due soon" changeType="neutral" />
          <StatCard title="Avg Marks" value={`${avgMarks}%`} icon={<TrendingUp size={22} />} color="purple" change={`+5% vs last month`} changeType="up" />
        </motion.div>

        {/* Analytics Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recharts GPA Progress Area Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2 bg-white dark:bg-slate-800/80 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-card">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-indigo-500" /> Academic Performance Trend (CGPA)
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cgpaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cgpaGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-700" />
                  <XAxis dataKey="semester" stroke="#94A3B8" fontSize={11} tickFormatter={(val) => `Sem ${val}`} />
                  <YAxis domain={[0, 10]} stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #E2E8F0', background: 'white' }} />
                  <Area type="monotone" dataKey="gpa" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#cgpaGlow)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Today's schedule */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800/80 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-card">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-5">
              <Clock size={18} className="text-indigo-500" /> Today's Schedule
            </h3>
            <div className="space-y-3.5">
              {timetable.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm">No classes scheduled. Day off!</div>
              ) : (
                timetable.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-150 text-sm">{item.subject}</p>
                      <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">{item.day}</p>
                    </div>
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 rounded-xl">
                      {item.startTime} - {item.endTime}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Deadlines */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800/80 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-card">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Calendar size={18} className="text-indigo-500" /> Upcoming Deadlines
              </h3>
              <button onClick={() => navigate('/student/assignments')} className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1">
                View all <ArrowRight size={12} />
              </button>
            </div>
            <div className="space-y-3">
              {upcoming.length === 0 ? (
                <div className="py-6 text-center text-slate-500 text-sm">No upcoming deadlines. All caught up!</div>
              ) : (
                upcoming.map((a) => {
                  const isUrgent = a.daysLeft <= 2;
                  return (
                    <motion.div
                      key={a.id}
                      whileHover={{ x: 4 }}
                      onClick={() => navigate(`/student/assignments/${a.id}`)}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                    >
                      <div className={`w-2 h-12 rounded-full flex-shrink-0 ${isUrgent ? 'bg-rose-400' : 'bg-indigo-400'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">{a.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{a.subject} · {a.totalMarks} marks</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-sm font-bold ${isUrgent ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>
                          {a.daysLeft === 0 ? 'Today!' : a.daysLeft === 1 ? 'Tomorrow' : `${a.daysLeft}d`}
                        </p>
                        <p className="text-xs text-slate-400">{formatDate(a.dueDate)}</p>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>

          {/* Recent Submissions */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800/80 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-card">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileText size={18} className="text-emerald-500" /> Recent Submissions
              </h3>
              <button onClick={() => navigate('/student/submissions')} className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1">
                View all <ArrowRight size={12} />
              </button>
            </div>
            <div className="space-y-3">
              {submissions.length === 0 ? (
                <div className="py-6 text-center text-slate-500 text-sm">No recent submissions found.</div>
              ) : (
                submissions.slice(0, 3).map((sub) => (
                  <div key={sub.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <FileText size={18} className="text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">{sub.assignmentTitle}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(sub.submittedAt)}</p>
                    </div>
                    <div className="text-right flex-shrink-0 space-y-1">
                      <Badge variant={getSubmissionBadgeVariant(sub.status)}>
                        {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                      </Badge>
                      {sub.marks !== undefined && (
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{sub.marks}/{sub.totalMarks}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
