import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Preloader
 * ---------
 * Luxury-agency style loading screen.
 *
 *  1. A dark, semi-transparent "Navjot." sits centered as the base layer.
 *  2. An identical white "Navjot." is stacked exactly on top.
 *  3. The white copy fills upward (water-fill) via a clip-path animation.
 *  4. After a short hold, the whole red panel slides up like a shutter,
 *     while the logo gently scales down and fades for extra polish.
 *
 * Props:
 *   onComplete? : () => void   — fired once the panel has left the screen.
 *   minDuration?: number       — optional floor (ms) before exit begins.
 */
export default function Preloader({ onComplete, minDuration = 2400 }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), minDuration);
    return () => clearTimeout(timer);
  }, [minDuration]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isLoading && (
        <motion.div
          key="preloader"
          className="fixed inset-0 flex items-center justify-center bg-[#ff2a2a]"
          style={{ zIndex: 100000 }}
          initial={{ y: 0 }}
          exit={{
            y: "-100%",
            transition: { duration: 1, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* Logo stack: exits with a subtle scale-down + fade */}
          <motion.div
            className="relative select-none"
            exit={{
              scale: 0.92,
              opacity: 0,
              transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
            }}
          >
            {/* Base layer — dark transparent text */}
            <span className="block text-[15vw] font-black leading-none tracking-[-0.06em] text-black/25 md:text-[11vw]">
              Navjot.
            </span>

            {/*
              Foreground layer — white text that fills upward.

              The clip is inset negatively on the right and bottom so it
              reaches past the element's box. Some of the glyph ink lives out
              there: leading-none makes the line box shorter than the font's
              ascent plus descent, so the j's tail hangs below it, and
              tracking-[-0.06em] subtracts a letter's worth of space after the
              final character, pulling the right edge in behind the full stop.
              Clipping at 0 sliced both off the white copy and let the dark
              base layer show through them.

              Starting the top at 110% keeps the fill empty on the first frame:
              the visible band runs from the top inset down to the expanded
              bottom edge, so 100% would already reveal that descender.
            */}
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 block text-[15vw] font-black leading-none tracking-[-0.06em] text-white md:text-[11vw]"
              initial={{ clipPath: "inset(110% -10% -10% 0)" }}
              animate={{ clipPath: "inset(0% -10% -10% 0)" }}
              transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
            >
              Navjot.
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
