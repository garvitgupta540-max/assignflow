import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Sparkles, Zap, Cpu } from 'lucide-react';

export function FounderSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const techHighlights = [
    {
      icon: <Cpu className="text-indigo-500" size={20} />,
      title: 'Architectural Vision',
      desc: 'Built on logic-based multi-tenancy to host thousands of departments seamlessly.',
    },
    {
      icon: <Sparkles className="text-purple-500" size={20} />,
      title: 'AI Native Pipeline',
      desc: 'Pioneered secure client-side OCR & LLM loops to protect institution API key keys.',
    },
    {
      icon: <Shield className="text-emerald-500" size={20} />,
      title: 'Security-First',
      desc: 'Designed with robust portal barriers preventing role-crossing and user breaches.',
    },
  ];

  return (
    <section id="founder" className="relative py-24 bg-slate-50 dark:bg-slate-900/50 overflow-hidden" ref={ref}>
      {/* Background Decorative Mesh */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Interactive Visual Frame */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative group max-w-sm w-full">
              {/* Outer decorative glowing ring */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[2.5rem] blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />
              
              {/* Picture Card Wrapper */}
              <div className="relative bg-white dark:bg-slate-800 p-4 rounded-[2.2rem] border border-slate-200/60 dark:border-slate-700/50 shadow-2xl">
                <div className="relative aspect-square overflow-hidden rounded-[1.8rem] bg-slate-100 dark:bg-slate-950">
                  <img
                    src="/garvit_gupta_founder.png"
                    alt="Garvit Gupta"
                    className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Floating Overlay Badge */}
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-center">
                    <p className="text-white text-base font-black tracking-wide">Garvit Gupta</p>
                    <p className="text-indigo-400 text-xs font-semibold tracking-wider uppercase mt-0.5">Founder & Lead Architect</p>
                  </div>
                </div>
              </div>
              
              {/* Decorative floating stats widget */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.4 }}
                className="absolute -right-6 -top-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-xl flex items-center gap-3 hidden md:flex"
              >
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl flex items-center justify-center">
                  <Zap className="text-indigo-600 dark:text-indigo-400" size={20} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Vision Statement</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Empower education, simplify workflow</div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Vision Copy */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200/50 dark:border-indigo-700/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold">
                Founder's Corner
              </span>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                Designed to make <span className="gradient-text">academic tracking frictionless</span>
              </h2>
            </div>

            <div className="space-y-4 font-sans text-base leading-relaxed text-slate-600 dark:text-slate-400">
              <p>
                "At AssignFlow, our core thesis is simple: teachers should spend their time teaching and mentoring, not drowning in spreadsheets or tracking missing emails. The platform was built to transform daily admin tasks into clean, intuitive digital loops."
              </p>
              <p>
                As founder, my focus has been to architect a premium, scalable system that adapts to modern institutions. By introducing multi-tenancy, secure client-side AI analysis, and robust user barriers, we ensure that every college gets an enterprise-grade experience.
              </p>
            </div>

            {/* Grid Highlights */}
            <div className="grid sm:grid-cols-3 gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
              {techHighlights.map((highlight, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
                    {highlight.icon}
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white font-sans">{highlight.title}</h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed">{highlight.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
