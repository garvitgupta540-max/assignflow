import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Shield, ArrowRight, BookOpen, GraduationCap, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
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

export function RegisterPage() {
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  
  // Student specific state
  const [rollNumber, setRollNumber] = useState('');
  const [classCode, setClassCode] = useState('');
  const [semester, setSemester] = useState('1');

  // Teacher specific state
  const [employeeId, setEmployeeId] = useState('');
  const [subjects, setSubjects] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const { registerUser, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      const success = await loginWithGoogle(role);
      if (success) {
        navigate(role === 'student' ? '/student/dashboard' : '/teacher/dashboard');
      } else {
        alert('Google Sign-Up failed. Please try again.');
      }
    } catch (error: any) {
      alert(error?.message || 'An error occurred during Google registration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const extraFields = role === 'student' ? {
      rollNumber,
      class: classCode || 'CS-A',
      semester: parseInt(semester) || 1,
      department,
      cgpa: 8.5,
      totalSubmissions: 0,
      pendingAssignments: 0
    } : {
      employeeId,
      department,
      subjects: subjects.split(',').map(s => s.trim()).filter(Boolean),
      totalAssignments: 0,
      totalStudents: 100,
      classes: ['CSE-A', 'IT-A']
    };

    const success = await registerUser(email, password, name, role, {
      college,
      ...extraFields
    });

    if (success) {
      navigate(role === 'student' ? '/student/dashboard' : '/teacher/dashboard');
    } else {
      alert('Registration failed. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white dark:bg-slate-950">
      {/* Left Panel */}
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 relative overflow-hidden"
      >
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

        <Link to="/" className="flex items-center gap-2 relative z-10">
          <img src="/logo.png" alt="AssignFlow Logo" className="w-9 h-9 bg-white rounded-xl p-1 shadow-sm object-contain flex-shrink-0" />
          <span className="text-xl font-extrabold text-white">AssignFlow</span>
        </Link>

        <div className="relative z-10">
          <div className="text-8xl mb-8">🚀</div>
          <h2 className="text-4xl font-black text-white mb-4">
            Get started in minutes
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Join 500+ colleges and thousands of students who've transformed their assignment workflow.
          </p>
          <div className="space-y-4">
            {['Free forever for small classes', 'No credit card needed', 'Setup in under 5 minutes', 'Mobile friendly'].map(f => (
              <div key={f} className="flex items-center gap-3 text-white/90 text-sm">
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                  <ArrowRight size={12} />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/50 text-sm relative z-10">© 2026 AssignFlow · All rights reserved</p>
      </motion.div>

      {/* Right: Form */}
      <motion.div
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col justify-center p-8 lg:p-16 overflow-y-auto"
      >
        <Link to="/" className="flex items-center gap-2 mb-6 lg:hidden">
          <img src="/logo.png" alt="AssignFlow Logo" className="w-8 h-8 bg-white rounded-xl p-1 shadow-sm border border-slate-100 object-contain flex-shrink-0" />
          <span className="text-lg font-extrabold text-slate-900 dark:text-white">
            Assign<span className="text-indigo-600">Flow</span>
          </span>
        </Link>

        <div className="max-w-sm w-full mx-auto py-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Create your account</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">Get started for free today.</p>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-6 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            {(['student', 'teacher'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                type="button"
                className={cn(
                  'flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all',
                  role === r
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                )}
              >
                {r === 'student' ? <GraduationCap size={16} /> : <BookOpen size={16} />}
                {r === 'student' ? 'Student' : 'Teacher'}
              </button>
            ))}
          </div>

          {/* Google Sign-Up Button */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800/80 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-950 px-3 text-slate-400 dark:text-slate-500 font-semibold tracking-wider">
                Or register with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Your full name"
              value={name}
              onChange={e => setName(e.target.value)}
              leftIcon={<User size={18} />}
              id="register-name"
              required
            />
            <Input
              label="College / Institution"
              placeholder="Your college name"
              value={college}
              onChange={e => setCollege(e.target.value)}
              leftIcon={<Shield size={18} />}
              id="register-college"
              required
            />

            {/* Department (Branch) Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Branch / Department
              </label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Student Specific Fields */}
            {role === 'student' && (
              <>
                <Input
                  label="Roll Number / Registration ID"
                  placeholder="e.g. CS2021001"
                  value={rollNumber}
                  onChange={e => setRollNumber(e.target.value)}
                  leftIcon={<GraduationCap size={18} />}
                  id="register-roll"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Class Section"
                    placeholder="e.g. CSE-A"
                    value={classCode}
                    onChange={e => setClassCode(e.target.value)}
                    leftIcon={<BookOpen size={18} />}
                    id="register-class"
                    required
                  />
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Semester
                    </label>
                    <select
                      value={semester}
                      onChange={e => setSemester(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                        <option key={s} value={s}>Semester {s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Teacher Specific Fields */}
            {role === 'teacher' && (
              <>
                <Input
                  label="Employee ID"
                  placeholder="e.g. EMP001"
                  value={employeeId}
                  onChange={e => setEmployeeId(e.target.value)}
                  leftIcon={<Shield size={18} />}
                  id="register-empid"
                  required
                />
                <Input
                  label="Subjects Taught (comma separated)"
                  placeholder="e.g. Data Structures, Algorithms"
                  value={subjects}
                  onChange={e => setSubjects(e.target.value)}
                  leftIcon={<FileText size={18} />}
                  id="register-subjects"
                  required
                />
              </>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="you@college.edu"
              value={email}
              onChange={e => setEmail(e.target.value)}
              leftIcon={<Mail size={18} />}
              id="register-email"
              required
            />
            <Input
              label="Password"
              type={showPass ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              leftIcon={<Lock size={18} />}
              rightIcon={
                <button type="button" onClick={() => setShowPass(p => !p)}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
              id="register-password"
              required
            />

            <p className="text-xs text-slate-400 dark:text-slate-500">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-indigo-500 hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-indigo-500 hover:underline">Privacy Policy</a>.
            </p>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full justify-center py-3.5 text-base"
              rightIcon={<ArrowRight size={18} />}
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login/student" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setSent(true);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center gap-2 mb-10 justify-center">
          <img src="/logo.png" alt="AssignFlow Logo" className="w-8 h-8 bg-white rounded-xl p-1 shadow-sm border border-slate-100 object-contain flex-shrink-0" />
          <span className="text-lg font-extrabold text-slate-900 dark:text-white">
            Assign<span className="text-indigo-600">Flow</span>
          </span>
        </Link>

        {!sent ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-card">
            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl flex items-center justify-center mb-4">
              <Mail size={28} className="text-indigo-600" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Forgot your password?</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              No worries. Enter your email and we'll send you a reset link.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@college.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                leftIcon={<Mail size={18} />}
                id="forgot-email"
                required
              />
              <Button type="submit" isLoading={isLoading} className="w-full justify-center py-3.5">
                Send Reset Link
              </Button>
            </form>
            <Link to="/login/student" className="block text-center text-sm text-slate-500 hover:text-indigo-600 mt-4 transition-colors">
              ← Back to login
            </Link>
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-card text-center"
          >
            <div className="text-5xl mb-4">📧</div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Check your email</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              We've sent a password reset link to <strong>{email}</strong>. Check your inbox.
            </p>
            <Link to="/login/student">
              <Button variant="secondary" className="w-full justify-center">Back to Login</Button>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
