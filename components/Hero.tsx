
import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Github, Linkedin, Twitter, Download, ShieldCheck, ArrowUpRight } from 'lucide-react';
import GlitchText from './GlitchText';

const Hero: React.FC = () => {

    const { scrollY } = useScroll();
    const smoothScrollY = useSpring(scrollY, { stiffness: 100, damping: 30 });
    
    const heroImageY = useTransform(smoothScrollY, [0, 500], [0, 80]);
    const heroTextY = useTransform(smoothScrollY, [0, 500], [0, -40]);
    const heroBgY = useTransform(smoothScrollY, [0, 1000], ["0%", "20%"]);

    const SOCIALS = {
        linkedin: 'https://linkedin.com/in/chaminadeadjolou',
        twitter: 'https://x.com/Donchaminde',
        github: 'https://github.com/Donchaminade',
        whatsapp: '22899181626'
    };

    return (
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
                Architecte digital passionné, je transforme vos visions en solutions web et mobiles performantes. Fort de plus de <span className="text-white font-bold italic underline decoration-blue-500/50">3 ans d'expérience</span> en développement et gestion de communautés, je livre des applications robustes et intuitives, amplifiant l'engagement et la visibilité. 
                </p>

                <div className="flex flex-wrap gap-4 md:gap-6 items-center">
                <a href="#projets" className="group px-8 md:px-12 py-5 md:py-6 bg-blue-600 text-white font-black text-[10px] md:text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-500 transition-all shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95 flex items-center gap-3">
                    MES RÉALISATIONS <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
                
                <a 
                    href="/CV_ADJOLOU_DONDAH_CHAMINADE.pdf" 
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
    );
}

export default Hero;
