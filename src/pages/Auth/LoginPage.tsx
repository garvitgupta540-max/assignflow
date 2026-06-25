import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Shield, ArrowRight, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import type { UserRole } from '../../types';

interface AuthPageProps {
  role: UserRole;
}

const roleConfig = {
  student: {
    title: 'Student Login',
    description: 'Access your assignments and submissions',
    icon: <BookOpen size={28} className="text-indigo-600" />,
    bg: 'from-indigo-600 via-purple-600 to-indigo-800',
    demo: { email: 'student@demo.com', label: 'Demo: student@demo.com / any password' },
    redirect: '/student/dashboard',
    illustration: '🎓',
    features: ['View active assignments', 'Submit PDF files', 'Track your marks & feedback', 'Get deadline reminders'],
  },
  teacher: {
    title: 'Teacher Login',
    description: 'Manage assignments and evaluate submissions',
    icon: <Shield size={28} className="text-purple-600" />,
    bg: 'from-purple-600 via-indigo-600 to-purple-800',
    demo: { email: 'teacher@demo.com', label: 'Demo: teacher@demo.com / any password' },
    redirect: '/teacher/dashboard',
    illustration: '📝',
    features: ['Create assignments', 'View student submissions', 'Evaluate & give marks', 'Analytics dashboard'],
  },
  admin: {
    title: 'Admin Login',
    description: 'Manage the entire platform',
    icon: <Shield size={28} className="text-rose-600" />,
    bg: 'from-rose-600 via-orange-600 to-rose-700',
    demo: { email: 'admin@demo.com', label: 'Demo: admin@demo.com / any password' },
    redirect: '/admin/dashboard',
    illustration: '⚙️',
    features: ['Manage colleges', 'View all users', 'Platform analytics', 'System settings'],
  },
};

export function LoginPage({ role }: AuthPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const config = roleConfig[role];

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const success = await loginWithGoogle(role);
      if (success) {
        navigate(config.redirect);
      } else {
        setError('Google Sign-In failed. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred during Google login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const success = await login(email, password, role);
    if (success) {
      navigate(config.redirect);
    } else {
      setError('Invalid credentials. Try the demo account below.');
    }
    setIsLoading(false);
  };

  const handleDemo = () => {
    setEmail(config.demo.email);
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white dark:bg-slate-950">
      {/* Left: Illustration Panel */}
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br ${config.bg} relative overflow-hidden`}
      >
        {/* Background circles */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 relative z-10">
          <img src="/logo.png" alt="AssignFlow Logo" className="w-9 h-9 bg-white rounded-xl p-1 shadow-sm object-contain flex-shrink-0" />
          <span className="text-xl font-extrabold text-white">AssignFlow</span>
        </Link>

        {/* Center Content */}
        <div className="relative z-10">
          <div className="text-8xl mb-8">{config.illustration}</div>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            The smarter way to manage assignments
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Join thousands of educators and students who've made the switch.
          </p>
          <ul className="space-y-3">
            {config.features.map(f => (
              <li key={f} className="flex items-center gap-3 text-white/90 text-sm">
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                  <ArrowRight size={12} />
                </div>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-white/50 text-sm relative z-10">© 2026 AssignFlow · All rights reserved</p>
      </motion.div>

      {/* Right: Form */}
      <motion.div
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col justify-center p-8 lg:p-16"
      >
        {/* Mobile Logo */}
        <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
          <img src="/logo.png" alt="AssignFlow Logo" className="w-8 h-8 bg-white rounded-xl p-1 shadow-sm border border-slate-100 object-contain flex-shrink-0" />
          <span className="text-lg font-extrabold text-slate-900 dark:text-white">
            Assign<span className="text-indigo-600">Flow</span>
          </span>
        </Link>

        <div className="max-w-sm w-full mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center">
              {config.icon}
            </div>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">{config.title}</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">{config.description}</p>

          <div className="w-full mb-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
            <p className="font-medium text-slate-700 dark:text-slate-300">Need a quick preview?</p>
            <button
              type="button"
              onClick={handleDemo}
              className="mt-1 text-indigo-600 hover:text-indigo-700 font-medium underline-offset-2 underline"
            >
              Use sample credentials
            </button>
          </div>

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
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
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@college.edu"
              value={email}
              onChange={e => setEmail(e.target.value)}
              leftIcon={<Mail size={18} />}
              id="login-email"
            />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              leftIcon={<Lock size={18} />}
              rightIcon={
                <button type="button" onClick={() => setShowPassword(p => !p)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
              id="login-password"
            />

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-4 py-2.5 rounded-2xl"
              >
                {error}
              </motion.p>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full justify-center py-3.5 text-base"
              rightIcon={<ArrowRight size={18} />}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                Create one free
              </Link>
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-3">
              {role === 'student' ? (
                <Link to="/login/teacher" className="hover:text-indigo-500">Sign in as Teacher →</Link>
              ) : (
                <Link to="/login/student" className="hover:text-indigo-500">Sign in as Student →</Link>
              )}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
