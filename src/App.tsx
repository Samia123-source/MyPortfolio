import { useState, useEffect, useRef, type ReactNode, type CSSProperties } from 'react';
import {
  Menu, X, Linkedin, Github, Play, ArrowRight,
  Monitor, Code2, Layout, Database, CheckCircle2,
  Download, Mail, Phone, MapPin, Send, ArrowUpRight
} from 'lucide-react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Fires once when the element scrolls into view
function useInView<T extends Element>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

type RevealProps = {
  children: ReactNode;
  delay?: number;
  from?: 'up' | 'left' | 'right' | 'zoom';
  className?: string;
};

const Reveal = ({ children, delay = 0, from = 'up', className = '' }: RevealProps) => {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal reveal-${from} ${inView ? 'is-visible' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
};

const CountUp = ({ end, start, suffix = '+' }: { end: number; start: boolean; suffix?: string }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (prefersReducedMotion()) {
      setValue(end);
      return;
    }
    let raf = 0;
    let t0: number | null = null;
    const duration = 1600;
    const tick = (t: number) => {
      if (t0 === null) t0 = t;
      const p = Math.min((t - t0) / duration, 1);
      setValue(Math.round(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, end]);

  return <>{value}{suffix}</>;
};

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [statsRef, statsInView] = useInView<HTMLDivElement>(0.4);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Skills', href: '#skills' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Resume', href: '#resume' },
    { name: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    let ticking = false;
    const ids = ['home', 'services', 'skills', 'portfolio', 'about', 'resume', 'contact'];

    const update = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setIsScrolled(y > 20);
      setScrollProgress(max > 0 ? (y / max) * 100 : 0);

      let current = 'home';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      }
      if (window.innerHeight + y >= document.documentElement.scrollHeight - 4) current = 'contact';
      setActiveSection(current);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const services = [
    {
      icon: Monitor,
      title: 'Front-End Development',
      desc: 'Building fast, scalable and secure websites & web applications using modern tech.',
    },
    {
      icon: Code2,
      title: 'React Ecosystem',
      desc: 'Creating dynamic and interactive SPAs with React.js, Next.js, and related libraries.',
    },
    {
      icon: Layout,
      title: 'Responsive UI',
      desc: 'Designing clean, modern and user-friendly interfaces that look great on any device.',
    },
    {
      icon: Database,
      title: 'State Management',
      desc: 'Efficiently handling complex application state using Redux and Context API.',
    },
  ];

  const skillCategories = [
    {
      title: 'Languages',
      skills: ['JavaScript (ES6+)', 'HTML5', 'CSS3', 'TypeScript (basic)']
    },
    {
      title: 'Frameworks & Libraries',
      skills: ['React.js', 'React Hooks', 'Redux', 'React Router']
    },
    {
      title: 'Styling & UI',
      skills: ['Tailwind CSS', 'Bootstrap', 'Material UI', 'Responsive Design']
    },
    {
      title: 'Tools & Workflow',
      skills: ['Git & GitHub', 'REST APIs', 'Figma', 'Vite & npm']
    }
  ];

  const projects = [
    {
      title: 'Pripack',
      category: 'E-commerce Web App',
      desc: 'A complete front-end for product browsing, details, and seamless checkout experience.',
      color: 'bg-clay-100',
      link: 'https://www.pripacklab.com',
      image: 'image_c4bf9e.jpg'
    },
    {
      title: 'Ami Ghurishara Bangladesh',
      category: 'Travel / Tourism',
      desc: 'User-facing interface for browsing beautiful destinations and travel packages.',
      color: 'bg-amber-100',
      link: 'https://www.amighurisharabangladesh.com',
      image: 'image_c4bf41.jpg'
    },
    {
      title: 'Kaj Ache',
      category: 'Booking Platform',
      desc: 'Home services booking with dynamic service listing and request form validation.',
      color: 'bg-orange-100',
      link: 'https://www.kajache.com',
      image: 'image_c4c2e4.jpg'
    },
    {
      title: 'Cloud Company',
      category: 'Agency Website',
      desc: 'Responsive corporate website presenting company services and digital portfolio.',
      color: 'bg-rose-100',
      link: 'https://www.cloudcompany.cc',
      image: 'image_c4bc41.jpg'
    },
  ];

  const stats = [
    { icon: Layout, value: 4, label: 'Major Projects Completed', color: 'text-clay-400', pad: 'md:pl-8' },
    { icon: Code2, value: 10, label: 'Technologies Mastered', color: 'text-amber-400', pad: 'md:pl-12' },
    { icon: Monitor, value: 1, label: 'Years Experience', color: 'text-rose-400', pad: 'md:pl-12' },
  ];

  const timeline = [
    {
      date: '2023 - Present',
      title: 'Junior Web Developer (Remote)',
      org: 'Cloud Company',
      desc: 'Built responsive user interfaces, developed reusable UI components, and fixed bugs to ensure smooth application performance.',
      current: true,
    },
    {
      date: 'Jul 2024 - May 2026',
      title: 'Junior Executive',
      org: 'Resources & Solutions Ltd (Summit Corp)',
      desc: 'Provide technical support, maintain IT infrastructure, and manage assets for daily operations.',
    },
    {
      date: 'Graduated 2026',
      title: 'MSc in Computer Science',
      school: 'Jahangirnagar University',
    },
    {
      date: 'Graduated 2021',
      title: 'BSc in Electrical & Electronics Eng.',
      school: 'University of Dhaka (Technology Unit)',
    },
  ];

  const contactItems = [
    { icon: Mail, label: 'Email', value: 'samiamahim04@gmail.com', href: 'mailto:samiamahim04@gmail.com' },
    { icon: Phone, label: 'Phone', value: '+8801949-698002', href: 'tel:+8801949698002' },
    { icon: MapPin, label: 'Location', value: 'Mirpur-12, Dhaka, Bangladesh' },
  ];

  const inputClass =
    'bg-cocoa-800/50 border border-cocoa-700 rounded-xl px-4 py-3 text-white placeholder:text-cocoa-400 focus:outline-none focus:border-clay-500 focus:ring-4 focus:ring-clay-500/20 transition-all duration-300 w-full';

  return (
    <div className="font-sans text-cocoa-800 bg-cocoa-50 min-h-screen selection:bg-clay-200 selection:text-clay-900 overflow-x-hidden">

      {/* Scroll progress */}
      <div
        className="fixed top-0 left-0 h-1 z-[60] bg-gradient-to-r from-clay-600 via-clay-400 to-rose-500"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <a href="#home" className="flex items-center gap-2 group">
            <span className="text-xl font-extrabold text-cocoa-900 tracking-tight transition-colors group-hover:text-clay-600">
              Samia Jahan<span className="text-clay-600 group-hover:text-cocoa-900 transition-colors">.</span>
            </span>
          </a>

          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => {
              const active = activeSection === link.href.slice(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`relative text-sm font-semibold transition-colors py-1 after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:bg-clay-600 after:rounded-full after:transition-all after:duration-300 hover:text-clay-600 hover:after:w-full ${active ? 'text-clay-600 after:w-full' : 'text-cocoa-600 after:w-0'}`}
                >
                  {link.name}
                </a>
              );
            })}
            <a href="#contact" className="btn-shine bg-cocoa-900 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-clay-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-clay-600/30 transition-all duration-300 flex items-center gap-2 group">
              Let's Talk <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <button
            className="md:hidden text-cocoa-900 transition-transform duration-300 active:scale-90"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="animate-slide-down md:hidden absolute top-full left-0 w-full bg-white shadow-xl py-4 flex flex-col px-4 border-t border-cocoa-100">
            {navLinks.map((link, idx) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="animate-slide-down py-3 text-cocoa-700 font-semibold border-b border-cocoa-50 hover:text-clay-600 hover:pl-2 transition-all"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                {link.name}
              </a>
            ))}
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="mt-4 bg-clay-600 text-white px-6 py-3 rounded-lg text-center font-semibold">
              Let's Talk
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Animated background blobs */}
        <div className="pointer-events-none absolute inset-0 -z-0">
          <div className="animate-blob absolute -top-24 -left-24 w-96 h-96 bg-clay-200/50 rounded-full blur-3xl" />
          <div className="animate-blob absolute top-40 right-0 w-80 h-80 bg-rose-200/40 rounded-full blur-3xl" style={{ animationDelay: '-5s' }} />
          <div className="animate-blob absolute bottom-0 left-1/3 w-72 h-72 bg-amber-200/40 rounded-full blur-3xl" style={{ animationDelay: '-9s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div className="relative z-10">
              <Reveal delay={0}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-clay-50 border border-clay-100 text-clay-600 text-xs font-bold tracking-widest uppercase mb-6">
                  <span className="relative flex w-2 h-2">
                    <span className="animate-ping-soft absolute inset-0 rounded-full bg-clay-500"></span>
                    <span className="relative w-2 h-2 rounded-full bg-clay-600"></span>
                  </span>
                  HELLO, I'M SAMIA JAHAN
                </div>
              </Reveal>
              <Reveal delay={120}>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-cocoa-900 leading-[1.1] mb-6 tracking-tight">
                  I Build <span className="animate-gradient text-transparent bg-clip-text bg-gradient-to-r from-clay-600 via-rose-500 to-clay-500">Digital Experiences</span> That Make an Impact
                </h1>
              </Reveal>
              <Reveal delay={240}>
                <p className="text-lg text-cocoa-600 mb-10 max-w-lg leading-relaxed">
                  I'm a Front-End Developer specializing in React.js and responsive UI, crafting modern, high-performance web applications.
                </p>
              </Reveal>

              <Reveal delay={360}>
                <div className="flex flex-wrap items-center gap-6 mb-12">
                  <a href="/Samia_Jahan_CV_FE.pdf" download="Samia_Jahan_CV.pdf" className="btn-shine bg-cocoa-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-clay-600 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-clay-600/30 flex items-center gap-2 group">
                    Download CV <Download size={18} className="group-hover:translate-y-0.5 group-hover:animate-bounce transition-transform" />
                  </a>
                  <a href="#portfolio" className="flex items-center gap-3 text-cocoa-900 font-semibold hover:text-clay-600 transition-colors group">
                    <span className="relative w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform text-clay-600">
                      <span className="animate-ping-soft absolute inset-0 rounded-full bg-clay-300/60"></span>
                      <Play size={20} className="ml-1 relative" />
                    </span>
                    View Work
                  </a>
                </div>
              </Reveal>

              <Reveal delay={480}>
                <div className="flex items-center gap-6">
                  <span className="text-xs font-bold text-cocoa-400 tracking-widest uppercase">Find Me On</span>
                  <div className="flex gap-4">
                    <a href="https://linkedin.com/in/samiajahan-9451141b5" target="_blank" rel="noopener noreferrer" className="text-cocoa-400 hover:text-clay-600 hover:-translate-y-1 transition-all duration-300">
                      <Linkedin size={20} />
                    </a>
                    <a href="#" className="text-cocoa-400 hover:text-clay-600 hover:-translate-y-1 transition-all duration-300">
                      <Github size={20} />
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Image/Graphic */}
            <div className="relative z-10 hidden md:block">
              <Reveal from="zoom" delay={200}>
                <div className="relative w-[400px] h-[500px] mx-auto animate-float">
                  {/* Decorative blob/shape */}
                  <div className="animate-float-slow absolute inset-0 bg-clay-100 rounded-[40px] -z-10"></div>
                  <div className="absolute inset-0 bg-cocoa-900 rounded-[40px] overflow-hidden group">
                    <img
                      src="/samia-hero.jpg"
                      alt="Samia Jahan"
                      className="w-full h-full object-cover object-[55%_30%] transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                    />
                  </div>

                  {/* Floating Experience Badge */}
                  <div className="animate-float absolute top-12 -right-10 bg-white p-5 rounded-2xl shadow-xl border border-cocoa-50" style={{ animationDelay: '-2.5s' }}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-clay-100 flex items-center justify-center text-clay-600 font-black text-xl">
                        2+
                      </div>
                      <div>
                        <p className="text-xs text-cocoa-500 font-bold uppercase tracking-wider">Years of</p>
                        <p className="text-cocoa-900 font-bold">Experience</p>
                      </div>
                    </div>
                  </div>

                  {/* Decorative dots */}
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[radial-gradient(#D2BCA7_2px,transparent_2px)] [background-size:12px_12px]"></div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Services / What I Do */}
      <section id="services" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-16">
            <h4 className="text-clay-600 text-xs font-bold tracking-widest uppercase mb-2">What I Do</h4>
            <h2 className="text-4xl font-extrabold text-cocoa-900">Design, Code & Build<br/>Amazing Things</h2>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <Reveal key={idx} delay={idx * 120}>
                  <div className="h-full bg-cocoa-50 p-8 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-clay-900/5 hover:-translate-y-2 transition-all duration-500 border border-cocoa-100 hover:border-clay-200 group">
                    <div className="w-16 h-16 rounded-xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-clay-600 transition-all duration-500 border border-cocoa-100">
                      <Icon className="w-8 h-8 text-clay-600 group-hover:text-white transition-colors duration-500" />
                    </div>
                    <h3 className="text-xl font-bold text-cocoa-900 mb-3">{service.title}</h3>
                    <p className="text-cocoa-600 text-sm leading-relaxed mb-6">{service.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 bg-cocoa-50 border-t border-cocoa-100 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-16">
            <h4 className="text-clay-600 text-xs font-bold tracking-widest uppercase mb-2">My Expertise</h4>
            <h2 className="text-4xl font-extrabold text-cocoa-900">Technical Skills</h2>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skillCategories.map((category, idx) => (
              <Reveal key={idx} delay={idx * 120} from="zoom">
                <div className="h-full bg-white p-8 rounded-2xl shadow-sm border border-cocoa-100 hover:shadow-lg hover:-translate-y-1 hover:border-clay-200 transition-all duration-500 group">
                  <h3 className="text-lg font-bold text-cocoa-900 mb-6 flex items-center gap-2">
                    <CheckCircle2 className="text-clay-600 w-5 h-5 group-hover:rotate-[360deg] transition-transform duration-700" />
                    {category.title}
                  </h3>
                  <ul className="space-y-3">
                    {category.skills.map((skill, sIdx) => (
                      <li key={sIdx} className="text-cocoa-600 font-medium flex items-center gap-2 hover:text-clay-600 hover:translate-x-1 transition-all duration-300 group/item">
                        <span className="w-1.5 h-1.5 rounded-full bg-cocoa-300 group-hover/item:bg-clay-500 group-hover/item:scale-150 transition-all duration-300"></span>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="portfolio" className="py-24 bg-white border-t border-cocoa-100 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h4 className="text-clay-600 text-xs font-bold tracking-widest uppercase mb-2">Featured Work</h4>
                <h2 className="text-4xl font-extrabold text-cocoa-900">Some Selected<br/>Projects</h2>
              </div>
              <a href="#portfolio" className="text-cocoa-900 font-bold hover:text-clay-600 transition-colors flex items-center gap-2 group">
                View All Projects <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-10">
            {projects.map((project, idx) => (
              <Reveal key={idx} delay={(idx % 2) * 150} from={idx % 2 === 0 ? 'left' : 'right'}>
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="group cursor-pointer block">
                  {/* Project Image */}
                  <div className={`relative w-full aspect-[4/3] rounded-3xl overflow-hidden mb-6 ${project.color} shadow-sm group-hover:shadow-2xl group-hover:shadow-clay-900/15 group-hover:-translate-y-2 transition-all duration-500`}>
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-top group-hover:scale-105 group-hover:object-bottom transition-all duration-[3s] ease-in-out"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-cocoa-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                    {/* Floating tag */}
                    <div className="absolute top-6 left-6 bg-white px-4 py-2 rounded-full text-xs font-bold text-cocoa-900 shadow-sm z-10 group-hover:bg-clay-600 group-hover:text-white transition-colors duration-300">
                      {project.category}
                    </div>

                    {/* Visit label */}
                    <div className="absolute bottom-6 left-6 text-white font-semibold flex items-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      Visit Site <ArrowUpRight size={18} />
                    </div>
                  </div>
                  {/* Project Info */}
                  <div className="flex justify-between items-start pr-4">
                    <div>
                      <h3 className="text-2xl font-bold text-cocoa-900 mb-2 group-hover:text-clay-600 transition-colors">{project.title}</h3>
                      <p className="text-cocoa-600 text-sm max-w-sm">{project.desc}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-cocoa-200 flex items-center justify-center text-cocoa-400 group-hover:bg-clay-600 group-hover:text-white group-hover:border-clay-600 group-hover:rotate-45 transition-all duration-500 shrink-0">
                      <ArrowUpRight size={20} />
                    </div>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <Reveal from="zoom">
        <section className="py-16 bg-cocoa-900 mx-4 sm:mx-6 lg:mx-8 rounded-3xl my-12 relative overflow-hidden">
          {/* Background glows */}
          <div className="animate-blob absolute top-1/2 left-1/4 w-64 h-64 bg-clay-600/25 rounded-full blur-[100px] -translate-y-1/2"></div>
          <div className="animate-blob absolute top-0 right-10 w-56 h-56 bg-rose-500/15 rounded-full blur-[100px]" style={{ animationDelay: '-7s' }}></div>

          <div ref={statsRef} className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-cocoa-700/50">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className={`text-center md:text-left ${stat.pad} py-4 flex items-center justify-center md:justify-start gap-4 group`}>
                    <div className={`p-4 rounded-xl bg-cocoa-800/50 ${stat.color} group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500`}>
                      <Icon size={28} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-extrabold text-white tabular-nums">
                        <CountUp end={stat.value} start={statsInView} />
                      </h3>
                      <p className="text-cocoa-400 text-sm font-medium">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>

      {/* About & Resume/Experience */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20">

            {/* Left: About */}
            <div id="about" className="scroll-mt-28">
              <Reveal from="left">
                <h4 className="text-clay-600 text-xs font-bold tracking-widest uppercase mb-2">About Me</h4>
                <h2 className="text-4xl font-extrabold text-cocoa-900 mb-6">Passionate About Building Digital Solutions</h2>
                <p className="text-cocoa-600 leading-relaxed mb-8 text-lg">
                  I'm Samia Jahan, a Front-End Developer with a passion for building clean, modern and high-performance digital solutions. I love turning ideas into reality using code and creativity.
                </p>
              </Reveal>

              <div className="space-y-4 mb-10" role="list">
                {[
                  'React.js & Next.js Development',
                  'Modern UI/UX Implementation',
                  'Problem Solving & Debugging',
                  'Clean & Scalable Code Architecture'
                ].map((item, idx) => (
                  <Reveal key={idx} from="left" delay={150 + idx * 100}>
                    <div role="listitem" className="flex items-center gap-3 group">
                      <CheckCircle2 className="text-clay-600 w-6 h-6 group-hover:scale-125 transition-transform duration-300" />
                      <span className="text-cocoa-800 font-semibold group-hover:text-clay-600 group-hover:translate-x-1 transition-all duration-300">{item}</span>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal from="left" delay={600}>
                <a href="/Samia_Jahan_CV_FE.pdf" download="Samia_Jahan_CV.pdf" className="btn-shine bg-cocoa-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-clay-600 hover:-translate-y-1 transition-all duration-300 inline-flex items-center gap-3 shadow-lg hover:shadow-xl hover:shadow-clay-600/30 group">
                  Download CV <Download size={18} className="group-hover:animate-bounce" />
                </a>
              </Reveal>
            </div>

            {/* Right: Experience Timeline */}
            <div id="resume" className="scroll-mt-28">
              <Reveal from="right">
                <h4 className="text-clay-600 text-xs font-bold tracking-widest uppercase mb-8">My Experience & Education</h4>
              </Reveal>

              <Reveal from="right" delay={100}>
                <div className="relative pl-8 space-y-12">
                  {/* Animated timeline line */}
                  <div className="timeline-line absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-clay-500 via-cocoa-200 to-cocoa-100 rounded-full"></div>

                  {timeline.map((item, idx) => (
                    <Reveal key={idx} from="right" delay={200 + idx * 150}>
                      <div className="relative group">
                        <div className={`absolute w-4 h-4 rounded-full -left-[39px] top-1 border-4 border-white shadow-sm transition-transform duration-300 group-hover:scale-150 ${item.current ? 'bg-clay-600' : 'bg-cocoa-300 group-hover:bg-clay-500'}`}>
                          {item.current && <span className="animate-ping-soft absolute inset-0 rounded-full bg-clay-500"></span>}
                        </div>
                        <span className="text-sm font-bold text-cocoa-400 mb-1 block">{item.date}</span>
                        <h3 className="text-xl font-bold text-cocoa-900 group-hover:text-clay-600 transition-colors duration-300">{item.title}</h3>
                        {item.org && <p className="text-clay-600 font-semibold mb-3">{item.org}</p>}
                        {item.desc && <p className="text-cocoa-600 text-sm leading-relaxed">{item.desc}</p>}
                        {item.school && <p className="text-cocoa-600 text-sm mt-1">{item.school}</p>}
                      </div>
                    </Reveal>
                  ))}
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* Contact & Footer Section */}
      <footer id="contact" className="relative bg-cocoa-900 text-white pt-24 pb-12 mt-12 overflow-hidden">
        <div className="animate-blob pointer-events-none absolute -top-32 -right-32 w-96 h-96 bg-clay-600/15 rounded-full blur-[120px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 mb-20">

            {/* Left: Contact Form */}
            <Reveal from="left">
              <h4 className="text-clay-400 text-xs font-bold tracking-widest uppercase mb-2">Let's Work Together</h4>
              <h2 className="text-4xl font-extrabold mb-4">Have a Project<br/>in Mind?</h2>
              <p className="text-cocoa-400 mb-8 max-w-md">
                I'm currently available for freelance work or full-time roles. Let's build something great together!
              </p>

              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Your Name" className={inputClass} />
                  <input type="email" placeholder="Your Email" className={inputClass} />
                </div>
                <input type="text" placeholder="Project Type" className={inputClass} />
                <textarea rows={4} placeholder="Your Message" className={`${inputClass} resize-none`}></textarea>
                <button type="button" className="btn-shine bg-clay-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-clay-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-clay-600/30 transition-all duration-300 flex items-center justify-center gap-2 w-full md:w-auto group">
                  Send Message <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </button>
              </form>
            </Reveal>

            {/* Right: Contact Info */}
            <div className="lg:pl-16 flex flex-col justify-center">
              <div className="space-y-8">
                {contactItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Reveal key={idx} from="right" delay={idx * 120}>
                      <div className="flex items-start gap-4 group">
                        <div className="w-12 h-12 bg-cocoa-800 rounded-xl flex items-center justify-center text-clay-400 shrink-0 group-hover:bg-clay-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                          <Icon size={24} />
                        </div>
                        <div>
                          <p className="text-cocoa-400 text-sm font-semibold mb-1">{item.label}</p>
                          {item.href ? (
                            <a href={item.href} className="text-lg font-bold hover:text-clay-400 transition-colors">
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-lg font-bold">{item.value}</p>
                          )}
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>

              <Reveal from="right" delay={400}>
                <div className="mt-12 pt-12 border-t border-cocoa-800">
                  <p className="text-cocoa-400 text-sm font-semibold mb-4 tracking-widest uppercase">Follow Me</p>
                  <div className="flex gap-4">
                    <a href="https://linkedin.com/in/samiajahan-9451141b5" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-cocoa-800 flex items-center justify-center text-white hover:bg-clay-600 hover:-translate-y-1 transition-all duration-300">
                      <Linkedin size={18} />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-lg bg-cocoa-800 flex items-center justify-center text-white hover:bg-clay-600 hover:-translate-y-1 transition-all duration-300">
                      <Github size={18} />
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>

          </div>

          <div className="border-t border-cocoa-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-cocoa-500 font-medium">
            <p>&copy; {new Date().getFullYear()} Samia Jahan. All Rights Reserved.</p>
            <p>Built with React & Tailwind</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
