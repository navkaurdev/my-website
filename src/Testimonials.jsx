import { motion } from "framer-motion";

/**
 * Testimonials — social proof on a light field.
 */

const RED = "#ff2a2a";

const REVIEWS = [
  {
    quote:
      "Navjot rebuilt our Shopify store and ran our ads — orders doubled in the first month. Finally one person who owns the whole result.",
    name: "Aarav Mehta",
    role: "Founder, Urban Threads",
  },
  {
    quote:
      "Our Google Ads were bleeding money. Within weeks we hit a 4× return. Clear reporting, zero jargon, real growth.",
    name: "Sophie Laurent",
    role: "Owner, Maison Home",
  },
  {
    quote:
      "We now rank on page one and even show up in ChatGPT answers. Leads come in on autopilot. Wish we'd started sooner.",
    name: "Daniel Okafor",
    role: "Director, BrightSmile Clinic",
  },
];

function Stars() {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-4 w-4" fill={RED}>
          <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="w-full bg-white px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <span className="inline-block rounded-full border border-black/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-black/60">
            Loved by founders
          </span>
          <h2 className="mt-6 text-4xl font-black tracking-tight text-black sm:text-5xl md:text-6xl">
            Brands that grew with{" "}
            <span style={{ color: RED }}>Navjot</span>.
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <motion.figure
              key={r.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col rounded-3xl border border-black/5 bg-neutral-50 p-8 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.3)]"
            >
              <Stars />
              <blockquote className="mt-5 flex-1 text-lg leading-relaxed text-neutral-800">
                "{r.quote}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-4">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: RED }}
                >
                  {r.name.split(" ").map((w) => w[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-bold text-black">{r.name}</p>
                  <p className="text-xs text-neutral-500">{r.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
