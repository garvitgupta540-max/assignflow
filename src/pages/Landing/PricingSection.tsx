import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    description: 'Perfect for small classes or trying AssignFlow.',
    color: 'border-slate-200 dark:border-slate-700',
    buttonClass: 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800',
    features: [
      'Up to 30 students',
      '3 teachers',
      '5 GB storage',
      'PDF submission',
      'Basic analytics',
      'Email support',
    ],
  },
  {
    name: 'College',
    price: '₹2,999',
    period: '/month',
    description: 'For departments and colleges managing hundreds of students.',
    color: 'border-indigo-500 dark:border-indigo-400',
    badge: 'Most Popular',
    buttonClass: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-glow',
    features: [
      'Unlimited students',
      'Unlimited teachers',
      '100 GB storage',
      'All file types',
      'Advanced analytics',
      'Export results (CSV/PDF)',
      'Priority support',
      'Custom branding',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For universities and large institutions with complex needs.',
    color: 'border-purple-500 dark:border-purple-400',
    buttonClass: 'bg-purple-600 text-white hover:bg-purple-700',
    features: [
      'Everything in College',
      'SSO / SAML login',
      'API access',
      'Dedicated infrastructure',
      'SLA guarantee',
      'On-premise option',
      'Dedicated account manager',
      'Custom integrations',
    ],
  },
];

export function PricingSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="pricing" className="py-24 bg-slate-50 dark:bg-slate-900/50" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200/50 dark:border-indigo-700/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-4">
            Pricing
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Simple, transparent{' '}
            <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Start free, upgrade as you grow. No hidden fees, no surprises.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className={`relative bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 ${plan.color} shadow-card flex flex-col`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-glow">
                    {plan.badge}
                  </span>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-1">{plan.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">{plan.price}</span>
                  <span className="text-slate-500 dark:text-slate-400 mb-1 text-sm">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle size={16} className="text-indigo-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`w-full text-center font-bold py-3.5 rounded-2xl transition-all text-sm ${plan.buttonClass}`}
              >
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="py-24 bg-white dark:bg-slate-950" ref={ref}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 rounded-3xl p-12 md:p-16 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,rgba(255,255,255,0.15),transparent)]" />
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Ready to transform your classroom?
            </h2>
            <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
              Join 500+ colleges already using AssignFlow. Setup takes less than 5 minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="group flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-4 rounded-2xl hover:bg-indigo-50 transition-all shadow-lg text-lg"
              >
                Get Started Free
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login/teacher"
                className="flex items-center gap-2 bg-white/10 border border-white/30 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all text-lg"
              >
                Teacher Login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="AssignFlow Logo" className="w-8 h-8 bg-white rounded-xl p-1 shadow-sm border border-slate-100 object-contain flex-shrink-0" />
              <span className="text-lg font-extrabold text-white">
                Assign<span className="text-indigo-400">Flow</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              The modern assignment management platform for colleges. Built with ❤️ for educators and students.
            </p>
          </div>
          {[
            { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
            { title: 'Support', links: ['Documentation', 'Help Center', 'Contact', 'Status'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-bold text-white mb-4 text-sm">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">© 2026 AssignFlow. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
