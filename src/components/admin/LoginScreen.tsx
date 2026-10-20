'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { adminCopy } from '@/lib/admin-copy';
import { adminHasSession, adminLogin } from '@/lib/admin-server';
import { useI18n } from '@/lib/i18n';
import Controls from '../Controls';
import { badgePop, cardPop, LiquidButton, Orbs, Pressable, reveal, stagger } from './ui';

const emailOk = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export default function LoginScreen() {
  const { lang } = useI18n();
  const t = adminCopy[lang];
  const reduce = !!useReducedMotion();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [note, setNote] = useState('');
  const [step, setStep] = useState(0);
  const valid = emailOk(email);

  useEffect(() => {
    adminHasSession().then((ok) => { if (ok) router.replace('/admin/tableau'); }).catch(() => {});
  }, [router]);

  const enter = async () => {
    if (!valid) { setNote(t.emailInvalid); throw new Error(t.emailInvalid); }
    if (!password) { setNote(t.passwordRequired); throw new Error(t.passwordRequired); }
    setNote('');
    setStep(1);
    try {
      await adminLogin(email, password);
    } catch (error) {
      setStep(0);
      const message = error instanceof Error ? error.message : t.passwordRequired;
      setNote(message);
      throw error;
    }
    setStep(2);
    router.push('/admin/tableau');
  };

  return (
    <main className="admin-root relative min-h-[100dvh] overflow-x-clip px-4 py-6 sm:px-6">
      <Orbs />
      <div className="relative z-[1] mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex items-center justify-end">
          <Controls />
        </div>
        <motion.header variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="text-center">
          <motion.p variants={reveal} className="admin-kicker">{t.loginKicker}</motion.p>
          <motion.h1 variants={reveal} className="admin-display mt-2 text-[clamp(2.4rem,10vw,4.6rem)] leading-[.9]">
            {t.loginTitle}
            <span className="mt-1 block font-serif text-[.72em] font-normal italic text-[var(--ad-accent)]">{t.loginAccent}</span>
          </motion.h1>
        </motion.header>

        <motion.section variants={cardPop} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="admin-card grid overflow-hidden md:grid-cols-[1.15fr_.85fr]">
          <form className="min-w-0 p-5 sm:p-8" onSubmit={(event) => event.preventDefault()}>
            <h2 className="font-display text-2xl font-black tracking-tight sm:text-3xl">{t.welcome}</h2>
            <p className="mt-1 text-sm text-[var(--ad-muted)]">{t.welcomeHint}</p>
            <label className="admin-label" htmlFor="admin-email">{t.email}</label>
            <div className="admin-field">
              <input id="admin-email" name="email" type="email" autoComplete="username" value={email} onChange={(event) => { setEmail(event.target.value); setStep(0); }} className="admin-input" />
              <span className={`admin-check ${valid ? 'is-on' : ''}`} aria-hidden>✓</span>
            </div>
            <label className="admin-label" htmlFor="admin-password">{t.password}</label>
            <div className="admin-field">
              <input id="admin-password" name="password" type={show ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => { setPassword(event.target.value); setStep(0); }} className="admin-input pr-12" />
              <Pressable className="admin-eye" ariaLabel={show ? t.hidePassword : t.showPassword} onClick={() => setShow((value) => !value)}>
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </Pressable>
            </div>
            <LiquidButton className="mt-6 w-full" action={enter}>{t.submit}</LiquidButton>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
              <Pressable className="admin-text-btn" onClick={() => setNote(t.forgotNote)}>{t.forgot}</Pressable>
              <span className="text-[var(--ad-muted)]">{t.reserved}</span>
            </div>
            {note ? <p className="mt-3 text-sm text-[var(--ad-muted)]" role="status">{note}</p> : null}
          </form>

          <aside className="admin-aside flex min-w-0 flex-col items-center justify-center gap-6 px-5 py-8 sm:px-8">
            <div className="admin-shield" aria-hidden>
              <motion.span className="admin-shield-ring" animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} />
              <motion.span className="admin-shield-ring admin-shield-ring-b" animate={reduce ? undefined : { rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} />
              <span className="admin-shield-core" />
            </div>
            <p className="admin-kicker">{t.shield}</p>
            <div className="grid w-full gap-2" role="radiogroup" aria-label={t.shield}>
              {t.steps.map((label, index) => (
                <motion.button
                  key={label}
                  type="button"
                  role="radio"
                  aria-checked={step === index}
                  variants={badgePop}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  whileHover={reduce ? undefined : { y: -2 }}
                  whileTap={reduce ? undefined : { scale: 0.98 }}
                  onClick={() => setStep(index)}
                  className={`admin-step ${step === index ? 'is-on' : ''}`}
                >
                  <span className="admin-radio" />
                  {label}
                </motion.button>
              ))}
            </div>
          </aside>
        </motion.section>
      </div>
    </main>
  );
}
