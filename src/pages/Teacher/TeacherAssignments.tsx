import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { getAssignments } from '../../services/dbService';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/cn';
import { PlusCircle, Search, ClipboardList, Calendar, Users, ChevronRight } from 'lucide-react';
import type { Assignment } from '../../types';

export function TeacherAssignments() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'draft' | 'closed'>('all');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadAssignments() {
      if (!user) return;
      try {
        setLoading(true);
        const data = await getAssignments();
        const myAss = data.filter(a => a.teacherId === user.id);
        setAssignments(myAss);
      } catch (error) {
        console.error('Error fetching teacher assignments:', error);
      } finally {
        setLoading(false);
      }
    }
    loadAssignments();
  }, [user]);

  const filtered = assignments
    .filter(a => filter === 'all' ? true : a.status === filter)
    .filter(a =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.subject.toLowerCase().includes(search.toLowerCase())
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
    <DashboardLayout title="My Assignments" subtitle={`${assignments.length} total`}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <Input
              placeholder="Search assignments..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              leftIcon={<Search size={18} />}
              className="sm:max-w-xs"
              id="teacher-assignment-search"
            />
            <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              {(['all', 'active', 'draft', 'closed'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all capitalize ${
                    filter === f
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <Button
            leftIcon={<PlusCircle size={18} />}
            onClick={() => navigate('/teacher/assignments/create')}
            className="rounded-2xl"
          >
            Create New
          </Button>
        </div>

        {/* List */}
        <div className="grid gap-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500">No assignments found matching filters.</div>
          ) : (
            filtered.map((a, index) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/teacher/assignments/${a.id}`)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-card hover:shadow-card-hover cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                    <ClipboardList size={22} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white leading-tight mb-1">{a.title}</h4>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-400">
                      <span className="font-semibold text-slate-500 dark:text-slate-300">{a.subject}</span>
                      <span>•</span>
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] font-bold text-slate-500">
                        Class {a.class}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-8 border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-4 md:pt-0">
                  <div className="flex gap-6 text-left md:text-right">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-0.5">Submissions</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        <Users size={14} className="text-indigo-500" />
                        {a.submissionCount} <span className="font-normal text-slate-400 text-xs">/ {a.totalStudents}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-0.5">Due Date</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        <Calendar size={14} className="text-slate-400" />
                        {formatDate(a.dueDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={
                      a.status === 'active' ? 'success' :
                      a.status === 'draft' ? 'warning' : 'neutral'
                    }>
                      {a.status.toUpperCase()}
                    </Badge>
                    <ChevronRight size={18} className="text-slate-400 hidden md:block" />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
