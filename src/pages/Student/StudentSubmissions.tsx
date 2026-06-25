import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge, getSubmissionBadgeVariant } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { getStudentSubmissions } from '../../services/dbService';
import { formatDate, formatFileSize } from '../../utils/cn';
import { FileText, CheckCircle, MessageSquare, TrendingUp } from 'lucide-react';
import type { Submission } from '../../types';

export function StudentSubmissions() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubmissions() {
      if (!user) return;
      try {
        setLoading(true);
        const data = await getStudentSubmissions(user.id);
        setSubmissions(data);
      } catch (error) {
        console.error('Error fetching student submissions:', error);
      } finally {
        setLoading(false);
      }
    }
    loadSubmissions();
  }, [user]);

  const evaluated = submissions.filter(s => s.status === 'evaluated');
  const avgMarks = evaluated.length
    ? Math.round(evaluated.reduce((sum, s) => sum + ((s.marks || 0) / s.totalMarks * 100), 0) / evaluated.length)
    : 0;

  if (loading) {
    return (
      <DashboardLayout title="My Submissions" subtitle="Loading list...">
        <div className="flex items-center justify-center min-h-[400px]">
          <span className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Submissions" subtitle={`${submissions.length} total submissions`}>
      <div className="space-y-6">
        {/* Summary Strip */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total', value: submissions.length, icon: <FileText size={18} />, color: 'text-indigo-600' },
            { label: 'Evaluated', value: evaluated.length, icon: <CheckCircle size={18} />, color: 'text-emerald-600' },
            { label: 'Avg Score', value: `${avgMarks}%`, icon: <TrendingUp size={18} />, color: 'text-purple-600' },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-card">
              <div className={`flex items-center gap-2 ${s.color} mb-2`}>{s.icon}<span className="text-sm font-semibold">{s.label}</span></div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {submissions.length === 0 ? (
            <div className="text-center py-12 text-slate-500">No submissions found. Submit assignments to see them here!</div>
          ) : (
            submissions.map((sub, i) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-card"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <FileText size={22} className="text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">{sub.assignmentTitle}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                          {sub.fileName} · {formatFileSize(sub.fileSize)} · Submitted {formatDate(sub.submittedAt)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Badge variant={getSubmissionBadgeVariant(sub.status)}>
                          {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                        </Badge>
                        {sub.marks !== undefined && (
                          <div className="text-right">
                            <div className="text-xl font-black text-slate-900 dark:text-white">
                              {sub.marks}<span className="text-sm font-normal text-slate-400">/{sub.totalMarks}</span>
                            </div>
                            <div className="text-xs text-slate-400">{Math.round((sub.marks / sub.totalMarks) * 100)}%</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Marks Bar */}
                    {sub.marks !== undefined && (
                      <div className="mb-3">
                        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(sub.marks / sub.totalMarks) * 100}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className={`h-full rounded-full ${
                              (sub.marks / sub.totalMarks) >= 0.75 ? 'bg-emerald-500' :
                              (sub.marks / sub.totalMarks) >= 0.5 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                          />
                        </div>
                      </div>
                    )}

                    {/* Feedback */}
                    {sub.feedback && (
                      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                          <MessageSquare size={12} />
                          Feedback from {sub.evaluatedBy}
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{sub.feedback}</p>
                      </div>
                    )}

                    {sub.status === 'submitted' && (
                      <p className="text-xs text-slate-400 italic mt-2">
                        ⏳ Pending evaluation. You'll be notified when your submission is reviewed.
                      </p>
                    )}
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
