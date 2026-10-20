'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Send, Star } from 'lucide-react';
import { Heartbeat, MotionIcon } from './MotionIcon';
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

const emailOk = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const IMAGE_OK = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

function Status({ status, notice }: { status: string; notice: string }) {
  return (
    <AnimatePresence mode="wait">
      {notice && (
        <motion.p key={status + notice} role={status === 'fail' ? 'alert' : 'status'} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="text-base text-cream md:col-span-2">{notice}</motion.p>
      )}
    </AnimatePresence>
  );
}

function Reel({ items }: { items: { key: string; text: string; meta: string; stars?: number }[] }) {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  useEffect(() => { setIndex(0); }, [items.length]);
  useEffect(() => {
    if (items.length < 2) return;
    const timer = setInterval(() => setIndex((v) => (v + 1) % items.length), 5200);
    return () => clearInterval(timer);
  }, [items.length]);
  if (!items.length) return null;
  const item = items[index];
  return (
    <div className="mt-8">
      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.blockquote key={item.key} initial={{ opacity: 0, x: 36 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -36 }} transition={{ duration: 0.45 }} className="rounded-3xl border border-white/10 p-6 md:p-10">
            {item.stars ? <p className="inline-flex gap-0.5 text-cream" aria-label={`${item.stars}`}>{Array.from({ length: item.stars }, (_, i) => <MotionIcon key={i} icon={Star} size={14} effect="heart" filled />)}</p> : null}
            <p className="mt-3 font-serif text-2xl italic leading-snug md:text-3xl">{item.text}</p>
            <p className="mt-6 text-base text-mist">{item.meta}</p>
          </motion.blockquote>
        </AnimatePresence>
      </div>
      {items.length > 1 && (
        <div className="mt-4 flex items-center gap-2">
          <button type="button" onClick={() => setIndex((v) => (v - 1 + items.length) % items.length)} className="grid h-11 w-11 place-items-center rounded-full border border-white/20" aria-label={t.galleryPrev}><MotionIcon icon={ChevronLeft} size={16} effect="slideBack" /></button>
          <button type="button" onClick={() => setIndex((v) => (v + 1) % items.length)} className="grid h-11 w-11 place-items-center rounded-full border border-white/20" aria-label={t.galleryNext}><MotionIcon icon={ChevronRight} size={16} effect="slide" /></button>
          <span className="text-sm text-mist">{index + 1} / {items.length}</span>
        </div>
      )}
    </div>
  );
}

