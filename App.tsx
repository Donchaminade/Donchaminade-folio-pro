
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  ChevronRight, 
  ChevronLeft,
  ExternalLink, 
  Mail,
  ArrowUpRight,
  Send,
  Download,
  Phone,
  Package,
  Layers,
  X,
  Code,
  ArrowLeft,
  Calendar,
  Briefcase,
  Quote,
  Trophy,
  MessageSquare,
  ShieldCheck,
  Globe,
  CheckCircle2,
  Activity,
  Zap,
  Layout,
  Smartphone,
  Check,
  User
} from 'lucide-react';
import { Section } from './components/Section';
import { GlassCard } from './components/GlassCard';
import { STATS, SKILLS, EXPERIENCES, PROJECTS, COMMUNITIES, EDUCATION, TECH_ICONS, TESTIMONIALS, MANAGED_PAGES, AWARDS, GALLERY_IMAGES, CLIENTS } from './constants';
import { Project } from './types';

// Subtle Glitch Text Component
const GlitchText: React.FC<{ text: string, className?: string }> = ({ text, className }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const triggerGlitch = () => {
      if (Math.random() > 0.9) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      }
    };
    const interval = setInterval(triggerGlitch, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span 
      className={`glitch-text ${isGlitching ? 'is-glitching' : ''} ${className || ''}`} 
      data-text={text}
    >
      {text}
    </span>
  );
};

// Component for Parallax Project Image
const ParallaxImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden">
      <motion.img 
        style={{ y, scale: 1.15 }}
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
};

// Component for Project Carousel
const ProjectCarousel: React.FC<{ project: Project }> = ({ project }) => {
  const allImages = [project.image, ...(project.additionalImages || [])];
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full h-full group">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          src={allImages[currentIndex]}
          alt={`${project.title} screenshot ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </AnimatePresence>

      {allImages.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 glass rounded-full text-white hover:bg-white/10 transition-colors z-30"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 glass rounded-full text-white hover:bg-white/10 transition-colors z-30"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
            {allImages.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${i === currentIndex ? 'w-6 bg-blue-500' : 'w-2 bg-white/30'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Testimonials Carousel Component
const TestimonialCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  const prev = () => setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));

  return (
    <div className="relative max-w-4xl mx-auto group">
      <div className="overflow-hidden px-4 md:px-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <GlassCard className="p-6 md:p-16 rounded-[2.5rem] border-white/5 bg-slate-900/40 relative">
              <Quote className="absolute top-8 left-8 text-blue-500/10 w-24 h-24 -z-10" />
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                {TESTIMONIALS[currentIndex].image && (
                  <img 
                    src={TESTIMONIALS[currentIndex].image} 
                    alt={TESTIMONIALS[currentIndex].name} 
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-blue-500/50 object-cover" 
                  />
                )}
                <div className="flex-1">
                  <p className="text-lg md:text-2xl text-slate-200 italic font-light leading-relaxed mb-6 md:mb-8">
                    "{TESTIMONIALS[currentIndex].quote}"
                  </p>
                  <div>
                    <h4 className="text-lg font-black text-white uppercase tracking-tighter">
                      {TESTIMONIALS[currentIndex].name}
                    </h4>
                    <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mt-1">
                      {TESTIMONIALS[currentIndex].role} — {TESTIMONIALS[currentIndex].company}
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>

      <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 p-3 glass rounded-full text-slate-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:block">
        <ChevronLeft size={24} />
      </button>
      <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 p-3 glass rounded-full text-slate-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:block">
        <ChevronRight size={24} />
      </button>

      <div className="flex justify-center gap-3 mt-8">
        {TESTIMONIALS.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrentIndex(i)} 
            className={`h-1 rounded-full transition-all ${i === currentIndex ? 'w-10 bg-blue-500' : 'w-4 bg-white/10'}`} 
          />
        ))}
      </div>
    </div>
  );
};

// Clients Marquee Component
const ClientsMarquee: React.FC = () => {
  const doubleClients = [...CLIENTS, ...CLIENTS];
  return (
    <div className="relative overflow-hidden w-full py-8 md:py-12">
      <motion.div 
        className="flex gap-8 md:gap-12 w-max items-center"
        animate={{ x: [0, -1200] }}
        transition={{ repeat: Infinity, repeatType: "loop", duration: 40, ease: "linear" }}
      >
        {doubleClients.map((client, i) => (
          <div key={i} className="flex flex-col items-center gap-4 group cursor-default">
            <div className="w-16 h-16 md:w-24 md:h-24 glass rounded-2xl flex items-center justify-center p-4 md:p-5 grayscale group-hover:grayscale-0 transition-all border-white/5 group-hover:border-blue-500/30 group-hover:bg-blue-500/5">
              <img src={client.logo} alt={client.name} className="w-full h-full object-contain" />
            </div>
            <span className="text-[9px] md:text-xs font-black text-slate-500 uppercase tracking-widest group-hover:text-blue-400 transition-colors">
              {client.name}
            </span>
          </div>
        ))}
      </motion.div>
      <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />
    </div>
  );
};

// Image Gallery Carousel
const ImageGalleryCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === GALLERY_IMAGES.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative aspect-video md:aspect-[21/9] overflow-hidden rounded-[2.5rem] glass border border-white/10 shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full h-full"
        >
          <img 
            src={GALLERY_IMAGES[currentIndex].url} 
            alt={GALLERY_IMAGES[currentIndex].caption}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent flex items-end p-6 md:p-16">
             <p className="text-white text-lg md:text-3xl font-black uppercase tracking-widest leading-none">
               {GALLERY_IMAGES[currentIndex].caption}
             </p>
          </div>
        </motion.div>
      </AnimatePresence>
      
      <div className="absolute top-6 right-6 md:top-10 md:right-10 flex gap-2 z-10">
        {GALLERY_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1 transition-all rounded-full ${i === currentIndex ? 'w-8 md:w-12 bg-blue-500' : 'w-2 md:w-4 bg-white/20'}`}
          />
        ))}
      </div>
    </div>
  );
};

