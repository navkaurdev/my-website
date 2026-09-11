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
            {/*
              Base layer — dark transparent text.

              leading-[1.35] and the right padding exist to make this box
              actually contain the glyph ink, which is what the white copy's
              clip-path is measured against. leading-none made the line box one
              em tall while a font's ascent plus descent is nearer 1.25em, so
              the j's tail hung below the box; tracking-[-0.06em] applies after
              the final character too, pulling the right edge in behind the full
              stop. Both then got clipped off the white layer and showed dark.

              The padding is on this layer alone: it sizes the shared box, while
              the overlay keeps padding-free so both copies still start drawing
              from the same origin and stay exactly superimposed.
            */}
            <span className="block text-[15vw] font-black leading-[1.35] tracking-[-0.06em] text-black/25 pr-[0.1em] md:text-[11vw]">
              Navjot.
            </span>

            {/*
              Foreground layer — white text that fills upward.

              Matches the base layer's leading exactly, so the two copies sit
              superimposed; it takes no padding, since the base's padding
              already sized the shared box.

              The negative insets are only a safety margin now that the box
              holds the ink — sized in percentages of a box that scales with the
              font, so they hold up across whatever face a platform resolves
              system-ui to rather than to the metrics of any one font. The top
              starts past the expanded bottom edge (108%) so the fill is still
              empty on the first frame.
            */}
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 block text-[15vw] font-black leading-[1.35] tracking-[-0.06em] text-white md:text-[11vw]"
              initial={{ clipPath: "inset(115% -8% -8% -3%)" }}
              animate={{ clipPath: "inset(-8% -8% -8% -3%)" }}
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
