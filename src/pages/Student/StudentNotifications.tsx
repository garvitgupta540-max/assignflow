import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { getUserNotifications, markNotificationRead, markAllNotificationsRead } from '../../services/dbService';
import { formatDateTime } from '../../utils/cn';
import { Bell, BookOpen, Star, Clock, Settings, CheckCheck } from 'lucide-react';
import type { Notification } from '../../types';

const typeIcons: Record<string, React.ReactNode> = {
  assignment: <BookOpen size={16} className="text-indigo-500" />,
  evaluation: <Star size={16} className="text-amber-500" />,
  reminder: <Clock size={16} className="text-rose-500" />,
  system: <Settings size={16} className="text-slate-500" />,
};

const typeColors: Record<string, string> = {
  assignment: 'bg-indigo-50 dark:bg-indigo-900/20',
  evaluation: 'bg-amber-50 dark:bg-amber-900/20',
  reminder: 'bg-rose-50 dark:bg-rose-900/20',
  system: 'bg-slate-50 dark:bg-slate-700/30',
};

export function StudentNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      if (!user) return;
      try {
        setLoading(true);
        const data = await getUserNotifications(user.id);
        setNotifications(data);
      } catch (e) {
        console.error('Error fetching notifications:', e);
      } finally {
        setLoading(false);
      }
    }
    loadNotifications();
  }, [user]);

  const unread = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = async () => {
    if (!user) return;
    try {
      await markAllNotificationsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Notifications" subtitle="Loading list...">
        <div className="flex items-center justify-center min-h-[400px]">
          <span className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Notifications" subtitle={`${unread} unread`}>
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-indigo-500" />
            <span className="font-bold text-slate-900 dark:text-slate-100">All Notifications</span>
            {unread > 0 && <span className="text-xs bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-full font-bold">{unread} new</span>}
          </div>
          {unread > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllRead} leftIcon={<CheckCheck size={16} />}>
              Mark all read
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-12 text-slate-500">All caught up! No notifications yet.</div>
        ) : (
          notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => handleMarkRead(n.id)}
              className={`relative flex items-start gap-4 p-5 rounded-3xl border cursor-pointer transition-all ${
                !n.read
                  ? 'bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-700/50 shadow-card hover:shadow-card-hover'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              {!n.read && (
                <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-500 rounded-full" />
              )}
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${typeColors[n.type]}`}>
                {typeIcons[n.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm mb-0.5 ${!n.read ? 'text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'}`}>
                  {n.title}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">{n.message}</p>
                <p className="text-xs text-slate-400">{formatDateTime(n.createdAt)}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
