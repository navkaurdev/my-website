import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Footer
 * ------
 * Premium dark footer with three bands:
 *   1. Top info grid   — services / experience / availability.
 *   2. Giant branding  — a massive lowercase signature that reveals and
 *                        parallax-drifts on scroll.
 *   3. Bottom grid     — contact + copyright / email / privacy.
 *
 * Props:
 *   brand? : string — the giant signature word.
 *   email? : string — contact email.
 */

const services = [
  "Cinematic Production",
  "Motion Graphics",
  "Web Development",
  "UI/UX Design",
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

/** Underlined link with a left→right slide-in underline. */
function SlideLink({ href, children, className = "" }) {
  return (
    <a
      href={href}
      className={`group relative inline-block text-[#f4f4f4] transition-colors duration-300 hover:text-white ${className}`}
    >
      {children}
      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-100 bg-white/40 transition-transform duration-500 group-hover:origin-left" />
      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-white transition-all duration-500 group-hover:w-full" />
    </a>
  );
}

export default function Footer({ brand = "navjot", email = "hello@navjot.dev" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  // Subtle parallax + reveal for the giant signature.
  const y = useTransform(scrollYProgress, [0, 1], [80, -20]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0.15, 1]);

  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      ref={ref}
      className="relative flex min-h-[50vh] w-full flex-col justify-between overflow-hidden bg-[#111111] px-6 pb-10 pt-20 md:px-12 md:pt-28"
    >
      {/* ---------- Top info grid ---------- */}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 md:grid-cols-3">
        {/* Left: services */}
        <motion.ul
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          className="space-y-3 font-mono text-[11px] uppercase tracking-[0.25em] text-white/60"
        >
          {services.map((s) => (
            <li key={s} className="transition-colors duration-300 hover:text-white">
              {s}
            </li>
          ))}
        </motion.ul>

        {/* Center: experience */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          className="md:text-center"
        >
          <p className="text-2xl font-semibold text-[#f4f4f4] md:text-3xl">
            5+ Years
          </p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-white/60">
            of Experience
          </p>
          <div className="mt-4">
            <SlideLink
              href="#skills"
              className="font-mono text-xs uppercase tracking-[0.25em]"
            >
              View Work
            </SlideLink>
          </div>
        </motion.div>

        {/* Right: availability */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          className="md:text-right"
        >
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-white/60">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Available Worldwide
          </span>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
            © {year}
          </p>
        </motion.div>
      </div>

      {/* ---------- Giant branding ---------- */}
      <div className="pointer-events-none relative my-16 flex justify-center md:my-20">
        <motion.h2
          style={{ y, opacity }}
          className="select-none text-center text-[24vw] font-black leading-[0.8] tracking-tighter text-[#f4f4f4] md:text-[22vw]"
        >
          {brand}
        </motion.h2>
      </div>

      {/* ---------- Bottom contact grid ---------- */}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-6 border-t border-white/10 pt-8 text-sm md:grid-cols-3">
        {/* Left: contact + copyright */}
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
          <SlideLink href={`mailto:${email}`} className="tracking-[0.2em]">
            Get in touch
          </SlideLink>
          <p className="mt-2 normal-case tracking-normal text-white/40">
            © {year} {brand}. All rights reserved. Built with React.
          </p>
        </div>

        {/* Center: email */}
        <div className="md:text-center">
          <SlideLink
            href={`mailto:${email}`}
            className="text-sm tracking-wide"
          >
            {email}
          </SlideLink>
        </div>

        {/* Right: privacy */}
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50 md:text-right">
          <SlideLink href="#" className="tracking-[0.2em]">
            Privacy Policy
          </SlideLink>
        </div>
      </div>
    </footer>
  );
}
