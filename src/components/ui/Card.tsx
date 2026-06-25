import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className, hover = false, glass = false, onClick, padding = 'md' }: CardProps) {
  const paddingMap = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' };

  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' } : undefined}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={cn(
        'rounded-3xl transition-all duration-200',
        glass
          ? 'backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-white/30 dark:border-slate-700/50 shadow-card'
          : 'bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/50 shadow-card',
        hover && 'cursor-pointer',
        paddingMap[padding],
        className
      )}
    >
      {children}
    </motion.div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  icon: ReactNode;
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple';
}

const colorMap = {
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', icon: 'text-indigo-600 dark:text-indigo-400', badge: 'text-indigo-600' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: 'text-emerald-600 dark:text-emerald-400', badge: 'text-emerald-600' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', icon: 'text-amber-600 dark:text-amber-400', badge: 'text-amber-600' },
  rose: { bg: 'bg-rose-50 dark:bg-rose-900/20', icon: 'text-rose-600 dark:text-rose-400', badge: 'text-rose-600' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', icon: 'text-purple-600 dark:text-purple-400', badge: 'text-purple-600' },
};

export function StatCard({ title, value, change, changeType, icon, color = 'indigo' }: StatCardProps) {
  const colors = colorMap[color];
  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
          {change && (
            <p className={cn(
              'text-xs font-medium mt-1',
              changeType === 'up' ? 'text-emerald-600' : changeType === 'down' ? 'text-rose-500' : 'text-slate-500'
            )}>
              {change}
            </p>
          )}
        </div>
        <div className={cn('p-3 rounded-2xl', colors.bg)}>
          <div className={colors.icon}>{icon}</div>
        </div>
      </div>
    </Card>
  );
}
