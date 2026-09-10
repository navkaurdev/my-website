import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Process
 * -------
 * "How We Work" timeline on a light gridded field.
 *   - A giant dashed S-curve drawn with SVG, revealed as you scroll
 *     (Framer Motion pathLength bound to scroll progress).
 *   - Four tag/luggage-label cards alternating left/right along the curve.
 *   - Each card activates (white → bright red, red glow) when it scrolls
 *     into view, so the timeline "lights up" step by step.
 *   - Desktop: alternating magazine layout. Mobile: stacked, center line.
 */

const RED = "#ff2a2a";

const STEPS = [
  {
    n: "01",
    title: "Define",
    side: "right",
    rotate: 3,
    desc: "We dig into your goals, users and constraints — turning a fuzzy idea into a sharp, prioritised plan.",
  },
  {
    n: "02",
    title: "Design",
    side: "left",
    rotate: -3,
    desc: "Wireframes to pixel-perfect UI. We craft interfaces that feel effortless and on-brand.",
  },
  {
    n: "03",
    title: "Build",
    side: "right",
    rotate: 2.5,
    desc: "A fast, conversion-focused Shopify store plus the SEO and tracking foundations to grow on.",
  },
  {
    n: "04",
    title: "Launch & Grow",
    side: "left",
    rotate: -2.5,
    desc: "Go live, then scale with paid ads, SEO/AEO and CRO — measured, reported and iterated monthly.",
  },
];

function SketchArrow({ className }) {
  return (
    <svg viewBox="0 0 120 90" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 12c22 6 40 20 46 40 3 10 2 20-2 30M50 82c-6-6-10-14-12-22M50 82c8-3 15-6 22-7"
        stroke="#0a0a0a"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StepCard({ step }) {
  const [active, setActive] = useState(false);
  const fromLeft = step.side === "left";

  return (
    <div
      className={`flex ${
        fromLeft ? "lg:justify-start" : "lg:justify-end"
      } justify-center`}
    >
      <motion.div
        initial={{ opacity: 0, x: fromLeft ? -80 : 80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        onViewportEnter={() => setActive(true)}
        transition={{ type: "spring", stiffness: 60, damping: 16 }}
        whileHover={{ scale: 1.04 }}
        style={{
          rotate: step.rotate,
          backgroundColor: active ? RED : "#ffffff",
          boxShadow: active
            ? "0 30px 60px -15px rgba(255,42,42,0.55)"
            : "0 25px 50px -20px rgba(0,0,0,0.25)",
        }}
        className="relative w-full max-w-sm rounded-[2rem] p-8 pt-10 ring-1 ring-black/5 transition-colors duration-500"
      >
        {/* Hole punch */}
        <span
          className="absolute left-1/2 top-4 h-3 w-14 -translate-x-1/2 rounded-full"
          style={{ backgroundColor: active ? "rgba(0,0,0,0.25)" : "#e5e5e5" }}
        />

        <div className="flex items-start justify-between">
          <span
            className="font-serif text-5xl italic leading-none transition-colors duration-500"
            style={{ color: active ? "rgba(0,0,0,0.85)" : RED }}
          >
            {step.n}
          </span>
          <span
            className="mt-2 h-3 w-3 rounded-full transition-colors duration-500"
            style={{ backgroundColor: active ? "#ffffff" : "#0a0a0a" }}
          />
        </div>

        <h3
          className="mt-6 text-3xl font-black tracking-tight transition-colors duration-500"
          style={{ color: active ? "#ffffff" : "#0a0a0a" }}
        >
          {step.title}
        </h3>
        <p
          className="mt-3 text-sm leading-relaxed transition-colors duration-500"
          style={{ color: active ? "rgba(255,255,255,0.85)" : "#525252" }}
        >
          {step.desc}
        </p>
      </motion.div>
    </div>
  );
}

export default function Process() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="skills"
      className="relative w-full overflow-hidden bg-white py-24 md:py-32"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(0,0,0,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.045) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    >
      {/* Header */}
      <div className="mx-auto max-w-3xl px-6 text-center">
        <span className="inline-block rounded-full border border-black/10 bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-black/70 shadow-sm">
          How we work
        </span>

        <div className="relative mt-8">
          <h2 className="text-4xl font-black leading-[1.05] tracking-tight text-black sm:text-5xl md:text-6xl">
            Let us show you how we drive your brand to new heights
          </h2>
          <SketchArrow className="absolute -right-2 -top-10 hidden h-20 w-24 rotate-12 md:block lg:-right-16" />
        </div>

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-neutral-500 md:text-lg">
          A clear, four-step process that turns ambitious ideas into fast,
          scalable products — no guesswork, no surprises.
        </p>
      </div>

      {/* Timeline */}
      <div ref={ref} className="relative mx-auto mt-24 max-w-6xl px-6">
        {/* Curved dashed path (desktop) */}
        <svg
          className="pointer-events-none absolute left-0 top-0 hidden h-full w-full lg:block"
          viewBox="0 0 1000 1600"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <motion.path
            d="M500 0 C820 220 180 420 500 640 C820 860 180 1060 500 1280 C700 1420 560 1520 500 1600"
            fill="none"
            stroke="#0a0a0a"
            strokeWidth="3"
            strokeDasharray="10 14"
            style={{ pathLength }}
          />
        </svg>

        {/* Center dashed line (mobile) */}
        <svg
          className="pointer-events-none absolute left-1/2 top-0 h-full w-2 -translate-x-1/2 lg:hidden"
          viewBox="0 0 4 1600"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <motion.path
            d="M2 0 L2 1600"
            fill="none"
            stroke="#0a0a0a"
            strokeWidth="3"
            strokeDasharray="10 14"
            style={{ pathLength }}
          />
        </svg>

        {/* Cards */}
        <div className="relative grid grid-cols-1 gap-24 lg:gap-40">
          {STEPS.map((step) => (
            <StepCard key={step.n} step={step} />
          ))}
        </div>
      </div>

      {/* Bottom handwritten note */}
      <div className="mt-24 text-center">
        <p
          className="inline-block -rotate-3 font-serif text-2xl italic text-black/80 md:text-3xl"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Ready to be delivered!
        </p>
      </div>
    </section>
  );
}
