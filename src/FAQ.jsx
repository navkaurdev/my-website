import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * FAQ — objection handling, on a light field. Accordion with spring open/close.
 */

const RED = "#ff2a2a";

const QA = [
  {
    q: "Do you work with brand-new stores?",
    a: "Absolutely. Whether you're launching your first Shopify store or scaling an established brand, I tailor the plan to your stage and budget.",
  },
  {
    q: "How much does it cost?",
    a: "Projects start from a fixed scope for store builds, with monthly retainers for growth (SEO/ads). After your free audit I'll send a clear, no-surprise quote.",
  },
  {
    q: "How soon will I see results?",
    a: "Paid ads can drive sales within days. SEO and AEO compound over 2–4 months. I set realistic milestones so you always know what to expect.",
  },
  {
    q: "Do I need both development and marketing?",
    a: "Not necessarily - you can hire me for just a store build, just growth, or the full package. Most brands see the best results when both work together.",
  },
  {
    q: "How do we get started?",
    a: "Request your free store audit above or book a quick call. We'll align on goals, then I'll map out a plan and timeline.",
  },
];

function Item({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-black/10">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-6 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-semibold text-black md:text-xl">{item.q}</span>
        {/*
          The mark is an SVG, not a "+" text glyph: a glyph is centred by its
          line box rather than its ink, so font ascender/descender space left it
          visibly off-centre — and rotating to the × amplified the offset. These
          strokes are symmetric about the viewBox centre, so both states sit
          true and the rotation pivots on the mark itself.
        */}
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-300"
          style={{
            backgroundColor: isOpen ? RED : "transparent",
            color: isOpen ? "#fff" : "#000",
            border: isOpen ? "none" : "1px solid rgba(0,0,0,0.15)",
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 pr-12 leading-relaxed text-neutral-600">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="w-full bg-white px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <span className="inline-block rounded-full border border-black/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-black/60">
            FAQ
          </span>
          <h2 className="mt-6 text-4xl font-black tracking-tight text-black sm:text-5xl">
            Questions,{" "}
            <span style={{ color: RED }}>answered</span>.
          </h2>
          <p className="mt-5 text-neutral-500">
            Everything you need to know before we start growing your brand.
          </p>
        </div>

        <div>
          {QA.map((item, i) => (
            <Item
              key={item.q}
              item={item}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
