'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { fetchProof, submitRecommendation, submitTestimonial, type PublishedTestimonial, type Recommendation } from '@/lib/api';
import { clients } from '@/lib/catalog';
import { useI18n } from '@/lib/i18n';
import { fadeUp, inViewGroup, reveal } from '@/lib/motion';

const Italic = ({ children }: { children: React.ReactNode }) => <span className="font-serif font-normal italic normal-case tracking-normal">{children}</span>;

function MaskTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.span className="block overflow-hidden pb-[0.08em]" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
      <motion.span className={`block ${className}`} variants={{ hidden: { y: '105%' }, show: { y: 0 } }}
        transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}>{children}</motion.span>
    </motion.span>
  );
}

const field = 'mt-2 min-h-11 w-full rounded-2xl border border-white/15 bg-white/5 px-4 text-base outline-none focus:border-cream';

export function Proof() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<'all' | 't' | 'r'>('all');
  const [testimonials, setTestimonials] = useState<PublishedTestimonial[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loadFail, setLoadFail] = useState(false);
  const [mode, setMode] = useState<'none' | 't' | 'r'>('none');

  useEffect(() => {
    let gone = false;
    fetchProof()
      .then((data) => {
        if (gone) return;
        setTestimonials(data.testimonials);
        setRecommendations(data.recommendations);
      })
      .catch(() => { if (!gone) setLoadFail(true); });
    return () => { gone = true; };
  }, []);

  const shownT = filter === 'r' ? [] : testimonials;
  const shownR = filter === 't' ? [] : recommendations;
  const filters = [
    { id: 'all' as const, label: t.allProof },
    { id: 't' as const, label: t.testimonials },
    { id: 'r' as const, label: t.recommendations },
  ];

  return (
    <section id="retours" className="wrap py-20 md:py-28">
      <div className="grid items-end gap-6 md:grid-cols-[1.1fr_.9fr]">
        <h2 className="font-display text-[11vw] font-black uppercase leading-[.85] tracking-tight md:text-[5.5vw]">
          <MaskTitle className="metal">{t.proofTitleA}</MaskTitle>
          <MaskTitle><Italic><span className="text-cream">{t.proofTitleB}</span></Italic></MaskTitle>
        </h2>
        <motion.p {...reveal(0.1)} className="max-w-md text-base leading-relaxed text-mist">{t.proofLead}</motion.p>
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={() => setMode(mode === 't' ? 'none' : 't')} className="min-h-11 rounded-full bg-cream px-5 text-base font-medium text-ink">{mode === 't' ? t.closeForm : t.leaveTestimonial}</button>
        <button type="button" onClick={() => setMode(mode === 'r' ? 'none' : 'r')} className="min-h-11 rounded-full border border-white/25 px-5 text-base font-medium">{mode === 'r' ? t.closeForm : t.leaveRecommendation}</button>
      </div>
      {mode === 't' && <TestimonialForm onDone={() => setMode('none')} />}
      {mode === 'r' && <RecommendationForm onDone={() => setMode('none')} />}

      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label={t.proofFilters}>
        {filters.map((item) => (
          <button key={item.id} type="button" onClick={() => setFilter(item.id)}
            className={`min-h-11 rounded-full border px-4 text-base ${filter === item.id ? 'border-cream bg-cream text-ink' : 'border-white/20'}`}>{item.label}</button>
        ))}
      </div>
      {loadFail && <p className="mt-6 text-base text-cream" role="alert">{t.proofLoadFail}</p>}
      <ul className="mt-8 grid gap-4">
        {shownT.map((item) => (
          <li key={`${item.name}-${item.quote.slice(0, 24)}`} className="rounded-3xl border border-white/10 p-6">
            <p className="text-base leading-relaxed">{item.quote}</p>
            <p className="mt-3 text-base text-mist">{item.name}{item.role ? ` · ${item.role}` : ''}{item.company ? ` · ${item.company}` : ''}</p>
          </li>
        ))}
        {shownR.map((item) => (
          <li key={`${item.name}-${item.body.slice(0, 24)}`} className="rounded-3xl border border-white/10 p-6">
            <p className="text-base leading-relaxed">{item.body}</p>
            <p className="mt-3 text-base text-mist">{item.name}{item.role ? ` · ${item.role}` : ''}{item.company ? ` · ${item.company}` : ''}</p>
          </li>
        ))}
      </ul>
      {shownT.length === 0 && filter !== 'r' && <p className="mt-6 text-base text-mist">{t.emptyTestimonials}</p>}
      {shownR.length === 0 && filter !== 't' && <p className="mt-3 text-base text-mist">{t.emptyRecommendations}</p>}
    </section>
  );
}

