import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { PlusCircle, Upload, Star, CheckCircle } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Teacher Creates Assignment',
    description: 'Teacher adds assignment title, description, subject, due date, and total marks. Attach question PDFs if needed.',
    icon: <PlusCircle size={28} />,
    color: 'from-indigo-500 to-indigo-600',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    detail: ['Set deadline & marks', 'Add question files', 'Choose target class'],
  },
  {
    step: '02',
    title: 'Student Submits Assignment',
    description: 'Students receive notifications, view assignment details, write answers, and submit PDF files via drag & drop.',
    icon: <Upload size={28} />,
    color: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    detail: ['Drag & drop upload', 'Real-time progress', 'Instant confirmation'],
  },
  {
    step: '03',
    title: 'Teacher Evaluates',
    description: 'Teacher opens the submission, views the PDF inline, enters marks and detailed feedback, then saves evaluation.',
    icon: <Star size={28} />,
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    detail: ['Inline PDF viewer', 'Enter marks & feedback', 'Save with one click'],
  },
  {
    step: '04',
    title: 'Student Gets Results',
    description: 'Students are notified and can view their marks, detailed feedback, and submission history from their dashboard.',
    icon: <CheckCircle size={28} />,
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    detail: ['Instant notification', 'View marks & feedback', 'Track progress'],
  },
];

export function HowItWorksSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="how-it-works" className="py-24 bg-white dark:bg-slate-950" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200/50 dark:border-indigo-700/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-4">
            How It Works
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4">
            From assignment to{' '}
            <span className="gradient-text">results in 4 steps</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            A simple, intuitive workflow that saves hours every week.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12 }}
              className="relative"
            >
              {/* Connector Line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] right-0 h-0.5 bg-gradient-to-r from-indigo-200 to-transparent dark:from-indigo-800 z-0" />
              )}

              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-card relative z-10 h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white shadow-glow`}>
                    {step.icon}
                  </div>
                  <span className="text-4xl font-black text-slate-100 dark:text-slate-700">{step.step}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">{step.description}</p>
                <ul className="space-y-1.5">
                  {step.detail.map(d => (
                    <li key={d} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    name: 'Dr. Priya Menon',
    role: 'HOD, Computer Science',
    college: 'MIT College of Engineering',
    content: 'AssignFlow has completely transformed how we manage assignments. What used to take me hours of email sorting now takes minutes. The evaluation interface is incredibly intuitive.',
    rating: 5,
    avatar: 'PM',
    color: 'bg-indigo-600',
  },
  {
    name: 'Arjun Sharma',
    role: 'Final Year Student',
    college: 'MIT College, Mumbai',
    content: 'I love being able to just drag and drop my PDF and see it upload instantly. Getting marks and feedback directly in the app is so much better than waiting for Google Forms results.',
    rating: 5,
    avatar: 'AS',
    color: 'bg-emerald-600',
  },
  {
    name: 'Prof. Rajesh Kumar',
    role: 'Associate Professor',
    college: 'VIT Vellore',
    content: 'The analytics dashboard gives me insights I never had before. I can see exactly which students are struggling and which assignments are too complex. Game changer for teaching.',
    rating: 5,
    avatar: 'RK',
    color: 'bg-purple-600',
  },
  {
    name: 'Sneha Reddy',
    role: 'Student, CS-B',
    college: 'BITS Pilani',
    content: 'The deadline reminders are a lifesaver! I never miss an assignment now. And seeing my feedback laid out so clearly helps me understand where I need to improve.',
    rating: 5,
    avatar: 'SR',
    color: 'bg-rose-500',
  },
  {
    name: 'Dr. Kavitha Iyer',
    role: 'Principal',
    college: 'Pune University',
    content: 'AssignFlow helped our entire college go digital in one semester. The admin dashboard gives us complete visibility into how our departments are performing.',
    rating: 5,
    avatar: 'KI',
    color: 'bg-amber-600',
  },
  {
    name: 'Vikram Nair',
    role: 'Teaching Assistant',
    college: 'IIT Bombay',
    content: 'Managing 200+ student submissions per week was a nightmare. AssignFlow made it so organized — I can filter, search, and evaluate all from one screen.',
    rating: 5,
    avatar: 'VN',
    color: 'bg-teal-600',
  },
];

export function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="testimonials" className="py-24 bg-slate-50 dark:bg-slate-900/50 overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200/50 dark:border-indigo-700/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Loved by teachers{' '}
            <span className="gradient-text">and students alike</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-card"
            >
              <div className="flex mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-6">
                "{t.content}"
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${t.color} rounded-2xl flex items-center justify-center text-white font-bold text-sm`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{t.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.role} · {t.college}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const faqs = [
  {
    q: 'Is AssignFlow free to use?',
    a: 'Yes! The Free plan supports up to 30 students and 3 teachers, perfect for small classes. For larger institutions, we offer the College and Enterprise plans.',
  },
  {
    q: 'What file formats are supported for submission?',
    a: 'Currently AssignFlow supports PDF files. We plan to add image uploads (JPG/PNG) and Google Docs integration in future updates.',
  },
  {
    q: 'Can students submit assignments after the deadline?',
    a: 'Teachers can configure late submission policies. By default, late submissions are accepted but marked as "Late" so teachers can see them separately.',
  },
  {
    q: 'How secure is student data?',
    a: 'We take security seriously. All files are encrypted at rest and in transit. Student data is never shared with third parties.',
  },
  {
    q: 'Can multiple teachers use the same class?',
    a: 'Absolutely. Multiple teachers can be assigned to the same class, each managing their own assignments independently.',
  },
  {
    q: 'Is there a mobile app?',
    a: 'AssignFlow is fully mobile-responsive and works great on any device through the browser. Native iOS and Android apps are on our roadmap.',
  },
];

export function FAQSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="faq" className="py-24 bg-white dark:bg-slate-950" ref={ref}>
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200/50 dark:border-indigo-700/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-4">
            FAQ
          </span>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
            Frequently asked questions
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07 }}
              className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-700"
            >
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">{faq.q}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
