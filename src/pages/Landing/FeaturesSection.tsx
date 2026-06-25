import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  ClipboardList, Upload, Eye, Star, Bell, BarChart2,
  Users, FileText, Search, Download, Clock, CheckCircle
} from 'lucide-react';

const features = [
  {
    icon: <ClipboardList size={24} />,
    title: 'Create Assignments',
    description: 'Teachers can create detailed assignments with questions, attachments, due dates, and total marks in seconds.',
    color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20',
  },
  {
    icon: <Upload size={24} />,
    title: 'PDF Submission',
    description: 'Students drag & drop PDF files to submit assignments. Real-time upload progress and instant confirmation.',
    color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    icon: <Eye size={24} />,
    title: 'Built-in PDF Viewer',
    description: 'Teachers review submissions directly in the browser. No downloads needed — evaluate right from the dashboard.',
    color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    icon: <Star size={24} />,
    title: 'Smart Evaluation',
    description: 'Enter marks and detailed feedback for each student. One-click to save and notify students automatically.',
    color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20',
  },
  {
    icon: <Bell size={24} />,
    title: 'Real-time Notifications',
    description: 'Students get notified when new assignments are posted or when their submissions are evaluated.',
    color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20',
  },
  {
    icon: <BarChart2 size={24} />,
    title: 'Analytics Dashboard',
    description: 'Track submission rates, marks distribution, and class performance with beautiful interactive charts.',
    color: 'text-cyan-600', bg: 'bg-cyan-50 dark:bg-cyan-900/20',
  },
  {
    icon: <Users size={24} />,
    title: 'Class Management',
    description: 'Organize students by class and semester. Filter submissions by class, date, or subject effortlessly.',
    color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-900/20',
  },
  {
    icon: <Download size={24} />,
    title: 'Export Results',
    description: 'Export student marks, feedback, and analytics reports as CSV or PDF for your records.',
    color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-900/20',
  },
  {
    icon: <Search size={24} />,
    title: 'Powerful Search',
    description: 'Instantly find any assignment, student, or submission with real-time full-text search.',
    color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900/50" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200/50 dark:border-indigo-700/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-4">
            Features
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Everything you need,{' '}
            <span className="gradient-text">nothing you don't</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            AssignFlow packs every tool teachers and students need into one elegant, fast platform.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/50 shadow-card cursor-default"
            >
              <div className={`w-12 h-12 ${feature.bg} rounded-2xl flex items-center justify-center ${feature.color} mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const stats = [
  { value: '50+', label: 'Colleges', icon: <Users size={20} />, color: 'text-indigo-600' },
  { value: '15,000+', label: 'Students', icon: <CheckCircle size={20} />, color: 'text-emerald-600' },
  { value: '4,100+', label: 'Assignments', icon: <FileText size={20} />, color: 'text-purple-600' },
  { value: '98%', label: 'Uptime SLA', icon: <Clock size={20} />, color: 'text-amber-600' },
];

export function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="py-20" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-black text-white mb-2">Trusted by colleges across India</h2>
            <p className="text-indigo-200">Growing every day. Here's where we are.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="text-center bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20"
              >
                <div className="text-4xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-indigo-200 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