function TestimonialForm({ onDone }: { onDone: () => void }) {
  const { t } = useI18n();
  const [quote, setQuote] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'fail'>('idle');
  const [invalid, setInvalid] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (website) return;
    if (!name.trim() || quote.trim().length < 20) { setInvalid(true); return; }
    setInvalid(false);
    setStatus('sending');
    try {
      await submitTestimonial({ quote: quote.trim(), name: name.trim(), email: email.trim() || undefined, role: role.trim() || undefined, company: company.trim() || undefined, website });
      setStatus('sent');
      onDone();
    } catch {
      setStatus('fail');
    }
  };

  return (
    <form onSubmit={submit} className="mt-6 grid gap-4 rounded-3xl border border-white/10 p-5 md:grid-cols-2">
      <input name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <label className="md:col-span-2">
        <span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.quoteLabel}</span>
        <textarea value={quote} onChange={(e) => setQuote(e.target.value)} rows={4} className={`${field} resize-y`} />
      </label>
      <label><span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.bookName}</span><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={field} /></label>
      <label><span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.email}</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={field} /></label>
      <label><span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.recRole}</span><input value={role} onChange={(e) => setRole(e.target.value)} className={field} /></label>
      <label><span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.recCompany}</span><input value={company} onChange={(e) => setCompany(e.target.value)} className={field} /></label>
      {invalid && <p className="text-sm text-cream md:col-span-2">{t.minQuote}</p>}
      {status === 'fail' && <p className="text-base text-cream md:col-span-2" role="alert">{t.sendFail}</p>}
      {status === 'sent' && <p className="text-base text-cream md:col-span-2" role="status">{t.contactSent}</p>}
      <button type="submit" disabled={status === 'sending'} className="min-h-11 rounded-full bg-cream px-6 text-base font-medium text-ink md:col-span-2 md:w-fit disabled:opacity-60">{status === 'sending' ? t.sending : t.testiSend}</button>
    </form>
  );
}

function RecommendationForm({ onDone }: { onDone: () => void }) {
  const { t } = useI18n();
  const [body, setBody] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [rating, setRating] = useState(0);
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'fail'>('idle');
  const [invalid, setInvalid] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (website) return;
    if (!name.trim() || body.trim().length < 20 || rating < 1) { setInvalid(true); return; }
    setInvalid(false);
    setStatus('sending');
    try {
      await submitRecommendation({ name: name.trim(), email: email.trim() || undefined, role: role.trim() || undefined, company: company.trim() || undefined, body: body.trim(), rating, website });
      setStatus('sent');
      onDone();
    } catch {
      setStatus('fail');
    }
  };

  return (
    <form onSubmit={submit} className="mt-6 grid gap-4 rounded-3xl border border-white/10 p-5 md:grid-cols-2">
      <input name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="md:col-span-2">
        <span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.recRating}</span>
        <span className="mt-2 flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n}`}
              className={`grid h-11 w-11 place-items-center rounded-full border text-base ${rating >= n ? 'border-cream bg-cream text-ink' : 'border-white/20'}`}>{n}</button>
          ))}
        </span>
      </div>
      <label className="md:col-span-2">
        <span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.recommendations}</span>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} className={`${field} resize-y`} />
      </label>
      <label><span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.bookName}</span><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={field} /></label>
      <label><span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.email}</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={field} /></label>
      <label><span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.recRole}</span><input value={role} onChange={(e) => setRole(e.target.value)} className={field} /></label>
      <label><span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.recCompany}</span><input value={company} onChange={(e) => setCompany(e.target.value)} className={field} /></label>
      {invalid && <p className="text-sm text-cream md:col-span-2">{t.bookNeed}</p>}
      {status === 'fail' && <p className="text-base text-cream md:col-span-2" role="alert">{t.sendFail}</p>}
      {status === 'sent' && <p className="text-base text-cream md:col-span-2" role="status">{t.contactSent}</p>}
      <button type="submit" disabled={status === 'sending'} className="min-h-11 rounded-full bg-cream px-6 text-base font-medium text-ink md:col-span-2 md:w-fit disabled:opacity-60">{status === 'sending' ? t.sending : t.recSend}</button>
    </form>
  );
}

export function Trust() {
  const { t } = useI18n();
  if (!clients.length) return null;
  return (
    <section id="confiance" className="wrap py-20 md:py-28">
      <p className="label text-cream">{t.trustKicker}</p>
      <h2 className="mt-3 font-display text-5xl font-black uppercase leading-none md:text-7xl">
        <MaskTitle className="metal">{t.trustTitle}</MaskTitle>
      </h2>
      <motion.p {...reveal(0.1)} className="mt-4 max-w-xl text-base text-mist">{t.trustLead}</motion.p>
      <motion.ul {...inViewGroup(0.08)} className="mt-8 flex flex-wrap gap-3">
        {clients.map((client) => (
          <motion.li key={client.name} variants={fadeUp} className="inline-flex min-h-11 items-center gap-3 rounded-full border border-white/15 px-4 py-2">
            <img src={client.logo} alt="" width={28} height={28} className="h-7 w-7 object-contain" />
            <span className="text-base">{client.name}</span>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
