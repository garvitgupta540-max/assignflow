import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { getAssignments } from '../../services/dbService';
import { useAuth } from '../../context/AuthContext';
import { formatDate, getDaysUntil } from '../../utils/cn';
import { Search, Calendar, BookOpen, ChevronRight, User } from 'lucide-react';
import type { Assignment } from '../../types';

export function StudentAssignments() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed'>('all');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const studentClass = (user as any)?.class || 'CS-A';

  useEffect(() => {
    async function loadAssignments() {
      try {
        setLoading(true);
        const data = await getAssignments();
        // Filter assignments by student class
        const classAssignments = data.filter(a => a.class === studentClass);
        setAssignments(classAssignments);
      } catch (error) {
        console.error('Error fetching student assignments:', error);
      } finally {
        setLoading(false);
      }
    }
    loadAssignments();
  }, [studentClass]);

  const filtered = assignments
    .filter(a => statusFilter === 'all' ? true : a.status === statusFilter)
    .filter(a =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.subject.toLowerCase().includes(search.toLowerCase()) ||
      a.teacherName.toLowerCase().includes(search.toLowerCase())
    );

  if (loading) {
    return (
      <DashboardLayout title="My Assignments" subtitle="Loading list...">
        <div className="flex items-center justify-center min-h-[400px]">
          <span className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Assignments" subtitle={`${filtered.length} assignments`}>
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Search by title, subject, teacher..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            leftIcon={<Search size={18} />}
            className="flex-1"
            id="assignment-search"
          />
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl flex-shrink-0">
            {(['all', 'active', 'closed'] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${
                  statusFilter === f
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="grid gap-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500">No assignments found matching filters.</div>
          ) : (
            filtered.map((a, index) => {
              const daysLeft = getDaysUntil(a.dueDate);
              const isUrgent = a.status === 'active' && daysLeft <= 2;

              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/student/assignments/${a.id}`)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-card hover:shadow-card-hover cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                      <BookOpen size={22} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white leading-tight mb-1">{a.title}</h4>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-400">
                        <span className="font-semibold text-slate-500 dark:text-slate-300">{a.subject}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <User size={12} />
                          {a.teacherName}
                        </span>
                        <span>•</span>
                        <span>{a.totalMarks} Marks</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-4 md:pt-0">
                    <div className="text-left md:text-right">
                      <p className="text-xs text-slate-400 mb-0.5">Due Date</p>
                      <p className={`text-sm font-bold flex items-center gap-1.5 ${isUrgent ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>
                        <Calendar size={14} />
                        {formatDate(a.dueDate)}
                        {a.status === 'active' && (
                          <span className="text-xs font-normal">
                            ({daysLeft === 0 ? 'Today!' : daysLeft === 1 ? 'Tomorrow' : `${daysLeft} days left`})
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant={a.status === 'active' ? 'success' : 'neutral'}>
                        {a.status === 'active' ? 'Active' : 'Closed'}
                      </Badge>
                      <ChevronRight size={18} className="text-slate-400 hidden md:block" />
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
