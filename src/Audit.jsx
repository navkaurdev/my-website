import { useState } from "react";
import { motion } from "framer-motion";

/**
 * Audit — the lead magnet band (bright red, decorated).
 * A clean white form card sits on a red field with concentric-ring texture.
 * No backend yet: on submit it shows a success state. Wire the TODO to
 * Formspree / an API route to actually receive leads.
 */

const RED = "#ff2a2a";

const BENEFITS = [
  { t: "Speed & conversion review", d: "Where your store leaks sales" },
  { t: "SEO / AEO opportunities", d: "Rank on Google & AI answers" },
  { t: "Ad & funnel quick wins", d: "Stop wasting ad spend" },
];

export default function Audit() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: POST to your form endpoint (Formspree / API route) here.
    setSent(true);
  };

  return (
    <section id="audit" className="relative w-full overflow-hidden bg-[#ff2a2a] px-6 py-24 md:px-10 md:py-32">
      {/* Decorative concentric rings */}
      <div
        className="pointer-events-none absolute -left-40 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full opacity-[0.12]"
        style={{ background: "radial-gradient(circle, transparent 58%, #000 59%, transparent 60%, transparent 68%, #000 69%, transparent 70%, transparent 78%, #000 79%, transparent 80%)" }}
      />
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-black/5 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 lg:grid-cols-2">
        {/* Left copy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-black/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-black">
            <span className="h-1.5 w-1.5 rounded-full bg-black" /> Free · 24-hour turnaround
          </span>

          <h2 className="mt-6 text-4xl font-black leading-[1.03] tracking-tight text-black sm:text-5xl md:text-6xl">
            Get your free
            <br />
            store growth audit
          </h2>

          <p className="mt-5 max-w-md text-lg leading-relaxed text-black/70">
            Send me your store and I'll record a short teardown with 3 specific,
            high-impact fixes — no cost, no obligation.
          </p>

          <ul className="mt-8 space-y-4">
            {BENEFITS.map((b) => (
              <li key={b.t} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-sm text-white">
                  ✓
                </span>
                <span>
                  <span className="block font-bold text-black">{b.t}</span>
                  <span className="block text-sm text-black/60">{b.d}</span>
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[2rem] bg-white p-8 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.5)] md:p-10"
        >
          {sent ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 12 }}
                className="flex h-16 w-16 items-center justify-center rounded-full text-3xl text-white"
                style={{ backgroundColor: RED }}
              >
                ✓
              </motion.div>
              <h3 className="mt-6 text-2xl font-black text-black">Request received!</h3>
              <p className="mt-2 text-neutral-500">
                I'll review your store and reply within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="text-xl font-black text-black">
                Claim your free audit
              </h3>
              {[
                { label: "Name", type: "text", ph: "Your name" },
                { label: "Email", type: "email", ph: "you@email.com" },
                { label: "Store / Website URL", type: "url", ph: "https://yourstore.com" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">
                    {f.label}
                  </label>
                  <input
                    required
                    type={f.type}
                    placeholder={f.ph}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-black placeholder-neutral-400 outline-none transition-all focus:border-[#ff2a2a] focus:bg-white focus:ring-2 focus:ring-[#ff2a2a]/20"
                  />
                </div>
              ))}
              <button
                type="submit"
                className="w-full rounded-full bg-[#ff2a2a] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_30px_-5px_rgba(255,42,42,0.6)]"
              >
                Get my free audit →
              </button>
              <p className="flex items-center justify-center gap-2 text-center text-xs text-neutral-400">
                🔒 No spam. Your details stay private.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