const LinkedInMarquee: React.FC = () => {
  const doublePages = [...MANAGED_PAGES, ...MANAGED_PAGES];

  return (
    <Section 
      id="linkedin" 
      title="Gestion LinkedIn" 
      subtitle="Stratégies digitales performantes."
      bgImage="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200"
    >
      <div className="relative overflow-hidden w-full py-8 md:py-12 -mx-6 px-6">
        <motion.div 
          className="flex gap-6 md:gap-8 w-max"
          animate={{ x: [0, -1100] }}
          transition={{ repeat: Infinity, repeatType: "loop", duration: 35, ease: "linear" }}
        >
          {doublePages.map((page, i) => (
            <GlassCard key={i} className="flex flex-col items-center gap-4 w-56 md:w-64 p-6 md:p-8 border-white/5 hover:border-blue-500/30">
              <div className="w-16 h-16 md:w-20 md:h-20 glass rounded-2xl flex items-center justify-center p-3 md:p-4">
                <img src={page.logo} alt={page.name} className="w-full h-full object-contain" />
              </div>
              <div className="text-center">
                <h3 className="font-black text-white text-base md:text-lg uppercase tracking-tight">{page.name}</h3>
                <p className="text-[9px] text-blue-400 font-black uppercase tracking-[0.2em] mt-1">{page.category}</p>
              </div>
              <a href={page.link} target="_blank" rel="noreferrer" className="mt-3 md:mt-4 text-slate-500 hover:text-blue-500 transition-colors">
                <Linkedin size={18} />
              </a>
            </GlassCard>
          ))}
        </motion.div>
      </div>
    </Section>
  );
};

