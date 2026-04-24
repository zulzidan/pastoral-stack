"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { HeroTerrainModel } from "@/components/hero-terrain-model"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { ArrowRightIcon, CheckIcon, MenuIcon, XIcon } from "lucide-react"
import { PastoralLogo } from "@/components/pastoral-logo"
import { AuditForm } from "@/components/audit-form"

// ─── Topographic contour ring decoration ──────────────────────────────────
function TopoRings({ className }: { className?: string }) {
  const rings = [60, 120, 180, 240, 300, 360, 420, 480]
  return (
    <svg
      aria-hidden
      viewBox="0 0 600 600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className={className}
    >
      {rings.map((r, i) => (
        <circle
          key={r}
          cx="300"
          cy="300"
          r={r}
          stroke="white"
          strokeWidth="1"
          opacity={Math.max(0.02, 0.14 - i * 0.016)}
        />
      ))}
      <ellipse cx="300" cy="270" rx="140" ry="95" stroke="white" strokeWidth="0.8" opacity="0.07" />
      <ellipse cx="310" cy="255" rx="90" ry="60" stroke="white" strokeWidth="0.8" opacity="0.05" />
      <ellipse cx="295" cy="245" rx="50" ry="32" stroke="white" strokeWidth="0.8" opacity="0.04" />
    </svg>
  )
}

const heroTimelineVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.18,
    },
  },
}

const heroItemVariants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
  },
}

const stepsContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.14,
    },
  },
}

const stepItemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
  },
}

// ─── Nav ──────────────────────────────────────────────────────────────────
function Nav({ onAuditClick }: { onAuditClick: () => void }) {
  const [open, setOpen] = useState(false)
  const links = [
    { label: "Services", href: "#solution" },
    { label: "How It Works", href: "#how" },
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-brand-eucalyptus/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 no-underline">
          <PastoralLogo
            className="h-8 w-auto"
            serverFill="#FDFDFB"
            rustFill="#c8845a"
            greenFill="#6ab88a"
          />
          <span className="font-[family-name:var(--font-dm-serif)] text-lg text-white tracking-wide">
            PastoralStack
          </span>
        </a>

        {/* Desktop links + CTA */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-white/60 transition-colors hover:text-white no-underline"
            >
              {l.label}
            </a>
          ))}
          <Button
              size="sm"
              className="bg-brand-rust text-white hover:bg-brand-rust/85 border-transparent rounded-sm px-5"
              onClick={onAuditClick}
            >
              Get Free Review
            </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <XIcon size={20} /> : <MenuIcon size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-brand-eucalyptus px-6 pb-6 pt-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-white/70 no-underline"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <Button
                className="w-full bg-brand-rust text-white hover:bg-brand-rust/85 border-transparent rounded-sm"
                onClick={() => { setOpen(false); onAuditClick() }}
              >
                Get Free Review
              </Button>
          </nav>
        </div>
      )}
    </header>
  )
}

// ─── Section wrapper helpers ───────────────────────────────────────────────
function SectionLabel({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span className="font-mono text-xs tracking-[0.2em] opacity-40">{num}</span>
      <div className="h-px w-8 bg-current opacity-20" />
      <span className="text-xs font-semibold uppercase tracking-[0.18em] opacity-50">{label}</span>
    </div>
  )
}

function CheckLine({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <CheckIcon size={15} className="mt-0.5 shrink-0 text-current opacity-70" />
      <span>{children}</span>
    </li>
  )
}

function CrossLine({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <XIcon size={14} className="mt-0.5 shrink-0 text-brand-rust" />
      <span className="text-brand-charcoal/70">{children}</span>
    </li>
  )
}

