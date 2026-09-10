import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Navbar
 * ------
 * Floating, fixed navigation for a developer personal brand.
 *   - Transparent at the top; on scroll it shrinks and gains a blurred,
 *     semi-transparent backdrop (Apple-style).
 *   - Center links with an underline that grows left→right on hover.
 *   - Glassmorphism "Hire Me" CTA with a soft red glow on hover.
 *   - Mobile: hamburger toggles a full-width red slide-down panel.
 *
 * Props:
 *   logo? : string — brand text (a red "." is appended as the accent).
 */

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const RED = "#ff2a2a";

export default function Navbar({ logo = "Navjot" }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const Logo = (
    <a
      href="#home"
      onClick={() => setOpen(false)}
      className="text-2xl font-black tracking-tight text-white"
    >
      {logo}
      <span style={{ color: RED }}>.</span>
    </a>
  );

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
      style={{ zIndex: 50 }}
    >
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-500 ease-out md:px-10 ${
          scrolled
            ? "my-2 rounded-full border border-white/10 bg-black/40 py-2.5 shadow-lg backdrop-blur-xl md:my-3"
            : "bg-transparent py-6 md:py-8"
        }`}
      >
        {/* Left: logo */}
        {Logo}

        {/* Center: desktop links */}
        <ul className="hidden items-center gap-10 lg:flex">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="group relative text-sm font-medium uppercase tracking-wide text-white/70 transition-colors duration-300 hover:text-white"
              >
                {link.label}
                <span
                  className="absolute -bottom-1 left-0 h-[2px] w-0 transition-all duration-300 ease-out group-hover:w-full"
                  style={{ backgroundColor: RED }}
                />
              </a>
            </li>
          ))}
        </ul>

        {/* Right: CTA (desktop) + hamburger (mobile) */}
        <div className="flex items-center gap-4">
          <a
            href="#contact"
            className="hidden rounded-full border border-white/30 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/50 hover:bg-white/20 hover:shadow-[0_0_25px_4px_rgba(255,42,42,0.5)] sm:inline-block"
          >
            Hire Me
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[6px] lg:hidden"
          >
            <motion.span
              animate={open ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="block h-[2px] w-7 rounded-full bg-white"
            />
            <motion.span
              animate={open ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="block h-[2px] w-7 rounded-full bg-white"
            />
            <motion.span
              animate={open ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="block h-[2px] w-7 rounded-full bg-white"
            />
          </button>
        </div>
      </nav>

      {/* Mobile slide-down panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "100vh", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-0 overflow-hidden lg:hidden"
            style={{ backgroundColor: RED }}
          >
            <motion.ul
              className="flex h-full flex-col items-start justify-center gap-2 px-8"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
              }}
            >
              {LINKS.map((link) => (
                <motion.li
                  key={link.label}
                  variants={{
                    hidden: { opacity: 0, x: -30 },
                    show: { opacity: 1, x: 0 },
                  }}
                  className="w-full border-b border-black/10"
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-5 text-4xl font-black uppercase tracking-tight text-black transition-transform duration-300 hover:translate-x-3 hover:text-white"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}

              <motion.li
                variants={{
                  hidden: { opacity: 0, x: -30 },
                  show: { opacity: 1, x: 0 },
                }}
                className="mt-8"
              >
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="inline-block rounded-full border border-black/20 bg-black px-8 py-4 text-base font-semibold uppercase tracking-wide text-white transition-transform duration-300 hover:scale-105"
                >
                  Hire Me
                </a>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
