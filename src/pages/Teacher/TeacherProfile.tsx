import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { Sparkles } from 'lucide-react';

export function TeacherProfile() {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState(localStorage.getItem('groq_api_key') || '');

  const name = user?.name || 'Teacher User';
  const email = user?.email || 'teacher@demo.com';
  const totalAssignments = (user as any)?.totalAssignments || 28;
  const totalStudents = (user as any)?.totalStudents || 120;
  const classes = (user as any)?.classes || ['CS-A', 'CS-B'];
  const employeeId = user?.employeeId || 'EMP001';
  const department = user?.department || 'Computer Science & Engineering (CSE)';
  const college = user?.college || 'MIT College of Engineering';
  const subjects = (user as any)?.subjects || ['Data Structures', 'Algorithms'];
  const joinDate = user?.joinDate || new Date().toISOString();

  const handleKeyChange = (val: string) => {
    setApiKey(val);
    if (val.trim()) {
      localStorage.setItem('groq_api_key', val.trim());
    } else {
      localStorage.removeItem('groq_api_key');
    }
  };

  return (
    <DashboardLayout title="My Profile" subtitle="Manage your teacher profile">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Avatar Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-card text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-4">
            {name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">{name}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{email}</p>
          <div className="flex justify-center gap-4">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl px-5 py-3">
              <div className="text-lg font-black text-indigo-700 dark:text-indigo-300">{totalAssignments}</div>
              <div className="text-xs text-indigo-500">Assignments</div>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl px-5 py-3">
              <div className="text-lg font-black text-emerald-700 dark:text-emerald-300">{totalStudents}</div>
              <div className="text-xs text-emerald-500">Students Managed</div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl px-5 py-3">
              <div className="text-lg font-black text-amber-700 dark:text-amber-300">{classes.length}</div>
              <div className="text-xs text-amber-500">Classes</div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-card">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4 font-sans">Professional Information</h3>
          <div className="space-y-4">
            {[
              { label: 'Employee ID', value: employeeId },
              { label: 'Department / Branch', value: department },
              { label: 'College', value: college },
              { label: 'Subjects Taught', value: subjects.join(', ') },
              { label: 'Classes Taught', value: classes.join(', ') },
              { label: 'Joined', value: new Date(joinDate).toLocaleDateString() },
            ].map(f => (
              <div key={f.label} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700 last:border-0 font-sans">
                <span className="text-sm text-slate-500 dark:text-slate-400">{f.label}</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 text-right max-w-xs">{f.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Key config */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-card">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2 font-sans">
            <Sparkles size={18} className="text-indigo-500" /> AI Settings (Groq API Key)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed font-sans">
            Enter your personal Groq API Key to enable high-speed AI assistance for grading. Keys are stored locally in your browser cache.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="Paste Groq API Key (gsk_...)"
              value={apiKey}
              onChange={e => handleKeyChange(e.target.value)}
              className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-2xl px-4 py-2.5 text-xs focus:outline-none dark:text-white"
            />
            {apiKey && (
              <button
                type="button"
                onClick={() => handleKeyChange('')}
                className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-2xl border border-rose-100 dark:border-rose-900/30"
              >
                Clear Key
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