export function Proof({ page = false }: { page?: boolean }) {
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
    <section id="retours" className={`wrap py-20 md:py-28 ${page ? 'pt-28 md:pt-36' : ''}`}>
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
      <Reel items={[
        ...shownT.map((item) => ({ key: `t-${item.name}-${item.quote.slice(0, 16)}`, text: item.quote, meta: [item.name, item.role, item.company].filter(Boolean).join(' · ') })),
        ...shownR.map((item) => ({ key: `r-${item.name}-${item.body.slice(0, 16)}`, text: item.body, meta: [item.name, item.role, item.company].filter(Boolean).join(' · '), stars: item.rating })),
      ]} />
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
  const [photo, setPhoto] = useState<File | null>(null);
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'fail'>('idle');
  const [notice, setNotice] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (website) return;
    if (!name.trim() || !quote.trim()) { setNotice(t.contactRequired); setStatus('fail'); return; }
    if (quote.trim().length < 30) { setNotice(t.minChars); setStatus('fail'); return; }
    if (email.trim() && !emailOk(email.trim())) { setNotice(t.contactEmailInvalid); setStatus('fail'); return; }
    if (photo && !IMAGE_OK.includes(photo.type)) { setNotice(t.fileType); setStatus('fail'); return; }
    if (photo && photo.size > 5_242_880) { setNotice(t.fileTooBig); setStatus('fail'); return; }
    setNotice('');
    setStatus('sending');
    try {
      const msg = await submitTestimonial({ quote: quote.trim(), name: name.trim(), email: email.trim() || undefined, role: role.trim() || undefined, company: company.trim() || undefined, website, image: photo });
      setNotice(msg || t.contactSent);
      setStatus('sent');
      setQuote('');
      setPhoto(null);
    } catch (err) {
      setNotice(err instanceof Error && err.message ? err.message : t.sendError);
      setStatus('fail');
    }
  };
  void onDone;

  return (
    <form onSubmit={submit} className="mt-6 grid gap-4 rounded-3xl border border-white/10 p-5 md:grid-cols-2">
      <input name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <label className="md:col-span-2">
        <span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.quoteLabel}</span>
        <textarea value={quote} onChange={(e) => setQuote(e.target.value)} rows={4} placeholder={t.minChars} className={`${field} resize-y`} />
      </label>
      <label><span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.bookName}</span><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={field} /></label>
      <label><span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.email}</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={field} /></label>
      <label><span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.recRole}</span><input value={role} onChange={(e) => setRole(e.target.value)} className={field} /></label>
      <label><span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.recCompany}</span><input value={company} onChange={(e) => setCompany(e.target.value)} className={field} /></label>
      <label className="md:col-span-2">
        <span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.photoOptional}</span>
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => setPhoto(e.target.files?.[0] || null)} className="mt-2 block min-h-11 w-full text-base" />
      </label>
      <Status status={status} notice={notice} />
      <Heartbeat className="md:col-span-2 md:w-fit">
        <motion.button type="submit" disabled={status === 'sending'} whileTap={{ scale: 0.98 }} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-cream px-6 text-base font-medium text-ink disabled:opacity-60">
          <MotionIcon icon={Send} size={16} effect="slide" />
          {status === 'sending' ? t.sending : t.testiSend}
        </motion.button>
      </Heartbeat>
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
  const [notice, setNotice] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (website) return;
    if (!name.trim() || !body.trim()) { setNotice(t.contactRequired); setStatus('fail'); return; }
    if (rating < 1 || rating > 5) { setNotice(t.chooseRating); setStatus('fail'); return; }
    if (body.trim().length < 30) { setNotice(t.minChars); setStatus('fail'); return; }
    if (email.trim() && !emailOk(email.trim())) { setNotice(t.contactEmailInvalid); setStatus('fail'); return; }
    setNotice('');
    setStatus('sending');
    try {
      const msg = await submitRecommendation({ name: name.trim(), email: email.trim() || undefined, role: role.trim() || undefined, company: company.trim() || undefined, body: body.trim(), rating, website });
      setNotice(msg || t.sentRecommendation);
      setStatus('sent');
      setBody('');
      setRating(0);
    } catch (err) {
      setNotice(err instanceof Error && err.message ? err.message : t.sendError);
      setStatus('fail');
    }
  };
  void onDone;

  return (
    <form onSubmit={submit} className="mt-6 grid gap-4 rounded-3xl border border-white/10 p-5 md:grid-cols-2">
      <input name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="md:col-span-2">
        <span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.recRating}</span>
        <span className="mt-2 flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n}`}
              className={`grid h-11 w-11 place-items-center rounded-full border text-base ${rating >= n ? 'border-cream bg-cream text-ink' : 'border-white/20'}`}>
              <MotionIcon icon={Star} size={16} effect="heart" filled={rating >= n} />
            </button>
          ))}
        </span>
      </div>
      <label className="md:col-span-2">
        <span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.recommendations}</span>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder={t.minChars} className={`${field} resize-y`} />
      </label>
      <label><span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.bookName}</span><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={field} /></label>
      <label><span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.email}</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={field} /></label>
      <label><span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.recRole}</span><input value={role} onChange={(e) => setRole(e.target.value)} className={field} /></label>
      <label><span className="text-sm uppercase tracking-[0.16em] text-white/50">{t.recCompany}</span><input value={company} onChange={(e) => setCompany(e.target.value)} className={field} /></label>
      <Status status={status} notice={notice} />
      <Heartbeat className="md:col-span-2 md:w-fit">
        <motion.button type="submit" disabled={status === 'sending'} whileTap={{ scale: 0.98 }} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-cream px-6 text-base font-medium text-ink disabled:opacity-60">
          <MotionIcon icon={Send} size={16} effect="slide" />
          {status === 'sending' ? t.sending : t.recSend}
        </motion.button>
      </Heartbeat>
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
