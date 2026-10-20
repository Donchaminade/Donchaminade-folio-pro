'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { bookingUrl, profile } from '@/lib/data';
import { submitCollaboration } from '@/lib/api';
import { useI18n } from '@/lib/i18n';
import { reveal } from '@/lib/motion';

const Italic = ({ children }: { children: React.ReactNode }) => <span className="font-serif font-normal italic normal-case tracking-normal">{children}</span>;

function MaskTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.span className="block overflow-hidden pb-[0.08em]" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
      <motion.span className={`block ${className}`} variants={{ hidden: { y: '105%' }, show: { y: 0 } }}
        transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}>{children}</motion.span>
    </motion.span>
  );
}

export default function Booking() {
  const { t, lang } = useI18n();
  const reduced = !!useReducedMotion();
  const [project, setProject] = useState(0);
  const [platform, setPlatform] = useState<keyof typeof t.platforms>('google_meet');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [error, setError] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'fail'>('idle');
  const projectName = t.bookTypes[project];

  const text = useMemo(() => {
    const lines = lang === 'fr'
      ? [
        `Bonjour, je suis ${name.trim() || '…'}.`,
        `Projet : ${projectName}.`,
        `Plateforme : ${t.platforms[platform]}.`,
        `Créneau : ${bookingUrl}`,
        message.trim(),
        email.trim() ? `E-mail : ${email.trim()}` : '',
      ]
      : [
        `Hello, I'm ${name.trim() || '…'}.`,
        `Project: ${projectName}.`,
        `Platform: ${t.platforms[platform]}.`,
        `Slot: ${bookingUrl}`,
        message.trim(),
        email.trim() ? `Email: ${email.trim()}` : '',
      ];
    return lines.filter(Boolean).join('\n');
  }, [email, lang, message, name, platform, projectName, t.platforms]);

  const mailHref = `mailto:${profile.email}?subject=${encodeURIComponent(t.bookCall)}&body=${encodeURIComponent(text)}`;
  const waHref = `${profile.whatsapp}?text=${encodeURIComponent(text)}`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (website) return;
    const ready = name.trim() && email.includes('@') && message.trim().length >= 20;
    if (!ready) { setError(true); setStatus('idle'); return; }
    setError(false);
    setStatus('sending');
    try {
      await submitCollaboration({
        name: name.trim(),
        email: email.trim(),
        subject: projectName,
        collaboration_brief: message.trim(),
        meeting_platform: platform,
        meeting_slots: bookingUrl,
        meeting_notes: message.trim(),
        website,
      });
      setStatus('sent');
    } catch {
      setStatus('fail');
    }
  };

  return (
    <section id="rendez-vous" className="wrap py-20 md:py-28">
      <div className="grid items-end gap-6 md:grid-cols-[1.2fr_.8fr]">
        <h2 className="font-display text-[12vw] font-black uppercase leading-[.85] tracking-tight md:text-[6vw]">
          <MaskTitle className="metal">{t.bookTitleA}</MaskTitle>
          <MaskTitle><Italic><span className="text-cream">{t.bookTitleB}</span></Italic></MaskTitle>
        </h2>
        <motion.p {...reveal(0.1)} className="max-w-md text-base leading-relaxed text-mist">{t.bookNote}</motion.p>
      </div>

      <motion.a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={reduced ? undefined : { scale: 1.02 }}
        whileTap={reduced ? undefined : { scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 420, damping: 22 }}
        className="relative mt-10 flex min-h-16 w-full items-center justify-center overflow-hidden rounded-full bg-cream px-8 text-lg font-medium tracking-wide text-ink md:min-h-20 md:text-2xl"
      >
        {!reduced && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-1/3 bg-white/35"
            initial={{ x: '-140%' }}
            animate={{ x: ['-140%', '320%'] }}
            transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut', repeatDelay: 1.1 }}
          />
        )}
        <span className="relative">{t.bookOpen}</span>
      </motion.a>
      <p className="mt-3 text-base text-mist">{t.bookNewTab}</p>

      <form onSubmit={submit} className="mt-12 rounded-3xl border border-white/10 bg-white/[.03] p-5 md:p-8">
        <h3 className="font-display text-2xl font-black uppercase">{t.bookSecondary}</h3>
        <input name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <div className="mt-6 grid gap-4">
          <label className="block">
            <span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.bookProject}</span>
            <span className="mt-2 grid grid-cols-2 gap-2">
              {t.bookTypes.map((label, i) => (
                <button key={label} type="button" onClick={() => setProject(i)}
                  className={`min-h-11 rounded-2xl border px-3 py-3 text-left text-base ${project === i ? 'border-cream bg-cream text-ink' : 'border-white/15'}`}>{label}</button>
              ))}
            </span>
          </label>
          <label className="block">
            <span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.bookPlatform}</span>
            <select value={platform} onChange={(e) => setPlatform(e.target.value as keyof typeof t.platforms)}
              className="mt-2 min-h-11 w-full rounded-2xl border border-white/15 bg-transparent px-4 text-base outline-none focus:border-cream">
              {(Object.keys(t.platforms) as (keyof typeof t.platforms)[]).map((key) => (
                <option key={key} value={key} className="bg-ink text-white">{t.platforms[key]}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.bookName}</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" className="mt-2 min-h-11 w-full rounded-2xl border border-white/15 bg-white/5 px-4 text-base outline-none focus:border-cream" />
          </label>
          <label className="block">
            <span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.email}</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="mt-2 min-h-11 w-full rounded-2xl border border-white/15 bg-white/5 px-4 text-base outline-none focus:border-cream" />
          </label>
          <label className="block">
            <span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.bookMessage}</span>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="mt-2 w-full resize-y rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base outline-none focus:border-cream" />
          </label>
          {error && <p className="text-sm text-cream">{t.bookNeed}</p>}
          {status === 'sent' && <p className="text-base text-cream" role="status">{t.bookSent}</p>}
          {status === 'fail' && <p className="text-base text-cream" role="alert">{t.bookFail}</p>}
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <button type="submit" disabled={status === 'sending'} className="min-h-11 rounded-full bg-cream px-6 text-base font-medium tracking-wide text-ink disabled:opacity-60">{status === 'sending' ? t.sending : t.bookSend}</button>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/25 px-6 text-center text-base font-medium tracking-wide">{t.bookWhatsapp}</a>
            <a href={mailHref} className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/25 px-6 text-center text-base font-medium tracking-wide">{t.bookMail}</a>
          </div>
        </div>
      </form>
    </section>
  );
}
