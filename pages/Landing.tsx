
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Brain, Shield, Target, Activity, Heart, Sparkles, TrendingUp, Users, BookOpen, CheckCircle2, ChevronRight, ListChecks } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const Landing: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState('');
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Track active section
    const handleScroll = () => {
      const sections = ['workflow', 'features', 'stats'];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Offset for fixed navbar
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px]"
          animate={{
            x: mousePosition.x / 20,
            y: mousePosition.y / 20,
          }}
          transition={{ type: "spring", stiffness: 50 }}
          style={{ left: '10%', top: '20%' }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px]"
          animate={{
            x: -mousePosition.x / 30,
            y: -mousePosition.y / 30,
          }}
          transition={{ type: "spring", stiffness: 50 }}
          style={{ right: '10%', bottom: '20%' }}
        />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-indigo-400/30 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
            }}
            animate={{
              y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080)],
              x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920)],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-50 max-w-7xl mx-auto px-8 py-8"
      >
        <div className="flex items-center justify-between backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl px-8 py-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/50"
            >
              <Zap size={24} strokeWidth={2.5} fill="currentColor" />
            </motion.div>
            <span className="text-2xl font-black tracking-tight text-white">Axent<span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AI</span></span>
          </div>

          <div className="hidden lg:flex items-center gap-12 text-[13px] font-bold uppercase tracking-widest">
            <button
              onClick={() => scrollToSection('workflow')}
              className={`transition-colors relative group ${activeSection === 'workflow' ? 'text-white' : 'text-slate-300 hover:text-white'}`}
            >
              Workflow
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-indigo-400 transition-all ${activeSection === 'workflow' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className={`transition-colors relative group ${activeSection === 'features' ? 'text-white' : 'text-slate-300 hover:text-white'}`}
            >
              Features
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-indigo-400 transition-all ${activeSection === 'features' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </button>
            <button
              onClick={() => scrollToSection('stats')}
              className={`transition-colors relative group ${activeSection === 'stats' ? 'text-white' : 'text-slate-300 hover:text-white'}`}
            >
              Impact
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-indigo-400 transition-all ${activeSection === 'stats' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </button>
          </div>

          <Link to="/setup" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3.5 rounded-2xl text-sm font-bold hover:shadow-2xl hover:shadow-indigo-500/50 transition-all flex items-center gap-2 group">
            Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative max-w-7xl mx-auto px-8 pt-32 pb-40 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-indigo-500/20 text-indigo-300 text-[11px] font-black uppercase tracking-[0.2em] mb-12 shadow-xl"
          >
            <Sparkles size={16} className="animate-pulse" />
            <span>AI-Powered Academic Mastery</span>
          </motion.div>

          <h1 className="text-7xl md:text-9xl font-black text-white tracking-tight mb-8 leading-[0.95]">
            Master Your
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              Academic Journey
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-2xl text-slate-300 font-medium mb-16 leading-relaxed">
            Transform chaos into clarity with AI-driven study planning designed for engineering excellence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <Link to="/setup" className="group relative w-full sm:w-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition"></div>
              <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-3 shadow-2xl">
                Start Your Journey <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
            <button
              onClick={() => scrollToSection('workflow')}
              className="w-full sm:w-auto backdrop-blur-xl bg-white/5 border border-white/10 text-white px-12 py-6 rounded-3xl font-bold text-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3"
            >
              See How It Works <ChevronRight size={24} />
            </button>
          </div>

          {/* Floating Stats */}
          <motion.div
            id="stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {[
              { icon: Users, value: "500+", label: "Active Students" },
              { icon: BookOpen, value: "50+", label: "Subjects Covered" },
              { icon: TrendingUp, value: "85%", label: "Success Rate" },
              { icon: CheckCircle2, value: "10K+", label: "Tasks Completed" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5, scale: 1.05 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
              >
                <stat.icon className="w-8 h-8 text-indigo-400 mb-3 mx-auto" />
                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Interactive Workflow Section */}
      <section id="workflow" className="relative py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/50 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <span className="text-indigo-400 font-black text-[11px] uppercase tracking-[0.3em] mb-4 block">Your Path to Excellence</span>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6">
              Three Steps to <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Mastery</span>
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-xl">Transform academic chaos into a structured journey of success.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Animated Connecting Line */}
            <svg className="hidden md:block absolute top-24 left-0 w-full h-2 -z-10" style={{ height: '2px' }}>
              <motion.line
                x1="10%"
                y1="1"
                x2="90%"
                y2="1"
                stroke="url(#gradient)"
                strokeWidth="2"
                strokeDasharray="8 4"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
                  <stop offset="50%" stopColor="#6366f1" stopOpacity="1" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {[
              {
                step: "01",
                title: "Define Your Goals",
                desc: "Input your subjects, exam dates, and study preferences. Tell us when you're most productive.",
                icon: Target,
                color: "from-blue-500 to-indigo-500"
              },
              {
                step: "02",
                title: "AI Optimization",
                desc: "Our intelligent engine analyzes your syllabus and creates a personalized, scientifically-optimized roadmap.",
                icon: Brain,
                color: "from-indigo-500 to-purple-500"
              },
              {
                step: "03",
                title: "Track & Evolve",
                desc: "Follow your plan and watch it adapt in real-time. Missed a session? AI recalibrates instantly.",
                icon: Activity,
                color: "from-purple-500 to-pink-500"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[40px] blur opacity-25 group-hover:opacity-75 transition duration-500"></div>

                <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-10 rounded-[36px] hover:border-white/40 transition-all">
                  <div className="relative w-28 h-28 mx-auto mb-8">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-full blur-xl opacity-50 group-hover:opacity-100 transition`}></div>
                    <div className="relative w-full h-full bg-slate-900 border-4 border-slate-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                      <span className="absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-black border-4 border-slate-900 shadow-xl">
                        {item.step}
                      </span>
                      <item.icon size={40} className="text-indigo-400 group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-4 text-center group-hover:text-indigo-300 transition-colors">{item.title}</h3>
                  <p className="text-slate-300 text-base font-medium leading-relaxed text-center group-hover:text-white transition-colors">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Features Grid */}
      <section id="features" className="relative py-40">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <span className="text-indigo-400 font-black text-[11px] uppercase tracking-[0.3em] mb-4 block">Core Capabilities</span>
            <h2 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
              Built for <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Excellence</span>
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-xl">Precision-engineered features that adapt to your unique learning style.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Adaptive Scheduling",
                desc: "Real-time plan evolution as you complete tasks or encounter obstacles. Your roadmap grows with you.",
                gradient: "from-blue-500 to-indigo-500"
              },
              {
                icon: Shield,
                title: "Branch Intelligence",
                desc: "Curriculum-aware planning tailored to your specific engineering department and course requirements.",
                gradient: "from-indigo-500 to-purple-500"
              },
              {
                icon: Brain,
                title: "Cognitive Optimization",
                desc: "Difficulty-weighted task distribution aligned with your peak mental performance windows.",
                gradient: "from-purple-500 to-pink-500"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="group relative"
              >
                <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-[40px] blur opacity-25 group-hover:opacity-75 transition duration-500`}></div>

                <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-12 rounded-[36px] hover:border-white/40 transition-all">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-8 shadow-2xl group-hover:scale-110 transition-transform`}>
                    <feature.icon size={32} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white mb-4 group-hover:text-indigo-300 transition-colors">{feature.title}</h3>
                  <p className="text-slate-300 font-medium leading-relaxed group-hover:text-white transition-colors">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-transparent to-transparent"></div>

        <div className="max-w-5xl mx-auto px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tight leading-none">
              Ready to <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Transform</span> Your Study?
            </h2>
            <p className="text-2xl text-slate-300 mb-16 max-w-2xl mx-auto">
              Join hundreds of students who've already mastered their academic journey with Axent AI.
            </p>

            <Link to="/setup" className="group relative inline-block">
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-[32px] blur-xl opacity-75 group-hover:opacity-100 transition animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-16 py-8 rounded-3xl font-black text-2xl hover:scale-105 transition-all shadow-2xl flex items-center gap-4">
                Create Your Free Plan <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-3">
              <Zap size={18} className="text-indigo-400" />
              <span className="text-white">Axent AI</span> 2026
            </div>
            <div className="flex items-center gap-2 order-last md:order-none">
              Made with <Heart size={16} className="text-rose-500 fill-rose-500 animate-pulse" /> by Shrikant Kole
            </div>
            <div className="flex gap-10">
              <Link to="/info/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/info/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};
