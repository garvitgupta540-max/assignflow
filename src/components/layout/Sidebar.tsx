import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, FileText, Bell, User, LogOut,
  ChevronLeft, ClipboardList, Users, BarChart2, PlusCircle,
  Settings, MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';
import { getInitials } from '../../utils/cn';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  to: string;
}

const studentNav: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, to: '/student/dashboard' },
  { label: 'Assignments', icon: <BookOpen size={20} />, to: '/student/assignments' },
  { label: 'Submissions', icon: <FileText size={20} />, to: '/student/submissions' },
  { label: 'Community', icon: <MessageSquare size={20} />, to: '/student/community' },
  { label: 'Notifications', icon: <Bell size={20} />, to: '/student/notifications' },
  { label: 'Profile', icon: <User size={20} />, to: '/student/profile' },
];

const teacherNav: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, to: '/teacher/dashboard' },
  { label: 'Assignments', icon: <ClipboardList size={20} />, to: '/teacher/assignments' },
  { label: 'Create', icon: <PlusCircle size={20} />, to: '/teacher/assignments/create' },
  { label: 'Students', icon: <Users size={20} />, to: '/teacher/students' },
  { label: 'Community', icon: <MessageSquare size={20} />, to: '/teacher/community' },
  { label: 'Profile', icon: <User size={20} />, to: '/teacher/profile' },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, to: '/admin/dashboard' },
  { label: 'Users', icon: <Users size={20} />, to: '/admin/users' },
  { label: 'Reports', icon: <BarChart2 size={20} />, to: '/admin/reports' },
  { label: 'Settings', icon: <Settings size={20} />, to: '/admin/settings' },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = user?.role === 'student' ? studentNav
    : user?.role === 'teacher' ? teacherNav
    : adminNav;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="flex-shrink-0 h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-40 overflow-hidden"
    >
      {/* Logo */}
      <div className="px-4 h-16 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2"
            >
              <img src="/logo.png" alt="AssignFlow Logo" className="w-8 h-8 bg-white rounded-xl p-1 shadow-sm border border-slate-100 object-contain flex-shrink-0" />
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                Assign<span className="text-indigo-600">Flow</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && (
          <img src="/logo.png" alt="AssignFlow Logo" className="w-8 h-8 bg-white rounded-xl p-1 shadow-sm border border-slate-100 object-contain mx-auto" />
        )}
        <motion.button
          onClick={() => setCollapsed(p => !p)}
          whileTap={{ scale: 0.9 }}
          className={cn(
            'p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex-shrink-0',
            collapsed && 'hidden'
          )}
        >
          <ChevronLeft size={16} className={cn('transition-transform', collapsed && 'rotate-180')} />
        </motion.button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-2xl font-medium transition-all duration-200 group relative',
              isActive
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
            )}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.15 }}
                  className="text-sm whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            {collapsed && (
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        <div className={cn('flex items-center gap-3 px-3 py-2.5 rounded-2xl', collapsed && 'justify-center')}>
          <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {getInitials(user?.name || 'U')}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
