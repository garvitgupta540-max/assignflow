import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, ArrowRight, LogOut, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { verifyInviteCode } from '../../services/dbService';
import { cn } from '../../utils/cn';

const DEPARTMENTS = [
  'Computer Science & Engineering (CSE)',
  'Information Technology (IT)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'Chemical Engineering',
  'Biotechnology'
];

export function OnboardingPage() {
  const { user, completeOnboarding, logout } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [inviteCode, setInviteCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifiedCollege, setVerifiedCollege] = useState<{ id: string; name: string } | null>(null);
  const [verifyError, setVerifyError] = useState('');

  // Student specific
  const [rollNumber, setRollNumber] = useState('');
  const [classCode, setClassCode] = useState('');
  const [semester, setSemester] = useState('1');
  const [studentDept, setStudentDept] = useState(DEPARTMENTS[0]);

  // Teacher specific
  const [employeeId, setEmployeeId] = useState('');
  const [teacherDept, setTeacherDept] = useState(DEPARTMENTS[0]);
  const [subjects, setSubjects] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const handleVerifyCode = async () => {
    if (!inviteCode) return;
    setVerifying(true);
    setVerifyError('');
    setVerifiedCollege(null);

    const match = await verifyInviteCode(inviteCode.trim());
    if (match) {
      if (match.role !== role) {
        setVerifyError(`This invite code is for a ${match.role.toUpperCase()} account, but you selected ${role.toUpperCase()}.`);
      } else {
        setVerifiedCollege({ id: match.collegeId, name: match.collegeName });
      }
    } else {
      setVerifyError('Invalid invitation code. For testing, use MIT-STU (Student) or MIT-TCH (Teacher).');
    }
    setVerifying(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifiedCollege) {
      alert('Please enter and verify a valid college invitation code first.');
      return;
    }

    setSubmitting(true);

    const extraFields = role === 'student' ? {
      rollNumber,
      class: classCode || 'CS-A',
      semester: parseInt(semester) || 1,
      department: studentDept,
      cgpa: 8.5,
      totalSubmissions: 0,
      pendingAssignments: 0,
      streak: 1,
      cgpaTrend: [
        { semester: 1, gpa: 8.5 }
      ]
    } : {
      employeeId,
      department: teacherDept,
      subjects: subjects.split(',').map(s => s.trim()).filter(Boolean),
      totalAssignments: 0,
      totalStudents: 50,
      classes: [classCode || 'CS-A']
    };

    const success = await completeOnboarding(role, verifiedCollege.id, verifiedCollege.name, extraFields);
    if (success) {
      navigate(role === 'student' ? '/student/dashboard' : '/teacher/dashboard');
    } else {
      alert('Failed to complete onboarding. Please try again.');
    }
    setSubmitting(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 relative">
      {/* Background radial mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-20%,rgba(79,70,229,0.08),rgba(255,255,255,0))] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] p-8 relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="AssignFlow Logo" className="w-8 h-8 bg-white rounded-xl p-1 shadow-sm border border-slate-100 object-contain flex-shrink-0" />
            <span className="text-lg font-black text-slate-900 dark:text-white">AssignFlow</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
          >
            <LogOut size={14} /> Cancel & Logout
          </button>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Complete your profile</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Hi {user?.name}, let's link your account to your college workspace to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role selector */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Your Role</label>
            <div className="grid grid-cols-2 gap-3 p-1 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              {(['student', 'teacher'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRole(r);
                    setVerifiedCollege(null);
                    setVerifyError('');
                  }}
                  className={cn(
                    'flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all',
                    role === r
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-100 dark:border-slate-650'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
                  )}
                >
                  {r === 'student' ? <GraduationCap size={16} /> : <BookOpen size={16} />}
                  {r === 'student' ? 'Student' : 'Teacher'}
                </button>
              ))}
            </div>
          </div>

          {/* Invitation Code */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">College Invite Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. MIT-STU"
                value={inviteCode}
                onChange={(e) => {
                  setInviteCode(e.target.value);
                  setVerifiedCollege(null);
                  setVerifyError('');
                }}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-mono uppercase tracking-wider"
                required
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleVerifyCode}
                isLoading={verifying}
                disabled={!inviteCode}
                className="py-3 px-5"
              >
                Verify
              </Button>
            </div>

            {verifiedCollege && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-2 rounded-xl border border-emerald-100 dark:border-emerald-900/30"
              >
                <CheckCircle size={14} />
                <span>Verified: <strong>{verifiedCollege.name}</strong></span>
              </motion.div>
            )}

            {verifyError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2.5 flex items-center gap-1.5 text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/20 px-3 py-2 rounded-xl border border-rose-100 dark:border-rose-900/30"
              >
                <AlertCircle size={14} />
                <span>{verifyError}</span>
              </motion.div>
            )}
          </div>

          {/* Student Fields */}
          {role === 'student' && verifiedCollege && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800"
            >
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Roll Number"
                  placeholder="e.g. CS2021001"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  id="onboard-roll"
                  required
                />
                <Input
                  label="Class Section"
                  placeholder="e.g. CSE-A"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
                  id="onboard-class"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Branch / Dept</label>
                  <select
                    value={studentDept}
                    onChange={(e) => setStudentDept(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Teacher Fields */}
          {role === 'teacher' && verifiedCollege && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800"
            >
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Employee ID"
                  placeholder="e.g. EMP102"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  id="onboard-empid"
                  required
                />
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Department</label>
                  <select
                    value={teacherDept}
                    onChange={(e) => setTeacherDept(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Input
                label="Subjects Taught (comma separated)"
                placeholder="e.g. Data Structures, Algorithms"
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
                id="onboard-subjects"
                required
              />
            </motion.div>
          )}

          <Button
            type="submit"
            isLoading={submitting}
            disabled={!verifiedCollege}
            className="w-full py-4 text-base justify-center mt-4"
            rightIcon={<ArrowRight size={18} />}
          >
            Enter Workspace
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
