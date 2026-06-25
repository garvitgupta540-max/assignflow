import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { getAssignments, getSubmissions, getStudents } from '../../services/dbService';
import { formatDate } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  ClipboardList, Users, Clock, CheckCircle, PlusCircle, ArrowRight,
  TrendingUp, FileText, Calendar
} from 'lucide-react';
import type { Assignment, Submission } from '../../types';

export function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [studentCount, setStudentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;
      try {
        setLoading(true);
        const [allAssignments, allSubmissions, allStudents] = await Promise.all([
          getAssignments(user.collegeId),
          getSubmissions(),
          getStudents()
        ]);

        const myAss = allAssignments.filter(a => a.teacherId === user.id);
        const myAssIds = myAss.map(a => a.id);
        const mySubs = allSubmissions.filter(s => myAssIds.includes(s.assignmentId));

        setAssignments(myAss);
        setSubmissions(mySubs);
        setStudentCount(allStudents.length);
      } catch (error) {
        console.error('Error loading teacher dashboard:', error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user]);

  const pendingSubmissions = submissions.filter(s => s.status === 'submitted');
  const evaluatedSubs = submissions.filter(s => s.status === 'evaluated');

  // Hardcoded chart data aligned with mock data for visuals
  const submissionsPerWeek = [
    { week: 'Week 1', submitted: 45, evaluated: 32 },
    { week: 'Week 2', submitted: 67, evaluated: 55 },
    { week: 'Week 3', submitted: 89, evaluated: 71 },
    { week: 'Week 4', submitted: 102, evaluated: 94 },
    { week: 'Week 5', submitted: 78, evaluated: 65 },
    { week: 'Week 6', submitted: submissions.length || 35, evaluated: evaluatedSubs.length || 20 },
  ];

  const marksDistribution = [
    { range: '0-40', count: 4 },
    { range: '41-60', count: 12 },
    { range: '61-75', count: 32 },
    { range: '76-90', count: 48 },
    { range: '91-100', count: 24 },
  ];

  const lateSubmissionData = [
    { name: 'On Time', value: 85, color: '#10B981' },
    { name: 'Late', value: 15, color: '#F59E0B' }
  ];

  // SVG Submission Heatmap matrix (7 days x 20 weeks)
  const heatmapData = Array.from({ length: 7 }, (_, dIdx) =>
    Array.from({ length: 24 }, (_, wIdx) => {
      // Simulate submission activity counts
      return (dIdx * wIdx + 3) % 5;
    })
  );
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
    <DashboardLayout title="Dashboard" subtitle="Teacher Overview">
      <div className="space-y-8">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-[32px] p-8 relative overflow-hidden shadow-[0_16px_32px_rgba(124,58,237,0.15)]">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-8 text-7xl opacity-20 select-none">📝</div>
          <div className="relative z-10">
            <p className="text-purple-200 text-sm font-medium mb-1">Welcome back</p>
            <h2 className="text-3xl font-black text-white mb-2">{user?.name} 👋</h2>
            <p className="text-purple-200 text-sm max-w-lg">
              You have <strong className="text-white">{pendingSubmissions.length} submissions</strong> pending evaluation and{' '}
              <strong className="text-white">{assignments.filter(a => a.status === 'active').length} active assignments</strong>.
            </p>
            <Button
              onClick={() => navigate('/teacher/assignments/create')}
              className="mt-5 bg-white !text-indigo-700 hover:bg-indigo-50 px-6"
              leftIcon={<PlusCircle size={18} />}
            >
              Create New Assignment
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="My Assignments" value={assignments.length} icon={<ClipboardList size={22} />} color="indigo" change="+2 this month" changeType="up" />
          <StatCard title="Total Students" value={studentCount || 32} icon={<Users size={22} />} color="emerald" />
          <StatCard title="Pending Review" value={pendingSubmissions.length} icon={<Clock size={22} />} color="amber" change="Needs attention" changeType="neutral" />
          <StatCard title="Evaluated" value={evaluatedSubs.length} icon={<CheckCircle size={22} />} color="purple" change="All caught up" changeType="up" />
        </div>

        {/* Analytics Row 1: Weekly Activity & Heatmap */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Weekly Activity LineChart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-card">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-5 flex items-center gap-2">
              <TrendingUp size={18} className="text-indigo-500" /> Weekly Activity (Submissions vs Evaluated)
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={submissionsPerWeek} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-700" />
                  <XAxis dataKey="week" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #E2E8F0', background: 'white' }} />
                  <Line type="monotone" dataKey="submitted" stroke="#4F46E5" strokeWidth={3} dot={{ strokeWidth: 2 }} name="Submitted" />
                  <Line type="monotone" dataKey="evaluated" stroke="#10B981" strokeWidth={3} dot={{ strokeWidth: 2 }} name="Evaluated" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Submission Heatmap Grid */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-card flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-5 flex items-center gap-2">
                <Calendar size={18} className="text-emerald-500" /> Daily Submission Activity Heatmap
              </h3>
              <div className="flex flex-col gap-1.5 overflow-x-auto no-scrollbar py-2">
                {heatmapData.map((row, dIdx) => (
                  <div key={dIdx} className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 w-8 font-bold">{DAYS[dIdx]}</span>
                    {row.map((cellVal, wIdx) => {
                      const colorMap = [
                        'bg-slate-100 dark:bg-slate-850',
                        'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600',
                        'bg-indigo-200 dark:bg-indigo-900/40',
                        'bg-indigo-400 dark:bg-indigo-700/60',
                        'bg-indigo-600 dark:bg-indigo-500'
                      ];
                      return (
                        <div
                          key={wIdx}
                          title={`${cellVal} submissions`}
                          className={`w-3.5 h-3.5 rounded-[4px] ${colorMap[cellVal]} transition-all hover:scale-125 cursor-pointer`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold border-t border-slate-100 dark:border-slate-700/50 pt-3 mt-3">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-[2px] bg-slate-100 dark:bg-slate-850" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-indigo-100 dark:bg-indigo-950/40" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-indigo-200 dark:bg-indigo-900/40" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-indigo-400 dark:bg-indigo-700/60" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-indigo-600 dark:bg-indigo-500" />
              </div>
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Analytics Row 2: Performance Distribution & Late Rate */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Class Performance BarChart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-card">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-5 flex items-center gap-2">
              <FileText size={18} className="text-purple-500" /> Grade Performance Distribution
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marksDistribution} barCategoryGap={12}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-700" />
                  <XAxis dataKey="range" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #E2E8F0', background: 'white' }} />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} name="Students Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Late Submission PieChart */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-card">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-5 flex items-center gap-2">
              <Clock size={18} className="text-amber-500" /> Late Submission Distribution
            </h3>
            <div className="h-64 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={lateSubmissionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {lateSubmissionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-slate-800 dark:text-white">15%</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">Late Rate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Assignments */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 font-sans">Recent Assignments</h3>
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />} onClick={() => navigate('/teacher/assignments')}>
              View all
            </Button>
          </div>
          <div className="space-y-3">
            {assignments.length === 0 ? (
              <div className="py-6 text-center text-slate-500 text-sm">No assignments posted yet.</div>
            ) : (
              assignments.slice(0, 4).map(a => (
                <div
                  key={a.id}
                  onClick={() => navigate(`/teacher/assignments/${a.id}`)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer transition-all"
                >
                  <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center">
                    <ClipboardList size={18} className="text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">{a.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{a.subject} · Due {formatDate(a.dueDate)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{a.submissionCount}/{a.totalStudents}</div>
                    <div className="text-xs text-slate-400">submissions</div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-xl font-semibold capitalize ${
                    a.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : a.status === 'draft' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-600 dark:text-slate-300'
                  }`}>
                    {a.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