const App: React.FC = () => {
  const [activeCommunity, setActiveCommunity] = useState<number | null>(null);
  const [projectFilter, setProjectFilter] = useState<'All' | 'Web' | 'Mobile' | 'Design'>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, { stiffness: 100, damping: 30 });
  
  const heroImageY = useTransform(smoothScrollY, [0, 500], [0, 80]);
  const heroTextY = useTransform(smoothScrollY, [0, 500], [0, -40]);
  const heroBgY = useTransform(smoothScrollY, [0, 1000], ["0%", "20%"]);

  useEffect(() => {
    if (showAllProjects) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [showAllProjects]);

  const filteredProjects = projectFilter === 'All' ? PROJECTS : PROJECTS.filter(p => p.type === projectFilter);
  const homeProjects = PROJECTS.slice(0, 5);

  const SOCIALS = {
    linkedin: 'https://linkedin.com/in/chaminadeadjolou',
    twitter: 'https://x.com/Donchaminde',
    github: 'https://github.com/Donchaminade',
    whatsapp: '22899181626'
  };

  const NAV_ITEMS = [
    { name: 'Profil', id: 'apropos', icon: <User size={20} /> },
    { name: 'Parcours', id: 'experience', icon: <Briefcase size={20} /> },
    { name: 'Projets', id: 'projets', icon: <Package size={20} /> },
    { name: 'Comm.', id: 'communaute', icon: <Layers size={20} /> },
    { name: 'Contact', id: 'contact', icon: <MessageSquare size={20} /> }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, message } = contactForm;
    
    // Client-side validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      setFormFeedback({ type: 'error', message: 'Désolé, tous les champs sont obligatoires.' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormFeedback({ type: 'error', message: 'Oups, cette adresse email semble invalide.' });
      return;
    }

    if (message.length < 10) {
      setFormFeedback({ type: 'error', message: 'Veuillez écrire un message un peu plus long.' });
      return;
    }

    setIsSubmitting(true);
    setFormFeedback({ type: null, message: '' });

    // Simulate sending with professional visual feedback
    setTimeout(() => {
      setFormFeedback({ type: 'success', message: 'Génial ! Votre message est prêt à être envoyé.' });
      
      const formattedMessage = `*Bonjour Chaminade,*\n\nNouveau message de: *${name}*\nEmail: ${email}\n\n*Message:*\n${message}`;
      
      // We still use WhatsApp for real communication, but with better feedback before redirection
      setTimeout(() => {
        window.open(`https://wa.me/${SOCIALS.whatsapp}?text=${encodeURIComponent(formattedMessage)}`, '_blank');
        setContactForm({ name: '', email: '', message: '' });
        setIsSubmitting(false);
      }, 1500);

      // Clear feedback after some time
      setTimeout(() => setFormFeedback({ type: null, message: '' }), 6000);
    }, 1000);
  };

  const NavItem = ({ item }: { item: typeof NAV_ITEMS[0] }) => (
    <a href={`#${item.id}`} className="relative py-1 group overflow-hidden transition-colors hover:text-blue-400">
      <span className="font-bold tracking-widest text-[11px] uppercase">{item.name}</span>
      <motion.div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500/50 scale-x-0 group-hover:scale-x-100 origin-left transition-transform" />
    </a>
  );

  const ProjectModal = () => (
    <AnimatePresence>
      {selectedProject && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-950/98 backdrop-blur-2xl overflow-y-auto"
          onClick={() => setSelectedProject(null)}
        >
          <motion.div 
            initial={{ scale: 0.95, y: 30, opacity: 0 }} 
            animate={{ scale: 1, y: 0, opacity: 1 }} 
            exit={{ scale: 0.95, y: 30, opacity: 0 }}
            className="bg-slate-900/60 border border-white/10 rounded-[3rem] w-full max-w-6xl my-auto relative shadow-[0_40px_120px_rgba(0,0,0,0.9)] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header Control */}
            <div className="absolute top-6 right-6 flex gap-3 z-[60]">
               <button 
                onClick={() => setSelectedProject(null)} 
                className="p-4 glass rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all border border-white/5 shadow-xl"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Media Part */}
              <div className="lg:col-span-7 relative h-[380px] lg:h-[750px] bg-black/40 border-b lg:border-b-0 lg:border-r border-white/5">
                <ProjectCarousel project={selectedProject} />
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/70 to-transparent pointer-events-none z-20" />
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/70 to-transparent pointer-events-none z-20" />
              </div>

              {/* Information Part */}
              <div className="lg:col-span-5 flex flex-col p-8 md:p-14 lg:p-16 h-full overflow-y-auto no-scrollbar bg-slate-900/40">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="flex items-center gap-2 px-5 py-2 glass rounded-full border border-blue-500/20">
                      {selectedProject.type === 'Mobile' ? <Smartphone size={14} className="text-blue-400" /> : <Layout size={14} className="text-blue-400" />}
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">{selectedProject.type}</span>
                    </div>
                    <div className="h-[1px] flex-1 bg-white/5" />
                  </div>

                  <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-10">
                    {selectedProject.title}
                  </h2>

                  <div className="space-y-12">
                    {/* Concept */}
                    <div className="space-y-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500/60 flex items-center gap-2">
                        <Activity size={14} /> LE CONCEPT
                      </p>
                      <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed">
                        {selectedProject.detailedDescription || selectedProject.description}
                      </p>
                    </div>

                    {/* Stack Section with Icons */}
                    <div className="space-y-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500/60 flex items-center gap-2">
                        <Zap size={14} /> TECHNOLOGIES UTILISÉES
                      </p>
                      <div className="flex flex-wrap gap-2 md:gap-3">
                        {selectedProject.tags.map((tag) => (
                          <div key={tag} className="flex items-center gap-2.5 px-4 py-2.5 glass rounded-2xl border border-white/5 text-[11px] font-black uppercase tracking-wider text-slate-300">
                            {TECH_ICONS[tag] && <img src={TECH_ICONS[tag]} alt={tag} className="w-4 h-4" />}
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* External Links Area - Prominent and Detailed */}
                <div className="mt-16 pt-12 border-t border-white/5 space-y-5">
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">ACTIONS & LIENS</p>
                   
                   <div className="flex flex-col sm:flex-row gap-4">
                    {selectedProject.link && selectedProject.link !== '#' && (
                      <a 
                        href={selectedProject.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 px-8 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_20px_40px_rgba(37,99,235,0.25)] hover:scale-[1.02] active:scale-95 group"
                      >
                        VOIR LE SITE <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </a>
                    )}
                    
                    {selectedProject.github && selectedProject.github !== '#' && (
                      <a 
                        href={selectedProject.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 px-8 py-5 glass text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 border border-white/10 transition-all hover:scale-[1.02] active:scale-95 group"
                      >
                        CODE SOURCE <Github size={18} className="group-hover:rotate-12 transition-transform" />
                      </a>
                    )}

                    {(!selectedProject.github || selectedProject.github === '#') && (!selectedProject.link || selectedProject.link === '#') && (
                      <div className="flex-1 py-5 glass rounded-2xl text-slate-500 font-black text-[11px] uppercase tracking-widest border border-white/5 italic text-center">
                         Propriété privée ou confidentielle
                      </div>
                    )}
                  </div>
                  
                  <p className="text-[9px] text-slate-600 uppercase font-bold tracking-widest text-center mt-4 italic">
                    * Certains projets peuvent être sous accords de confidentialité (NDA).
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (showAllProjects) {
    return (
      <main className="min-h-screen pb-20 px-4 md:px-0 bg-slate-950">
        <div className="max-w-7xl mx-auto pt-12">
          <button onClick={() => setShowAllProjects(false)} className="flex items-center gap-3 text-blue-500 font-black uppercase text-[10px] md:text-xs tracking-widest hover:text-white mb-12"><ArrowLeft size={18} /> Retour au Portfolio</button>
          <h1 className="text-5xl md:text-8xl font-black mb-16 uppercase tracking-tighter">Nos <span className="text-blue-500">Projets.</span></h1>
          <div className="flex flex-wrap gap-3 md:gap-4 mb-16">
            {['All', 'Web', 'Mobile', 'Design'].map((filter) => (
              <button key={filter} onClick={() => setProjectFilter(filter as any)} className={`px-6 md:px-8 py-2 md:py-3 rounded-full text-[10px] md:text-xs font-black tracking-widest border transition-all ${projectFilter === filter ? 'bg-blue-600 text-white border-blue-500 shadow-xl' : 'glass text-slate-500 border-white/5 hover:border-white/20'}`}>{filter.toUpperCase()}</button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProjects.map((project) => <motion.div key={project.title} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}><ProjectCard project={project} onClick={() => setSelectedProject(project)} /></motion.div>)}
          </div>
        </div>
        <ProjectModal />
      </main>
    );
  }

  return (
    <div className="min-h-screen selection:bg-blue-500 selection:text-white">
      {/* Desktop Navigation */}
      <header className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl hidden lg:block">
        <nav className="glass-dark px-10 py-4 rounded-full flex items-center justify-between border border-white/10 shadow-2xl">
          <div className="text-2xl font-black text-blue-500 tracking-tighter uppercase cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Donchaminade</div>
          <div className="flex items-center gap-10 text-slate-400">
            {NAV_ITEMS.map((item) => <NavItem key={item.id} item={item} />)}
          </div>
          <a href="#contact" className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-full text-[11px] font-black uppercase text-white transition-all shadow-lg shadow-blue-600/20">ME CONTACTER</a>
        </nav>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[92%] max-w-md lg:hidden bg-gradient-to-b from-slate-900/60 to-slate-950/90 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 px-6 md:px-8 py-4 md:py-5 flex justify-between items-center shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        {NAV_ITEMS.map((item) => (
          <a 
            key={item.id} 
            href={`#${item.id}`} 
            className="text-slate-300 hover:text-blue-500 active:text-blue-400 transition-all flex flex-col items-center gap-1 md:gap-2"
          >
            <div className="p-1 hover:scale-110 transition-transform">
              {React.cloneElement(item.icon as React.ReactElement<any>, { size: 18 })}
            </div>
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest opacity-80">{item.name}</span>
          </a>
        ))}
      </nav>

      <main className="pb-16 lg:pb-0">
        {/* HERO SECTION */}
        <section id="hero" className="relative pt-20 md:pt-48 lg:pt-64 pb-16 md:pb-48 px-6 max-w-7xl mx-auto overflow-visible">
          {/* Hero Parallax Background */}
          <motion.div 
            style={{ y: heroBgY }}
            className="absolute inset-0 -z-30 opacity-[0.05] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            transition={{ duration: 1.5 }}
          >
             <div className="absolute inset-0" style={{ 
               backgroundImage: `url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200")`,
               backgroundSize: 'cover',
               backgroundPosition: 'center'
             }} />
          </motion.div>

          <div className="absolute inset-0 -z-20 pointer-events-none opacity-[0.05]" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 H90 V30 H70 V90' fill='none' stroke='%233b82f6' stroke-width='0.5'/%3E%3Ccircle cx='10' cy='10' r='2' fill='%233b82f6'/%3E%3Ccircle cx='70' cy='90' r='2' fill='%233b82f6'/%3E%3C/svg%3E")`,
            backgroundSize: '250px 250px'
          }} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
            <motion.div style={{ y: heroTextY }} initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: "easeOut" }}>
              <div className="inline-flex items-center gap-3 px-4 py-2 glass rounded-full border-blue-500/20 mb-6 md:mb-8 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-blue-400">Disponible pour de nouveaux défis</span>
              </div>

              <div className="mb-6 md:mb-8">
                <h2 className="text-4xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none mb-2 md:mb-4">
                  <GlitchText text="ADJOLOU" />
                </h2>
                <h2 className="text-xl md:text-4xl font-black tracking-tighter text-blue-500 uppercase leading-none opacity-90">
                  <GlitchText text="Dondah Chaminade" />
                </h2>
              </div>

              <h1 className="text-3xl md:text-7xl font-black mb-6 md:mb-10 leading-[0.85] tracking-tighter text-white uppercase">
                Digital <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-300">Architect.</span>
              </h1>

              <p className="text-lg md:text-2xl text-slate-300 mb-8 md:mb-14 max-w-xl font-light leading-relaxed">
                Développeur web créatif avec plus de <span className="text-white font-bold italic underline decoration-blue-500/50">3 ans d’expérience</span> et 1 an en mobile. Maîtrise de Flutter, React et des architectures cloud. Spécialiste de l'innovation et de l'impact communautaire.
              </p>

              <div className="flex flex-wrap gap-4 md:gap-6 items-center">
                <a href="#projets" className="group px-8 md:px-12 py-5 md:py-6 bg-blue-600 text-white font-black text-[10px] md:text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-500 transition-all shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95 flex items-center gap-3">
                  MES RÉALISATIONS <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
                
                <a 
                  href="/CV.pdf" 
                  download 
                  className="px-8 md:px-10 py-5 md:py-6 glass text-white font-black text-[10px] md:text-xs uppercase tracking-widest rounded-2xl flex items-center gap-3 hover:bg-white/10 border-white/10 transition-all hover:scale-105 active:scale-95 shadow-2xl"
                >
                  <Download size={18} className="text-blue-400" /> TÉLÉCHARGER CV
                </a>
              </div>

              <div className="mt-10 md:mt-14 flex items-center gap-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Me suivre</span>
                <div className="flex gap-4">
                  <a href={SOCIALS.github} target="_blank" className="p-3 glass rounded-xl text-slate-400 hover:text-blue-400 transition-all border-white/5"><Github size={20} /></a>
                  <a href={SOCIALS.linkedin} target="_blank" className="p-3 glass rounded-xl text-slate-400 hover:text-blue-400 transition-all border-white/5"><Linkedin size={20} /></a>
                  <a href={SOCIALS.twitter} target="_blank" className="p-3 glass rounded-xl text-slate-400 hover:text-blue-400 transition-all border-white/5"><Twitter size={20} /></a>
                </div>
              </div>
            </motion.div>

            <motion.div style={{ y: heroImageY }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: "easeOut" }} className="relative flex flex-col items-center lg:items-end">
              <div className="relative z-10 w-full max-w-[340px] md:max-w-xl aspect-square rounded-[3rem] md:rounded-[4rem] overflow-hidden glass p-3 md:p-4 border-white/10 bg-slate-900/40 shadow-[0_50px_100px_rgba(0,0,0,0.7)] group">
                <img src="https://media.licdn.com/dms/image/v2/D4E03AQGF4oUUqUB_iA/profile-displayphoto-scale_200_200/B4EZqg1zABIIAY-/0/1763635052057?e=1770249600&v=beta&t=fsO-jtn3LSuwITuY7xc4fyIu_i6mljBeOMeB-NIM9JQ" alt="Portrait Professionnel" className="w-full h-full object-cover rounded-[2.5rem] md:rounded-[3.5rem] grayscale group-hover:grayscale-0 transition-all duration-700" loading="lazy"/>
              </div>
              
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="mt-[-40px] md:mt-[-60px] lg:mr-[-40px] z-20 glass-dark p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border-blue-500/50 shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex items-center gap-6 md:gap-8 backdrop-blur-3xl border-l-4 border-l-blue-500"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-blue-500/20 flex items-center justify-center text-blue-500 border border-blue-500/30">
                  <ShieldCheck className="w-9 h-9 md:w-11 md:h-11" />
                </div>
                <div>
                  <div className="text-3xl md:text-5xl font-black text-white leading-none">3+ Ans</div>
                  <div className="text-[10px] md:text-[11px] uppercase font-black text-blue-400 tracking-[0.4em] mt-2 md:mt-3">Expérience Solide</div>
                </div>
              </motion.div>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] bg-blue-600/5 blur-[120px] md:blur-[150px] rounded-full -z-20" />
            </motion.div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="px-6 py-12 md:py-20 bg-white/[0.01] border-y border-white/[0.05]">
          <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-4xl md:text-6xl font-black text-white mb-2 md:mb-3 group-hover:text-blue-500 transition-colors">
                  {stat.value}<span className="text-blue-600 text-2xl md:text-3xl ml-1">{stat.suffix}</span>
                </div>
                <div className="text-slate-500 uppercase text-[9px] md:text-xs font-black tracking-[0.4em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <Section 
          id="apropos" 
          title="Mon Profil" 
          subtitle="Une maîtrise complète des architectures Web & Mobiles modernes."
          bgImage="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
            <GlassCard className="lg:col-span-2 p-6 md:p-10 rounded-[2.5rem]">
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase mb-8 md:mb-12 flex items-center gap-4"><Code size={28} className="text-blue-500" /> Stack Technique</h3>
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } }
                }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6"
              >
                {SKILLS.map((skill, i) => (
                  <motion.div 
                    key={i} 
                    variants={{
                      hidden: { opacity: 0, scale: 0.8, y: 20 },
                      visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                    }}
                    className="flex flex-col items-center gap-3 md:gap-4 p-4 md:p-6 glass rounded-3xl hover:bg-blue-500/10 transition-all border-white/5 hover:border-blue-500/40 group cursor-default"
                  >
                    <img src={skill.icon} alt={skill.name} className="w-10 h-10 md:w-12 md:h-12 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" loading="lazy" />
                    <span className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 text-center tracking-widest">{skill.name}</span>
                  </motion.div>
                ))}
              </motion.div>
            </GlassCard>
            
            <div className="space-y-6">
              {EDUCATION.map((edu, i) => (
                <GlassCard key={i} className="p-6 md:p-8 rounded-[2rem] bg-blue-900/5 hover:bg-blue-900/10 border-white/5">
                  <div className="font-black text-white text-lg md:text-xl uppercase leading-tight tracking-tight">{edu.degree}</div>
                  <div className="text-sm md:text-base text-slate-400 mt-2 font-light">{edu.field}</div>
                  <div className="text-[10px] md:text-xs font-black text-slate-500 mt-6 uppercase tracking-widest border-t border-white/10 pt-4 flex justify-between">
                    <span>{edu.school}</span>
                    <span className="text-blue-500">{edu.year}</span>
                  </div>
                </GlassCard>
              ))}
            </div>

            <GlassCard className="lg:col-span-1 p-6 md:p-10 rounded-[2.5rem]">
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase mb-8 md:mb-10 flex items-center gap-4"><Trophy size={28} className="text-blue-500" /> Distinctions</h3>
              <div className="space-y-6 md:space-y-8">
                {AWARDS.map((award, i) => (
                  <div key={i} className="border-l-2 md:border-l-3 border-blue-500/30 pol-4 md:pl-6 py-2">
                    <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">{award.year}</div>
                    <div className="text-lg md:text-xl font-black text-white uppercase tracking-tight mt-1">{award.title}</div>
                    <p className="text-sm md:text-base text-slate-400 mt-2 leading-relaxed font-light">{award.description}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
            
            <div className="lg:col-span-2"><ImageGalleryCarousel /></div>
          </div>
        </Section>

        <Section 
          id="projets" 
          title="Réalisations" 
          subtitle="Chaque projet est une réponse unique à un défi technique complexe."
          bgImage="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {homeProjects.map((project, i) => <ProjectCard key={project.title} project={project} onClick={() => setSelectedProject(project)} />)}
            <div className="flex flex-col items-center justify-center p-10 md:p-12 glass rounded-[2.5rem] border-dashed border-2 border-white/10 hover:border-blue-500/50 cursor-pointer group" onClick={() => setShowAllProjects(true)}>
              <div className="p-6 md:p-8 bg-blue-500/10 rounded-full mb-6 group-hover:scale-110 transition-transform">
                <Layers size={40} className="text-blue-500" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white uppercase mb-3">Plus de 25 Projets</h3>
              <p className="text-slate-500 text-center text-sm mb-6 md:mb-8 font-light">Découvrez l'intégralité de mon portfolio.</p>
              <button className="px-8 md:px-10 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] md:text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-blue-600/20">VOIR TOUT</button>
            </div>
          </div>
        </Section>

        {/* PARCOURS SECTION */}
        <Section 
          id="experience" 
          title="Parcours" 
          subtitle="Une expertise forgée au cœur de projets d'envergure."
          bgImage="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200"
        >
          <div className="max-w-4xl mx-auto">
            {EXPERIENCES.map((exp, i) => (
              <div key={i} className="relative pl-8 md:pl-20 pb-12 md:pb-20 last:pb-0 group">
                <div className="absolute left-[7px] md:left-[35px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/50 via-blue-500/20 to-transparent group-last:bg-none" />
                
                <div className="absolute left-0 md:left-[23px] top-0 w-4 h-4 md:w-6 md:h-6 rounded-full bg-slate-950 border-2 md:border-3 border-blue-500 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(59,130,246,0.6)] group-hover:scale-125 transition-transform duration-300">
                   <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500 animate-pulse" />
                </div>

                <GlassCard className="p-6 md:p-12 border-white/5 hover:border-blue-500/40 transition-all rounded-[3rem] bg-slate-900/40 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:opacity-[0.1] transition-opacity duration-700">
                    <Briefcase size={120} className="rotate-12" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-start flex-wrap gap-4 mb-6 md:mb-8">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 glass rounded-full border-blue-500/20 mb-3">
                           <Calendar size={12} className="text-blue-500" />
                           <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{exp.period}</span>
                        </div>
                        <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter leading-tight mb-2 group-hover:text-blue-400 transition-colors">{exp.role}</h3>
                        <div className="text-base md:text-xl text-slate-300 font-bold flex items-center gap-3">
                          <span className="w-6 h-[1px] bg-blue-500/50" /> {exp.company}
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-4 mb-10">
                      {exp.description.map((item, j) => (
                        <li key={j} className="text-base md:text-lg text-slate-400 leading-relaxed font-light flex gap-4 items-start">
                          <div className="p-1 glass rounded-full mt-1.5 shrink-0">
                            <CheckCircle2 size={12} className="text-blue-500/60" />
                          </div> 
                          {item}
                        </li>
                      ))}
                    </ul>

                    {exp.tags && exp.tags.length > 0 && (
                      <div className="pt-8 border-t border-white/5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-4">Technologies clés</p>
                        <div className="flex flex-wrap gap-3">
                          {exp.tags.map((tag) => {
                            const iconUrl = TECH_ICONS[tag];
                            return (
                              <div key={tag} className="flex items-center gap-2 px-4 py-2 glass rounded-2xl border-white/5 hover:border-blue-500/30 transition-all group/tag cursor-default">
                                {iconUrl ? (
                                  <img src={iconUrl} alt={tag} className="w-5 h-5 group-hover/tag:scale-110 transition-transform" />
                                ) : (
                                  <div className="w-2 h-2 rounded-full bg-blue-500/50" />
                                )}
                                <span className="text-[10px] font-black uppercase text-slate-400 group-hover/tag:text-white transition-colors tracking-widest">{tag}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </Section>

        <LinkedInMarquee />

        <Section 
          id="testimonials" 
          title="Témoignages" 
          subtitle="Ce que disent mes collaborateurs de notre travail."
          bgImage="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200"
        >
          <TestimonialCarousel />
        </Section>

        <Section 
          id="trust" 
          title="Ils m'ont fait confiance" 
          subtitle="Une collaboration basée on the performance et l'innovation."
          bgImage="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200"
        >
          <ClientsMarquee />
        </Section>

        <Section 
          id="communaute" 
          title="Communauté" 
          subtitle="Un engagement actif pour l'épanouissement technologique local."
          bgImage="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=1200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto items-start">
            {COMMUNITIES.map((comm, i) => (
              <GlassCard 
                key={i} 
                className={`p-10 cursor-pointer rounded-[3rem] transition-all border-white/5 relative overflow-hidden group/card ${activeCommunity === i ? 'ring-2 ring-blue-500 bg-blue-500/10 scale-[1.02]' : 'hover:bg-white/5 hover:-translate-y-2'}`} 
                onClick={() => setActiveCommunity(activeCommunity === i ? null : i)}
              >
                <div className="absolute top-[-20%] right-[-10%] opacity-[0.02] group-hover/card:opacity-[0.05] transition-opacity duration-700 pointer-events-none">
                   <div className="text-[140px] font-black">{comm.logo}</div>
                </div>

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-24 h-24 glass rounded-3xl flex items-center justify-center text-5xl mb-8 group-hover/card:scale-110 group-hover/card:rotate-6 transition-all duration-500 bg-blue-500/5">
                    {comm.logo}
                  </div>
                  <h3 className="font-black text-white text-2xl uppercase tracking-tighter leading-none mb-4">{comm.name}</h3>
                  <div className="px-4 py-1.5 glass rounded-full border-blue-500/30">
                    <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">{comm.role}</p>
                  </div>
                  
                  <AnimatePresence>
                    {activeCommunity === i && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: 'auto', opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        className="text-sm md:text-base text-slate-400 mt-8 leading-relaxed overflow-hidden font-light"
                      >
                        <div className="pt-6 border-t border-white/10">
                           {comm.description}
                        </div>
                        <div className="mt-8 flex justify-center gap-4">
                           <div className="p-3 glass rounded-xl text-blue-400 hover:text-white transition-colors"><Globe size={18} /></div>
                           <div className="p-3 glass rounded-xl text-blue-400 hover:text-white transition-colors"><Linkedin size={18} /></div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-8">
                     <button className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500/50 group-hover/card:text-blue-500 transition-colors">
                       {activeCommunity === i ? 'FERMER' : 'DÉCOUVRIR MON IMPACT'}
                     </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </Section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-20 md:py-32 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-8 md:mb-10">Prêt pour le <br/><span className="text-blue-500">succès ?</span></h2>
            <p className="text-slate-300 text-lg md:text-2xl font-light leading-relaxed mb-10 md:mb-12">Parlons de vos idées. Je suis prêt à relever vos défis technologiques les plus ambitieux.</p>
            <address className="not-italic space-y-4 md:space-y-6">
              <div className="flex items-center gap-4 md:gap-6 text-slate-300 group/link">
                <div className="p-3 md:p-4 glass rounded-2xl text-blue-400 border-white/10 group-hover/link:bg-blue-500/10 group-hover/link:text-blue-300 transition-all"><Mail size={20} /></div>
                <a href="mailto:chaminade.dondah.adjolou@gmail.com" className="text-base md:text-lg hover:text-blue-500 transition-colors font-medium break-all">chaminade.dondah.adjolou@gmail.com</a>
              </div>
              <div className="flex items-center gap-4 md:gap-6 text-slate-300 group/link">
                <div className="p-3 md:p-4 glass rounded-2xl text-blue-500 border-white/10 group-hover/link:bg-blue-500/10 group-hover/link:text-blue-300 transition-all"><Phone size={20} /></div>
                <a href="tel:+22899181626" className="text-base md:text-lg hover:text-blue-500 transition-colors font-medium">+228 99 18 16 26</a>
              </div>
            </address>
          </div>
          <GlassCard className="p-8 md:p-14 rounded-[3.5rem] bg-slate-900/40 border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
            <form className="space-y-6 md:space-y-8" onSubmit={handleContactSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Nom complet</label>
                  <input 
                    type="text" 
                    value={contactForm.name} 
                    onChange={e => setContactForm({...contactForm, name: e.target.value})} 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-3 md:py-4 text-sm focus:outline-none focus:border-blue-500 text-white placeholder-slate-700 transition-all" 
                    placeholder="John Doe" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Email pro</label>
                  <input 
                    type="email" 
                    value={contactForm.email} 
                    onChange={e => setContactForm({...contactForm, email: e.target.value})} 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-3 md:py-4 text-sm focus:outline-none focus:border-blue-500 text-white placeholder-slate-700 transition-all" 
                    placeholder="contact@business.com" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Votre Message</label>
                <textarea 
                  rows={4} 
                  value={contactForm.message} 
                  onChange={e => setContactForm({...contactForm, message: e.target.value})} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-3 md:py-4 text-sm focus:outline-none focus:border-blue-500 text-white placeholder-slate-700 resize-none transition-all" 
                  placeholder="Décrivez votre besoin ou votre projet..." 
                />
              </div>

              <AnimatePresence>
                {formFeedback.type && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10, scale: 0.95 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className={`p-5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-center flex items-center justify-center gap-3 border ${formFeedback.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}
                  >
                    {formFeedback.type === 'success' ? <Check size={16} /> : <X size={16} />}
                    {formFeedback.message}
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full py-5 md:py-6 font-black uppercase text-[10px] md:text-xs tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 transition-all shadow-2xl relative overflow-hidden group ${isSubmitting ? 'bg-slate-800 cursor-not-allowed text-slate-500' : 'bg-green-600 hover:bg-green-500 text-white shadow-green-600/30'}`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-slate-500 border-t-white rounded-full animate-spin"></div>
                    TRAITEMENT...
                  </div>
                ) : (
                  <>
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    ENVOYER VIA WHATSAPP
                  </>
                )}
              </button>
            </form>
          </GlassCard>
        </section>
      </main>

      <ProjectModal />

      <footer className="py-16 md:py-24 text-center border-t border-white/5 px-6 bg-slate-950/40">
        <div className="text-2xl md:text-3xl font-black text-blue-500 mb-6 md:mb-8 uppercase tracking-tighter">Donchaminade</div>
        <div className="flex justify-center gap-8 md:gap-10 mb-10 md:mb-12 text-slate-500">
          <a href={SOCIALS.github} target="_blank" className="hover:text-blue-500 transition-all hover:scale-110"><Github size={28} /></a>
          <a href={SOCIALS.linkedin} target="_blank" className="hover:text-blue-500 transition-all hover:scale-110"><Linkedin size={28} /></a>
          <a href={SOCIALS.twitter} target="_blank" className="hover:text-blue-500 transition-all hover:scale-110"><Twitter size={28} /></a>
        </div>
        <div className="text-[10px] uppercase font-black tracking-[0.5em] opacity-30">© 2024 Donchaminade. Tous droits réservés.</div>
      </footer>
    </div>
  );
};

const ProjectCard: React.FC<{ project: Project; onClick: () => void }> = ({ project, onClick }) => (
  <GlassCard onClick={onClick} className="h-full flex flex-col p-0 overflow-hidden border-white/5 hover:border-blue-500/30 cursor-pointer group rounded-[2.5rem] shadow-2xl">
    <div className="relative aspect-video overflow-hidden">
      <ParallaxImage src={project.image} alt={project.title} />
      <div className="absolute top-4 left-4 z-10"><span className="px-3 py-1 glass-dark text-[8px] font-black uppercase rounded-lg border border-white/10">{project.type}</span></div>
    </div>
    <div className="p-6 md:p-8">
      <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight leading-none">{project.title}</h3>
      <p className="text-slate-400 text-xs md:text-sm line-clamp-2 mt-3 md:mt-4 font-light leading-relaxed">{project.description}</p>
      <div className="flex gap-3 md:gap-4 mt-6 md:mt-8 pt-5 md:pt-6 border-t border-white/5">
        {project.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-[9px] md:text-[10px] font-black uppercase text-slate-600 tracking-widest">{tag}</span>
        ))}
      </div>
    </div>
  </GlassCard>
);

export default App;
