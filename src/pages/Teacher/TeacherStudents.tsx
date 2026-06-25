import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { getStudents } from '../../services/dbService';
import { Search, Award, BookOpen, Clock } from 'lucide-react';
import type { Student } from '../../types';

export function TeacherStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');

  useEffect(() => {
    async function loadStudents() {
      try {
        setLoading(true);
        const data = await getStudents();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching student roster:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  const classes = ['all', ...Array.from(new Set(students.map(s => s.class)))];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'all' || student.class === classFilter;
    return matchesSearch && matchesClass;
  });

  // Calculate statistics
  const avgCgpa = students.length > 0 
    ? (students.reduce((sum, s) => sum + (s.cgpa || 0), 0) / students.length).toFixed(2)
    : '0.0';
    
  const totalSubmissions = students.reduce((sum, s) => sum + (s.totalSubmissions || 0), 0);

  if (loading) {
    return (
      <DashboardLayout title="Student Directory" subtitle="Loading list...">
        <div className="flex items-center justify-center min-h-[400px]">
          <span className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Student Directory" subtitle="Overview of your students and their performance">
      <div className="space-y-6">
        {/* Statistics cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Students</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white">{students.length}</h3>
              </div>
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <BookOpen size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Average CGPA</p>
                <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{avgCgpa}</h3>
              </div>
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Award size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Submissions</p>
                <h3 className="text-3xl font-black text-amber-500">{totalSubmissions}</h3>
              </div>
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Clock size={24} />
              </div>
            </div>
          </Card>
        </div>

        {/* Filter bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-card flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-80 relative">
            <Input
              type="text"
              placeholder="Search by name, roll no, email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 rounded-2xl"
            />
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar py-1">
            {classes.map(c => (
              <button
                key={c}
                onClick={() => setClassFilter(c)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold border transition-all whitespace-nowrap ${
                  classFilter === c
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-button'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                }`}
              >
                {c === 'all' ? 'All Classes' : `Class ${c}`}
              </button>
            ))}
          </div>
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500">
              No students found matching your criteria.
            </div>
          ) : (
            filteredStudents.map((student, i) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-card hover:shadow-card-hover hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all flex flex-col justify-between"
              >
                {/* Header */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-lg">
                      {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{student.name}</h4>
                      <p className="font-mono text-xs text-slate-400">{student.rollNumber}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-between text-xs py-1 border-b border-slate-50 dark:border-slate-800/50">
                      <span className="text-slate-400">Class & Semester</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Class {student.class} • Sem {student.semester || 1}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1 border-b border-slate-50 dark:border-slate-800/50">
                      <span className="text-slate-400">Branch / Department</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[180px]" title={student.department}>
                        {student.department || 'General'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1 border-b border-slate-50 dark:border-slate-800/50">
                      <span className="text-slate-400">Email Address</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[180px]" title={student.email}>
                        {student.email}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1">
                      <span className="text-slate-400">Join Date</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{new Date(student.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Score stats */}
                <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl p-3 flex justify-between text-center">
                  <div className="flex-1">
                    <div className="text-xs text-slate-400 mb-0.5">CGPA</div>
                    <div className="text-base font-black text-indigo-600 dark:text-indigo-400">{student.cgpa || '8.5'}</div>
                  </div>
                  <div className="w-px bg-slate-200 dark:bg-slate-800" />
                  <div className="flex-1">
                    <div className="text-xs text-slate-400 mb-0.5">Submissions</div>
                    <div className="text-base font-black text-emerald-600 dark:text-emerald-400">{student.totalSubmissions || 0}</div>
                  </div>
                  <div className="w-px bg-slate-200 dark:bg-slate-800" />
                  <div className="flex-1">
                    <div className="text-xs text-slate-400 mb-0.5">Pending</div>
                    <div className="text-base font-black text-rose-500">{student.pendingAssignments || 0}</div>
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
