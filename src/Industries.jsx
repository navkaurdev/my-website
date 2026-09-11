import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * Industries — "We serve all industries".
 * The full animated scene (roadmap + drifting clouds, planes, a rocket,
 * factory smoke, fluttering rooftop flags and driving cars) lives as a
 * self-contained document at /public/industries-scene.html and is loaded in an
 * isolated iframe, so its global CSS can't leak into the rest of the site.
 * The iframe keeps the artwork's 1366×642 aspect ratio and fades up on scroll.
 */

export default function Industries() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      id="industries"
      className="w-full overflow-hidden pt-24 md:pt-28"
      style={{
        background:
          "linear-gradient(180deg, #ffffff 0%, #f4f8ff 42%, #eaf1fb 100%)",
      }}
    >
      <div className="mx-auto max-w-4xl px-6 text-center">
        <span className="inline-block rounded-full border border-black/10 bg-white/70 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-black/60 shadow-sm backdrop-blur-sm">
          Industries
        </span>
        <h2 className="mt-6 text-4xl font-black tracking-tight text-black sm:text-5xl md:text-6xl">
          We serve all industries
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-neutral-500">
          I stay on top of my craft by becoming an expert in yours - from
          e-commerce and retail to finance, hospitality, healthcare and beyond.
        </p>
      </div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 48 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-8 w-full"
      >
        <iframe
          src="/industries-scene.html"
          title="Industries we serve"
          loading="lazy"
          scrolling="no"
          className="block w-full border-0 bg-transparent"
          style={{ aspectRatio: "1366 / 642", background: "transparent" }}
          allowTransparency="true"
        />
      </motion.div>
    </section>
  );
}
