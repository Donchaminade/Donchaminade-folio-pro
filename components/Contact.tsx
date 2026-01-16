import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Send, Check, X } from 'lucide-react';
import { GlassCard } from './GlassCard';

const Contact: React.FC = () => {
    const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
    const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const SOCIALS = {
        whatsapp: '22899181626'
    };

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
          
          const formattedMessage = `*Bonjour Chaminade,*

Nouveau message de: *${name}*
Email: ${email}

*Message:*
${message}`;
          
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

    return (
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
    );
}

export default Contact;