function BulletLine({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 pl-0">
      <div className="mt-2 size-1.5 shrink-0 rounded-full bg-current opacity-40" />
      <span>{children}</span>
    </li>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const prefersReducedMotion = useReducedMotion()
  const [isDesktop, setIsDesktop] = useState(false)
  const [auditOpen, setAuditOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const heroRingY = useTransform(scrollYProgress, [0, 0.28], [0, -80])
  const heroTextY = useTransform(scrollYProgress, [0, 0.28], [0, -38])
  const heroModelY = useTransform(scrollYProgress, [0, 0.28], [0, 56])
  const ctaRingY = useTransform(scrollYProgress, [0.55, 1], [0, -52])

  useEffect(() => {
    const revealElements = Array.from(document.querySelectorAll<HTMLElement>(".reveal"))
    const shouldReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (shouldReduceMotion) {
      revealElements.forEach((element) => element.classList.add("is-visible"))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return
          }
          entry.target.classList.add("is-visible")
          observer.unobserve(entry.target)
        })
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -12% 0px",
      }
    )

    revealElements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)")
    const onChange = () => setIsDesktop(media.matches)
    onChange()
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  return (
    <div className="bg-brand-white text-brand-charcoal">
      <AuditForm open={auditOpen} onOpenChange={setAuditOpen} />
      <Nav onAuditClick={() => setAuditOpen(true)} />

      {/* ── 00 HERO ──────────────────────────────────────────── */}
      <section className="relative min-h-screen overflow-hidden bg-brand-eucalyptus pt-24 pb-20 flex items-center">
        {/* Topographic ring decoration */}
        <motion.div
          className="pointer-events-none absolute right-[-10%] top-1/2 -translate-y-1/2 opacity-80"
          style={isDesktop ? { y: heroRingY } : undefined}
        >
          <TopoRings className="w-[700px] lg:w-[800px] animate-orbit-slow" />
        </motion.div>

        {/* Grain overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />

        <div className="relative mx-auto w-full max-w-6xl px-6 sm:px-10">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <motion.div
              className="max-w-3xl reveal is-visible"
              variants={heroTimelineVariants}
              initial={prefersReducedMotion ? false : "hidden"}
              animate="show"
              style={isDesktop ? { y: heroTextY } : undefined}
            >
              <motion.div variants={heroItemVariants} className="mb-8 flex items-center gap-3">
                <div className="h-px w-12 bg-brand-rust" />
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">
                  Australian Agricultural Operations
                </span>
              </motion.div>

              <motion.h1
                variants={heroItemVariants}
                className="font-[family-name:var(--font-dm-serif)] italic text-white leading-[1.08] tracking-[-0.01em]"
                style={{ fontSize: "clamp(2.6rem, 6vw, 5rem)" }}
              >
                Digital Infrastructure<br />
                for Pastoral &amp;<br />
                Agricultural Operations
              </motion.h1>

              <motion.p variants={heroItemVariants} className="mt-7 max-w-xl text-lg leading-relaxed text-white/65">
                We build reliable, scalable systems for stations, agribusinesses,
                and land management organisations.
              </motion.p>

              <motion.div variants={heroItemVariants} className="mt-10 flex flex-wrap gap-3">
                <Button
                    size="lg"
                    className="bg-brand-rust text-white hover:bg-brand-rust/85 border-transparent rounded-sm px-8 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                    onClick={() => setAuditOpen(true)}
                  >
                    Get a Free System Audit
                    <ArrowRightIcon size={15} className="ml-1" />
                  </Button>
                <a href="#how">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-white/80 hover:text-white hover:bg-white/10 rounded-sm px-8 text-sm transition-transform hover:-translate-y-0.5"
                  >
                    See How It Works
                  </Button>
                </a>
              </motion.div>
            </motion.div>

            <motion.div
              className="hidden lg:block"
              initial={prefersReducedMotion ? false : { opacity: 0, x: 24 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={isDesktop ? { y: heroModelY } : undefined}
            >
              <HeroTerrainModel className="reveal is-visible" />
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-6 sm:left-10 flex items-center gap-2 text-white/25">
            <div className="h-8 w-px bg-white/20" />
            <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
          </div>
        </div>
      </section>

      {/* ── 01 PROBLEM ───────────────────────────────────────── */}
      <section id="problem" className="relative bg-brand-white py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 reveal reveal-delay-1">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
            <div>
              <SectionLabel num="01" label="The Problem" />
              <h2 className="font-[family-name:var(--font-dm-serif)] leading-tight text-brand-charcoal" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                Most agricultural operations are held back by their systems
              </h2>
            </div>

            <div>
              <ul className="mt-0 space-y-5 text-sm leading-relaxed text-brand-charcoal/75 lg:mt-14">
                {[
                  "Outdated websites that don't reflect the scale of your operations",
                  "Disconnected tools across reporting, communication, and data",
                  "Manual processes that slow down day-to-day work",
                  "Systems that weren't built to scale with your business",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-4 border-l-2 border-brand-rust/30 pl-4">
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-8 border-t border-brand-charcoal/10 pt-6 text-sm text-brand-charcoal/50 leading-relaxed">
                Over time, this creates inefficiency, missed opportunities, and unnecessary overhead.
              </p>
            </div>
          </div>
        </div>

        {/* Large background watermark */}
        <span
          aria-hidden
          className="pointer-events-none select-none absolute right-0 bottom-0 font-bold text-[18vw] leading-none text-brand-charcoal/[0.025] translate-y-[15%]"
        >
          01
        </span>
      </section>

      {/* ── 02 SOLUTION ──────────────────────────────────────── */}
      <section id="solution" className="relative bg-brand-charcoal py-24 sm:py-32 overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 reveal reveal-delay-1">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
            <div>
              <SectionLabel num="02" label="What We Do" />
              <h2
                className="font-[family-name:var(--font-dm-serif)] leading-tight text-white"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
              >
                We build systems that match the scale of your operation
              </h2>
            </div>

            <div className="lg:mt-14 space-y-6 text-white/70 text-sm leading-relaxed">
              <p>
                PastoralStack focuses on building practical, long-term digital infrastructure
                for land-based businesses.
              </p>
              <p>
                We don&apos;t just redesign websites — we improve how your systems work.
              </p>
              <p className="text-white/50 text-xs uppercase tracking-widest font-semibold pt-2">Our work includes</p>
              <ul className="space-y-3">
                {[
                  "High-performance web platforms",
                  "Backend systems and integrations",
                  "Content and data management",
                  "Streamlined workflows and automation",
                ].map((item) => (
                  <CheckLine key={item}>{item}</CheckLine>
                ))}
              </ul>
              <p className="pt-4 border-t border-white/10 text-white/50">
                The goal is simple: make your systems faster, clearer, and easier to manage.
              </p>
            </div>
          </div>
        </div>

        <span
          aria-hidden
          className="pointer-events-none select-none absolute right-0 bottom-0 font-bold text-[18vw] leading-none text-white/[0.025] translate-y-[15%]"
        >
          02
        </span>
      </section>

      {/* ── 03 OFFER ─────────────────────────────────────────── */}
      <section id="offer" className="bg-brand-white py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <div className="rounded-none border border-brand-charcoal/10 bg-brand-eucalyptus/[0.04] p-10 sm:p-16 lg:p-20 relative overflow-hidden reveal">
            {/* Rust accent bar */}
            <div className="absolute top-0 left-0 w-1 h-full bg-brand-rust" />

            <SectionLabel num="03" label="The Offer" />

            <h2
              className="font-[family-name:var(--font-dm-serif)] text-brand-charcoal leading-tight max-w-xl"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              Start with a Free System Review
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-relaxed text-brand-charcoal/65">
              We&apos;ll take a look at your current setup and provide a clear breakdown of:
            </p>

            <ul className="mt-6 space-y-3 text-sm text-brand-charcoal/70">
              {[
                "Where your system is slowing you down",
                "What can be improved immediately",
                "What needs to scale as your operation grows",
              ].map((item) => (
                <CheckLine key={item}>{item}</CheckLine>
              ))}
            </ul>

            <p className="mt-8 text-sm text-brand-charcoal/50 italic">
              No jargon. No pressure. Just a practical review you can use.
            </p>

            <motion.div
              className="mt-10 inline-flex"
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      scale: [1, 1.04, 1],
                    }
              }
              transition={{ duration: 1.2, times: [0, 0.4, 1], repeat: Infinity, repeatDelay: 4.2 }}
            >
              <Button
                size="lg"
                className="bg-brand-rust text-white hover:bg-brand-rust/85 border-transparent rounded-sm px-10 text-sm font-semibold"
              >
                Request Free Review
                <ArrowRightIcon size={15} className="ml-1.5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 04 HOW IT WORKS ──────────────────────────────────── */}
      <section id="how" className="relative bg-brand-charcoal py-24 sm:py-32 overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 reveal reveal-delay-1">
          <SectionLabel num="04" label="How It Works" />

          <h2
            className="font-[family-name:var(--font-dm-serif)] text-white leading-tight max-w-md"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Three steps, no complications
          </h2>

          <motion.div
            className="mt-16 grid gap-0 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10"
            variants={stepsContainerVariants}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, amount: 0.32 }}
          >
            {[
              {
                step: "01",
                title: "Review",
                desc: "We assess your current website and systems — what's working, what isn't, and where the gaps are.",
              },
              {
                step: "02",
                title: "System Plan",
                desc: "We outline a clear, practical upgrade path. No vague recommendations — just concrete next steps.",
              },
              {
                step: "03",
                title: "Build",
                desc: "We implement and optimise for long-term use. Built to last, not to be replaced in 12 months.",
              },
            ].map(({ step, title, desc }) => (
              <motion.div key={step} className="pt-10 sm:pt-0 sm:px-10 first:pl-0 last:pr-0" variants={stepItemVariants}>
                <div
                  className="font-[family-name:var(--font-dm-serif)] italic leading-none text-white/15 select-none"
                  style={{ fontSize: "clamp(4rem, 8vw, 7rem)" }}
                >
                  {step}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white tracking-tight">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <span
          aria-hidden
          className="pointer-events-none select-none absolute right-0 bottom-0 font-bold text-[18vw] leading-none text-white/[0.025] translate-y-[15%]"
        >
          04
        </span>
      </section>

      {/* ── 05 WHO THIS IS FOR ────────────────────────────────── */}
      <section id="who" className="bg-brand-white py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 reveal">
          <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:gap-24">
            <div>
              <SectionLabel num="05" label="Who This Is For" />
              <h2
                className="font-[family-name:var(--font-dm-serif)] text-brand-charcoal leading-tight"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
              >
                Built for land-based businesses
              </h2>
              <p className="mt-5 text-sm text-brand-charcoal/55 leading-relaxed max-w-sm">
                If you manage land, produce, or a regional operation — and your systems
                aren&apos;t keeping up — this is for you.
              </p>
            </div>

            <div className="flex flex-col justify-center">
              <ul className="space-y-4">
                {[
                  "Pastoral companies and stations",
                  "Agricultural businesses",
                  "Land management organisations",
                  "Agri-tech platforms",
                  "Regional operations scaling digitally",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-4">
                    <div className="h-px w-6 shrink-0 bg-brand-rust" />
                    <span className="text-sm font-medium text-brand-charcoal/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 06 WHY PASTORALSTACK ─────────────────────────────── */}
      <section id="why" className="relative bg-brand-eucalyptus py-24 sm:py-32 overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 reveal reveal-delay-1">
          <SectionLabel num="06" label="Why PastoralStack" />

          <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:gap-24">
            <div>
              <h2
                className="font-[family-name:var(--font-dm-serif)] text-white leading-tight"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
              >
                We focus on clarity, reliability, and long-term use
              </h2>
            </div>

            <div className="lg:mt-2 space-y-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/35 mb-4">
                  Not what we do
                </p>
                <ul className="space-y-3">
                  {[
                    "No overcomplicated systems",
                    "No unnecessary tools",
                    "No short-term fixes",
                  ].map((item) => (
                    <CrossLine key={item}>
                      <span className="text-white/50">{item.replace("No ", "")}</span>
                    </CrossLine>
                  ))}
                </ul>
              </div>

              <div className="border-t border-white/10 pt-8">
                <p className="text-white/80 text-sm leading-relaxed">
                  Just well-built infrastructure that works — and keeps working as your
                  operation grows.
                </p>
              </div>
            </div>
          </div>
        </div>

        <span
          aria-hidden
          className="pointer-events-none select-none absolute right-0 bottom-0 font-bold text-[18vw] leading-none text-white/[0.03] translate-y-[15%]"
        >
          06
        </span>
      </section>

      {/* ── 07 ABOUT ─────────────────────────────────────────── */}
      <section id="about" className="bg-brand-white py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 reveal">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
            <div>
              <SectionLabel num="07" label="About" />
              <h2
                className="font-[family-name:var(--font-dm-serif)] text-brand-charcoal leading-tight"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
              >
                Built by someone who understands both sides
              </h2>
            </div>

            <div className="lg:mt-14 space-y-5 text-sm leading-relaxed text-brand-charcoal/65">
              <p>
                PastoralStack is built by a digital architect working with modern web
                systems and real-world agricultural platforms.
              </p>
              <p>We understand both:</p>
              <ul className="space-y-2 pl-4">
                <BulletLine>
                  The technical side — systems, performance, scalability
                </BulletLine>
                <BulletLine>
                  The operational side — clarity, efficiency, reliability
                </BulletLine>
              </ul>
              <p className="pt-2 text-brand-charcoal/45 text-xs">
                We work with a small number of clients at a time — so you get genuine
                attention, not a template job.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 08 WORK ──────────────────────────────────────────── */}
      <section id="work" className="bg-brand-white py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 reveal">
          <SectionLabel num="08" label="Previous Work" />

          <h2
            className="font-[family-name:var(--font-dm-serif)] text-brand-charcoal leading-tight max-w-xl"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Land management platforms, built end-to-end
          </h2>

          <p className="mt-4 max-w-lg text-sm text-brand-charcoal/55 leading-relaxed">
            Before PastoralStack, we built and shipped production-grade platforms for
            land-based organisations internationally. This is a real client project.
          </p>

          {/* Case study card */}
          <div className="mt-14 grid gap-0 lg:grid-cols-[1.15fr_1fr] border border-brand-charcoal/10 overflow-hidden">
            {/* Browser chrome mock + UI illustration */}
            <div className="relative bg-brand-eucalyptus/10 overflow-hidden min-h-[260px] lg:min-h-0">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-brand-charcoal/8 bg-brand-charcoal/[0.04]">
                <div className="size-2.5 rounded-full bg-brand-charcoal/15" />
                <div className="size-2.5 rounded-full bg-brand-charcoal/15" />
                <div className="size-2.5 rounded-full bg-brand-charcoal/15" />
                <div className="ml-3 flex-1 rounded-sm bg-brand-charcoal/8 h-4 max-w-[200px]" />
              </div>
              <div className="p-5 grid grid-cols-3 gap-3">
                <div className="col-span-3 h-8 rounded-sm bg-brand-eucalyptus/25 flex items-center gap-2 px-3">
                  <div className="size-4 rounded-sm bg-brand-eucalyptus/60" />
                  <div className="w-16 h-2 rounded-full bg-brand-charcoal/12" />
                  <div className="ml-auto flex gap-2">
                    <div className="w-10 h-2 rounded-full bg-brand-charcoal/10" />
                    <div className="w-10 h-2 rounded-full bg-brand-charcoal/10" />
                    <div className="w-14 h-5 rounded-sm bg-brand-rust/35" />
                  </div>
                </div>
                <div className="col-span-2 h-28 rounded-sm bg-brand-eucalyptus/20 p-3 flex flex-col justify-end gap-1.5">
                  <div className="w-3/4 h-2.5 rounded-full bg-brand-eucalyptus/60" />
                  <div className="w-1/2 h-2 rounded-full bg-brand-charcoal/20" />
                  <div className="w-1/3 h-2 rounded-full bg-brand-charcoal/15 mt-1" />
                </div>
                <div className="h-28 rounded-sm bg-brand-charcoal/8 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-sm bg-brand-rust/25" />
                </div>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-20 rounded-sm bg-brand-charcoal/5 p-2.5 flex flex-col gap-1.5">
                    <div className="w-full h-2 rounded-full bg-brand-charcoal/12" />
                    <div className="w-4/5 h-2 rounded-full bg-brand-charcoal/8" />
                    <div className="w-3/5 h-2 rounded-full bg-brand-charcoal/6 mt-auto" />
                  </div>
                ))}
              </div>
            </div>

            {/* Details panel */}
            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12 border-t lg:border-t-0 lg:border-l border-brand-charcoal/8">
              <div className="mb-5 inline-flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-rust" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-charcoal/40">
                  Real Project Case Study
                </span>
              </div>

              <h3
                className="font-[family-name:var(--font-dm-serif)] text-brand-charcoal leading-tight"
                style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
              >
                Land Management &amp; Services Platform
              </h3>

              <p className="mt-3 text-xs text-brand-charcoal/45 uppercase tracking-wide">
                Texas AgriForestry — Small Farmers, Ranchers &amp; Landowners
              </p>

              <p className="mt-5 text-sm leading-relaxed text-brand-charcoal/60">
                A full-stack platform for small farmers and landowners — member
                onboarding, multi-step land stewardship plan workflows, payments, admin
                tooling, and automated email pipelines. Delivered end-to-end and
                currently live in production.
              </p>

              <ul className="mt-6 space-y-2.5 text-sm text-brand-charcoal/65">
                {[
                  "Member portal — auth, profiles & plan tracking",
                  "Multi-step land management plan workflow",
                  "Stripe payments & donation flows",
                  "Admin dashboard — users, plans, subscribers",
                  "Automated newsletter & email pipelines",
                ].map((item) => (
                  <CheckLine key={item}>{item}</CheckLine>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-brand-charcoal/8">
                <p className="text-xs text-brand-charcoal/35 mb-3 uppercase tracking-widest">Stack</p>
                <div className="flex flex-wrap gap-2">
                  {["Next.js", "AdonisJS", "PostgreSQL", "Stripe", "Contentful", "React Email"].map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 text-xs rounded-sm bg-brand-charcoal/[0.06] text-brand-charcoal/55 font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 09 FINAL CTA ─────────────────────────────────────── */}
      <section id="cta" className="relative bg-brand-charcoal py-28 sm:py-36 overflow-hidden">
        <motion.div
          className="pointer-events-none absolute right-[-15%] top-1/2 -translate-y-1/2 opacity-40"
          style={isDesktop ? { y: ctaRingY } : undefined}
        >
          <TopoRings className="w-[600px] animate-orbit-reverse" />
        </motion.div>

        <div className="relative mx-auto max-w-6xl px-6 sm:px-10 text-center reveal">
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 flex justify-center">
              <div className="h-px w-12 bg-brand-rust" />
            </div>

            <h2
              className="font-[family-name:var(--font-dm-serif)] italic text-white leading-tight"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
            >
              Let&apos;s take a look at your system
            </h2>

            <p className="mt-5 text-white/55 text-base leading-relaxed">
              Start with a free review and get a clear understanding of where you stand.
            </p>

            <motion.div
              className="mt-10 inline-flex"
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      scale: [1, 1.05, 1],
                    }
              }
              transition={{ duration: 1.15, times: [0, 0.38, 1], repeat: Infinity, repeatDelay: 2.8 }}
            >
              <Button
                size="lg"
                className="bg-brand-rust text-white hover:bg-brand-rust/85 border-transparent rounded-sm px-12 text-sm font-semibold"
                onClick={() => setAuditOpen(true)}
              >
                Get Free Review
                <ArrowRightIcon size={15} className="ml-1.5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="bg-brand-charcoal border-t border-white/8 px-6 py-8 sm:px-10">
        <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <PastoralLogo
              className="h-6 w-auto"
              serverFill="rgba(253,253,251,0.45)"
              rustFill="rgba(192,112,56,0.6)"
              greenFill="rgba(74,158,110,0.5)"
            />
            <span className="font-[family-name:var(--font-dm-serif)] text-sm text-white/40">
              PastoralStack
            </span>
          </div>
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} PastoralStack. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
