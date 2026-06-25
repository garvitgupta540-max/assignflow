import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { getAssignments, getSubmissions, getStudents } from '../../services/dbService';
import { formatDateTime } from '../../utils/cn';
import { 
  Search, ArrowLeft, Calendar, 
  CheckCircle, Clock, ChevronRight 
} from 'lucide-react';
import type { Assignment, Submission, Student } from '../../types';

export function ViewSubmissions() {
  const { id } = useParams<{ id: string }>();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [classStudents, setClassStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    async function loadSubmissionsData() {
      if (!id) return;
      try {
        setLoading(true);
        const [allAssignments, allSubs, allStudents] = await Promise.all([
          getAssignments(),
          getSubmissions(id),
          getStudents()
        ]);

        const foundAssignment = allAssignments.find(a => a.id === id);
        if (foundAssignment) {
          setAssignment(foundAssignment);
          setSubmissions(allSubs);
          
          // Filter students of this class
          const studentsOfClass = allStudents.filter(s => s.class === foundAssignment.class);
          setClassStudents(studentsOfClass);
        }
      } catch (error) {
        console.error('Error loading submissions:', error);
      } finally {
        setLoading(false);
      }
    }
    loadSubmissionsData();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout title="Submissions" subtitle="Loading list...">
        <div className="flex items-center justify-center min-h-[400px]">
          <span className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!assignment) {
    return (
      <DashboardLayout title="Error" subtitle="Assignment not found">
        <div className="text-center py-12">
          <p className="text-slate-500 mb-4">The assignment you are looking for does not exist.</p>
          <Link to="/teacher/assignments">
            <Button leftIcon={<ArrowLeft size={16} />}>Back to Assignments</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  // Find students who haven't submitted yet
  const submittedStudentIds = submissions.map(s => s.studentId);
  const pendingStudents = classStudents.filter(s => !submittedStudentIds.includes(s.id));

  // Combine both submissions and pending to show a complete class roster
  const roster = [
    ...submissions.map(s => ({
      id: s.id,
      studentName: s.studentName,
      studentRoll: s.studentRoll,
      status: s.status,
      submittedAt: s.submittedAt,
      fileName: s.fileName,
      fileSize: s.fileSize,
      marks: s.marks,
      isSubmitted: true,
    })),
    ...pendingStudents.map(student => ({
      id: `pending-${student.id}`,
      studentName: student.name,
      studentRoll: student.rollNumber,
      status: 'pending' as const,
      submittedAt: undefined,
      fileName: undefined,
      fileSize: undefined,
      marks: undefined,
      isSubmitted: false,
    }))
  ];

  const filteredRoster = roster.filter(item => {
    const matchesSearch = item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.studentRoll.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = statusFilter === 'all' || 
                          (statusFilter === 'evaluated' && item.status === 'evaluated') ||
                          (statusFilter === 'submitted' && item.status === 'submitted') ||
                          (statusFilter === 'pending' && item.status === 'pending');
                          
    return matchesSearch && matchesFilter;
  });

  const submissionRate = Math.round((submissions.length / classStudents.length) * 100) || 0;
  const gradedCount = submissions.filter(s => s.status === 'evaluated').length;

  return (
    <DashboardLayout 
      title={assignment.title} 
      subtitle={`Class ${assignment.class} • ${assignment.subject}`}
    >
      <div className="space-y-6">
        {/* Back Link */}
        <Link to="/teacher/assignments" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
          <ArrowLeft size={16} />
          Back to Assignments
        </Link>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-5 flex items-center justify-between border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Due Date</p>
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-sans">
                <Calendar size={16} className="text-indigo-500" />
                {new Date(assignment.dueDate).toLocaleDateString()}
              </h4>
            </div>
          </Card>
          <Card className="p-5 flex items-center justify-between border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Total Submissions</p>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                {submissions.length} <span className="text-sm font-normal text-slate-400">/ {classStudents.length}</span>
              </h4>
            </div>
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
              {submissionRate}%
            </div>
          </Card>
          <Card className="p-5 flex items-center justify-between border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Evaluated</p>
              <h4 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {gradedCount} <span className="text-sm font-normal text-slate-400">/ {submissions.length}</span>
              </h4>
            </div>
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl flex items-center justify-center">
              <CheckCircle size={18} className="text-emerald-600" />
            </div>
          </Card>
          <Card className="p-5 flex items-center justify-between border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Pending Evaluation</p>
              <h4 className="text-2xl font-black text-amber-500">
                {submissions.length - gradedCount}
              </h4>
            </div>
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950/30 rounded-2xl flex items-center justify-center">
              <Clock size={18} className="text-amber-500" />
            </div>
          </Card>
        </div>

        {/* Filters & Actions */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-card flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-80 relative">
            <Input
              type="text"
              placeholder="Search by student name or roll..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 rounded-2xl"
            />
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {['all', 'submitted', 'evaluated', 'pending'].map(filter => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold border transition-all ${
                  statusFilter === filter
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-button'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Roster Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase">Roll No</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase">Student</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase">Submission Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase">Submitted Date</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase">Marks</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRoster.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No records found matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredRoster.map((item) => (
                    <motion.tr 
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors align-middle"
                    >
                      <td className="py-4 px-6 font-mono text-sm text-slate-600 dark:text-slate-400">
                        {item.studentRoll}
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                        {item.studentName}
                      </td>
                      <td className="py-4 px-6">
                        <Badge 
                          variant={
                            item.status === 'evaluated' ? 'success' :
                            item.status === 'submitted' ? 'info' : 'warning'
                          }
                        >
                          {item.status === 'evaluated' ? 'Evaluated' :
                           item.status === 'submitted' ? 'Grading Pending' : 'Not Submitted'}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-500">
                        {item.submittedAt ? formatDateTime(item.submittedAt) : '—'}
                      </td>
                      <td className="py-4 px-6 font-semibold">
                        {item.marks !== undefined ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{item.marks} <span className="text-slate-400 font-normal font-sans">/ {assignment.totalMarks}</span></span>
                        ) : item.isSubmitted ? (
                          <span className="text-amber-500 font-bold">Unmarked</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {item.isSubmitted ? (
                          <Link to={`/teacher/submissions/${item.id}`}>
                            <Button 
                              size="sm" 
                              variant={item.status === 'evaluated' ? 'outline' : 'primary'}
                              rightIcon={<ChevronRight size={14} />}
                            >
                              {item.status === 'evaluated' ? 'View Grading' : 'Grade'}
                            </Button>
                          </Link>
                        ) : (
                          <Button size="sm" variant="ghost" disabled>
                            N/A
                          </Button>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
