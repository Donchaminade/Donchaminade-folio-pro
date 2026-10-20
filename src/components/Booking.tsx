'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { bookingUrl, profile } from '@/lib/data';
import { useI18n } from '@/lib/i18n';
import { fadeUp, reveal, stagger } from '@/lib/motion';

const SLOTS = ['09:00', '10:30', '14:00', '15:30', '17:00'];

const Italic = ({ children }: { children: React.ReactNode }) => <span className="font-serif font-normal italic normal-case tracking-normal">{children}</span>;

function MaskTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.span className="block overflow-hidden pb-[0.08em]" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
      <motion.span className={`block ${className}`} variants={{ hidden: { y: '105%' }, show: { y: 0 } }}
        transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}>{children}</motion.span>
    </motion.span>
  );
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function monthGrid(cursor: Date) {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const start = (first.getDay() + 6) % 7;
  const days = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = Array.from({ length: start }, () => null);
  for (let d = 1; d <= days; d += 1) cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
  while (cells.length % 7) cells.push(null);
  return cells;
}

export default function Booking() {
  const { t, lang } = useI18n();
  const embed = bookingUrl.trim();
  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [day, setDay] = useState<Date | null>(null);
  const [slot, setSlot] = useState('');
  const [project, setProject] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const locale = lang === 'fr' ? 'fr-FR' : 'en-GB';
  const cells = monthGrid(cursor);
  const projectName = t.bookTypes[project];

  const text = useMemo(() => {
    const when = day
      ? day.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      : '';
    const lines = lang === 'fr'
      ? [
        `Bonjour, je suis ${name.trim() || '…'}.`,
        when && slot ? `Je souhaite un appel le ${when} à ${slot}.` : '',
        `Projet : ${projectName}.`,
        message.trim(),
        email.trim() ? `E-mail : ${email.trim()}` : '',
      ]
      : [
        `Hello, I'm ${name.trim() || '…'}.`,
        when && slot ? `I'd like a call on ${when} at ${slot}.` : '',
        `Project: ${projectName}.`,
        message.trim(),
        email.trim() ? `Email: ${email.trim()}` : '',
      ];
    return lines.filter(Boolean).join('\n');
  }, [day, email, lang, locale, message, name, projectName, slot]);

  const mailHref = `mailto:${profile.email}?subject=${encodeURIComponent(t.bookCall)}&body=${encodeURIComponent(text)}`;
  const waHref = `${profile.whatsapp}?text=${encodeURIComponent(text)}`;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const ready = name.trim() && email.includes('@') && (embed || (day && slot));
    if (!ready) { setError(true); return; }
    setError(false);
    window.open(waHref, '_blank', 'noopener,noreferrer');
  };

  const shift = (delta: number) => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1));

  return (
    <section id="rendez-vous" className="wrap py-20 md:py-28">
      <div className="grid items-end gap-6 md:grid-cols-[1.2fr_.8fr]">
        <h2 className="font-display text-[12vw] font-black uppercase leading-[.85] tracking-tight md:text-[6vw]">
          <MaskTitle className="metal">{t.bookTitleA}</MaskTitle>
          <MaskTitle><Italic><span className="text-cream">{t.bookTitleB}</span></Italic></MaskTitle>
        </h2>
        <motion.p {...reveal(0.1)} className="max-w-md text-[17px] leading-relaxed text-mist">{t.bookNote}</motion.p>
      </div>

      <form onSubmit={submit} className="mt-12 grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
        <div>
          {embed ? (
            <iframe src={embed} title={t.bookEmbed} className="min-h-[680px] w-full rounded-3xl border border-white/10 bg-white" loading="lazy" />
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/[.04] px-1.5 py-4 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <button type="button" onClick={() => shift(-1)} aria-label={t.bookPrev} className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-lg">‹</button>
                <p className="font-display text-lg font-black uppercase">{cursor.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}</p>
                <button type="button" onClick={() => shift(1)} aria-label={t.bookNext} className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-lg">›</button>
              </div>
              <div className="mt-4 grid grid-cols-7 gap-0 text-center text-xs uppercase tracking-[0.12em] text-white/40 sm:gap-1">
                {t.weekdays.map((d) => <span key={d}>{d}</span>)}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={`${cursor.getFullYear()}-${cursor.getMonth()}`} variants={stagger(0.012)} initial="hidden" animate="show" className="mt-2 grid grid-cols-7 gap-0 sm:gap-1">
                  {cells.map((d, i) => {
                    const past = d ? d < today : false;
                    const on = d && day ? sameDay(d, day) : false;
                    return (
                      <motion.button key={d ? d.toISOString() : `e${i}`} type="button" variants={fadeUp} disabled={!d || past}
                        onClick={() => d && setDay(d)}
                        className={`h-11 rounded-xl text-base ${!d ? 'pointer-events-none' : past ? 'opacity-30' : on ? 'bg-cream font-semibold text-ink' : 'hover:bg-white/10'}`}>
                        {d ? d.getDate() : ''}
                      </motion.button>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
              <p className="mt-6 text-sm uppercase tracking-[0.16em] text-white/50">{t.bookSlot}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SLOTS.map((s) => (
                  <button key={s} type="button" onClick={() => setSlot(s)}
                    className={`inline-flex min-h-11 items-center rounded-full border px-4 text-base ${slot === s ? 'border-cream bg-cream text-ink' : 'border-white/20'}`}>{s}</button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <label className="block">
            <span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.bookProject}</span>
            <span className="mt-2 grid grid-cols-2 gap-2">
              {t.bookTypes.map((name, i) => (
                <button key={name} type="button" onClick={() => setProject(i)}
                  className={`min-h-11 rounded-2xl border px-3 py-3 text-left text-base ${project === i ? 'border-cream bg-cream text-ink' : 'border-white/15'}`}>{name}</button>
              ))}
            </span>
          </label>
          <label className="block">
            <span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.bookName}</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="mt-2 min-h-11 w-full rounded-2xl border border-white/15 bg-white/5 px-4 text-base outline-none focus:border-cream" />
          </label>
          <label className="block">
            <span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.email}</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-2 min-h-11 w-full rounded-2xl border border-white/15 bg-white/5 px-4 text-base outline-none focus:border-cream" />
          </label>
          <label className="block">
            <span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.bookMessage}</span>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="mt-2 w-full resize-y rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base outline-none focus:border-cream" />
          </label>
          {error && <p className="text-sm text-cream">{t.bookNeed}</p>}
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <button type="submit" className="min-h-11 rounded-full bg-cream px-6 text-base font-medium tracking-wide text-ink">{t.bookSend}</button>
            <a href={mailHref} className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/25 px-6 text-center text-base font-medium tracking-wide">{t.bookMail}</a>
          </div>
        </div>
      </form>
    </section>
  );
}
