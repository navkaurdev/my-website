import { motion } from "framer-motion";

/**
 * Projects — "Selected Work" showcase.
 * Large image cards with category, result metric and a hover reveal.
 * Replace the placeholder images/data with real store screenshots + results.
 */

const RED = "#ff2a2a";

const PROJECTS = [
  {
    title: "Urban Threads",
    category: "Shopify · Fashion",
    result: "+218% revenue",
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Maison Home",
    category: "Shopify · Home & Living",
    result: "4.6× ROAS",
    img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "BrightSmile Clinic",
    category: "Local SEO · Healthcare",
    result: "#1 for 40+ keywords",
    img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Peak Supplements",
    category: "Shopify · Health",
    result: "3.1× conversion rate",
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="w-full bg-[#0a0a0a] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full border border-white/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60">
              Selected work
            </span>
            <h2 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
              Stores I've built &{" "}
              <span style={{ color: RED }}>grown</span>.
            </h2>
          </div>
          <a
            href="#audit"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-[#ff2a2a] hover:gap-3"
          >
            Start your project →
          </a>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {PROJECTS.map((p, i) => (
            <motion.a
              key={p.title}
              href="#audit"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: (i % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-neutral-900"
            >
              {/* Image */}
              <div className="relative aspect-[16/11] overflow-hidden bg-neutral-800">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Result badge */}
                <span
                  className="absolute right-4 top-4 rounded-full px-4 py-1.5 text-xs font-bold text-white shadow-lg"
                  style={{ backgroundColor: RED }}
                >
                  {p.result}
                </span>
              </div>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 w-full p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
                  {p.category}
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">{p.title}</h3>
                  <span className="translate-x-2 text-xl text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    →
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
