import { motion } from "framer-motion";

/**
 * Services — the core offer, on a dark field.
 * Six cards: Shopify build + the growth channels. Hover lifts with a red edge.
 */

const RED = "#ff2a2a";

const Icon = ({ d }) => (
  <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);

const SERVICES = [
  {
    title: "Shopify Development",
    desc: "High-converting, lightning-fast stores - custom themes, migrations, apps and CRO baked in.",
    icon: <Icon d={<><path d="M6 2 3 6v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V6l-3-4Z" /><path d="M3 6h18M16 10a4 4 0 0 1-8 0" /></>} />,
  },
  {
    title: "SEO",
    desc: "Rank for what your buyers search. Technical, on-page and content SEO that compounds over time.",
    icon: <Icon d={<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>} />,
  },
  {
    title: "AEO",
    desc: "Answer Engine Optimization - get cited by ChatGPT, Google AI Overviews and voice search.",
    icon: <Icon d={<><path d="M12 3a9 9 0 1 0 9 9" /><path d="M12 7v5l3 2" /><path d="M16 3h5v5" /></>} />,
  },
  {
    title: "Google Ads",
    desc: "Search, Shopping & PMax campaigns engineered for profitable ROAS, not vanity clicks.",
    icon: <Icon d={<><path d="M3 3v18h18" /><path d="m7 14 3-4 3 3 5-7" /></>} />,
  },
  {
    title: "Social Media Ads",
    desc: "Scroll-stopping Meta, Instagram & TikTok ads with creative that converts cold traffic.",
    icon: <Icon d={<><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r="1" /></>} />,
  },
  {
    title: "Lead Generation",
    desc: "Full funnels - landing pages, offers, email & SMS flows that turn visitors into customers.",
    icon: <Icon d={<><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></>} />,
  },
];

export default function Services() {
  return (
    <section id="services" className="w-full bg-[#0a0a0a] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <span className="inline-block rounded-full border border-white/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60">
            What I do
          </span>
          <h2 className="mt-6 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            One partner for your{" "}
            <span style={{ color: RED }}>store</span> and your{" "}
            <span style={{ color: RED }}>growth</span>.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/60">
            Most brands juggle a developer and a marketer who never talk. I do
            both - so your store and your traffic pull in the same direction.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-colors duration-500 hover:border-[#ff2a2a]/60"
            >
              <div
                className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white transition-colors duration-500 group-hover:text-white"
                style={{ backgroundColor: "rgba(255,42,42,0.12)" }}
              >
                <span className="text-[#ff2a2a] transition-colors duration-500 group-hover:text-[#ff2a2a]">
                  {s.icon}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{s.desc}</p>

              <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/40 transition-all duration-300 group-hover:gap-3 group-hover:text-[#ff2a2a]">
                Learn more →
              </span>

              {/* Corner glow */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#ff2a2a]/0 blur-2xl transition-all duration-500 group-hover:bg-[#ff2a2a]/30" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
