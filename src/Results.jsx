import { motion } from "framer-motion";
import CountUp from "./CountUp.jsx";

/**
 * Results — proof band (metrics) + short case studies, on a dark field.
 */

const RED = "#ff2a2a";

const METRICS = [
  { value: 312, suffix: "%", label: "Avg. organic traffic lift" },
  { value: 4.2, suffix: "×", label: "Average ad ROAS" },
  { value: 50, suffix: "+", label: "Shopify stores shipped" },
  { value: 1.8, prefix: "$", suffix: "M+", label: "Revenue influenced" },
];

const CASES = [
  {
    tag: "Fashion · Shopify",
    title: "From stalled to scaling",
    result: "+218% revenue in 90 days",
    desc: "Rebuilt the store for speed, fixed SEO foundations and launched Meta + Google — tripled monthly orders.",
  },
  {
    tag: "Home & Living",
    title: "Ads that finally paid back",
    result: "4.6× blended ROAS",
    desc: "Restructured wasted ad spend into profitable Search & PMax campaigns with new creative angles.",
  },
  {
    tag: "Local → Online",
    title: "Found on Google & AI",
    result: "#1 for 40+ keywords",
    desc: "Local SEO + AEO got a brick-and-mortar brand ranking and cited in AI answers within one quarter.",
  },
];

export default function Results() {
  return (
    <section id="results" className="w-full bg-[#111111] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Metrics */}
        <div className="grid grid-cols-2 gap-8 border-b border-white/10 pb-16 md:grid-cols-4">
          {METRICS.map((m) => (
            <div key={m.label}>
              <p className="text-4xl font-black text-white md:text-5xl">
                <CountUp value={m.value} prefix={m.prefix || ""} suffix={m.suffix} />
              </p>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-white/50">
                {m.label}
              </p>
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="mt-16 max-w-2xl">
          <span className="inline-block rounded-full border border-white/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60">
            Proof, not promises
          </span>
          <h2 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Recent <span style={{ color: RED }}>wins</span>.
          </h2>
        </div>

        {/* Case studies */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {CASES.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-8"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                {c.tag}
              </span>
              <h3 className="mt-4 text-2xl font-bold text-white">{c.title}</h3>
              <p className="mt-4 text-3xl font-black" style={{ color: RED }}>
                {c.result}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/55">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
