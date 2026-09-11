import { motion } from "framer-motion";

/**
 * About
 * -----
 * Bold "About Me" section on a vibrant red field:
 *   - Left: an ID badge hanging from a black lanyard (gentle swing + hover).
 *   - Right: editorial intro with a large black "Hello!".
 *   - Floating React / Node / MongoDB logos.
 *   - Pulsing abstract stars.
 *   - A torn-paper white divider into the next section.
 *
 * Props:
 *   photo? : string — profile image URL for the badge.
 *   name?  : string — highlighted name.
 */

const RED = "#ff2a2a";

/* ---------- Small abstract star ------------------------------------------- */

function Star({ className, size = 26, delay = 0 }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      initial={{ opacity: 0.25, scale: 0.85 }}
      animate={{ opacity: [0.25, 0.9, 0.25], scale: [0.85, 1.15, 0.85] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay }}
      aria-hidden="true"
    >
      <path
        fill="#0a0a0a"
        d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0z"
      />
    </motion.svg>
  );
}

export default function About({
  photo = "/navjot.jpg",
  name = "NAVJOT",
}) {
  return (
    <section
      id="about"
      className="relative w-full overflow-hidden pb-40 pt-20 md:pt-28"
      style={{ backgroundColor: RED }}
    >
      {/* Floating decorative stars */}
      <Star className="absolute left-[6%] top-[12%]" size={34} delay={0} />
      <Star className="absolute left-[46%] top-[8%]" size={20} delay={0.6} />
      <Star className="absolute right-[8%] top-[22%]" size={40} delay={1.1} />
      <Star className="absolute left-[12%] bottom-[26%]" size={22} delay={1.6} />
      <Star className="absolute right-[16%] bottom-[30%]" size={28} delay={0.9} />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 md:px-10 lg:grid-cols-2 lg:gap-10">
        {/* ---------------- Left: hanging ID badge ---------------- */}
        <div className="flex justify-center">
          <motion.div
            className="relative flex flex-col items-center"
            style={{ transformOrigin: "top center" }}
            animate={{ rotate: [-2.2, 2.2, -2.2] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ rotate: 0, scale: 1.03 }}
          >
            {/* Lanyard straps forming a V up to the top */}
            <div className="relative h-40 w-48">
              <div className="absolute left-1/2 top-0 h-44 w-9 -translate-x-1/2 origin-top -rotate-[18deg] bg-black" />
              <div className="absolute left-1/2 top-0 h-44 w-9 -translate-x-1/2 origin-top rotate-[18deg] bg-black" />
              {/* Lanyard knot */}
              <div className="absolute left-1/2 top-[132px] h-6 w-14 -translate-x-1/2 rounded-sm bg-black" />
            </div>

            {/* Metal clip */}
            <div className="relative z-10 -mt-2 h-6 w-10 rounded-sm bg-neutral-400 shadow-md ring-1 ring-black/30">
              <div className="absolute left-1/2 top-1 h-3 w-4 -translate-x-1/2 rounded-full border-2 border-neutral-600" />
            </div>

            {/* The card */}
            <div className="group relative -mt-1 -rotate-3 transition-transform duration-500 hover:rotate-0">
              {/* Clip hole */}
              <div className="absolute left-1/2 top-3 z-10 h-2.5 w-12 -translate-x-1/2 rounded-full bg-black/70" />

              <div className="w-64 rounded-3xl bg-neutral-800 p-4 pt-8 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] ring-1 ring-white/10 sm:w-72">
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src={photo}
                    alt={name}
                    className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="mt-4 px-1 pb-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#ff2a2a]">
                    Certified Shopify Developer
                  </p>
                  <p className="mt-1 text-lg font-black uppercase tracking-tight text-white">
                    {name}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-widest text-white/40">
                      ID · 2026
                    </span>
                    {/* Fake barcode */}
                    <div className="flex h-6 items-end gap-[2px]">
                      {[3, 6, 2, 5, 3, 6, 2, 4, 6, 3, 5, 2, 6].map((h, i) => (
                        <span
                          key={i}
                          className="w-[2px] bg-white/70"
                          style={{ height: `${h * 3}px` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ---------------- Right: intro copy ---------------- */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-6xl font-black leading-none tracking-tight text-black sm:text-7xl md:text-8xl">
            Hello!
          </h2>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-white md:text-xl">
            I'm{" "}
            <span className="font-black uppercase tracking-tight text-black">
              {name}
            </span>
            , a{" "}
            <span className="font-semibold text-black/80">
              Certified Shopify Developer
            </span>{" "}
            and growth partner. I build high-converting stores and drive the
            traffic that fills them - so your brand actually sells.
          </p>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
            One accountable partner for design, development, SEO, AEO and paid
            ads - obsessed with speed, conversions and real ROI, online and off.
          </p>

          {/* Capability tiles */}
          <div className="mt-12 flex flex-wrap items-center gap-4">
            {[
              { icon: "🛍️", label: "Shopify Expert" },
              { icon: "🔍", label: "SEO & AEO" },
              { icon: "📈", label: "Paid Ads & Lead Gen" },
            ].map((cap, i) => (
              <motion.div
                key={cap.label}
                className="flex items-center gap-2 rounded-full bg-black/85 px-5 py-3 text-sm font-semibold text-white shadow-lg"
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.4,
                }}
                whileHover={{ scale: 1.06 }}
              >
                <span className="text-lg">{cap.icon}</span>
                {cap.label}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ---------------- Torn-paper divider ---------------- */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-full leading-[0]">
        <svg
          viewBox="0 0 1200 90"
          preserveAspectRatio="none"
          className="block h-[70px] w-full md:h-[90px]"
          aria-hidden="true"
        >
          <path
            fill="#ffffff"
            d="M0 90 L0 46 C40 40 70 58 110 52 C150 46 175 28 220 34 C270 40 300 62 350 56 C405 49 430 30 485 38 C540 46 565 66 620 58 C680 49 705 28 760 36 C815 44 845 64 900 56 C955 48 985 30 1040 38 C1090 45 1120 60 1160 52 C1178 48 1190 44 1200 46 L1200 90 Z"
          />
        </svg>
      </div>
    </section>
  );
}
