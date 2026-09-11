import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * Testimonials — social proof on a light field.
 *
 * A manually paged carousel: the arrows advance by however many cards are
 * actually on screen (three on desktop, fewer on smaller viewports). Built on
 * native overflow scrolling with scroll-snap, so swipe and keyboard work for
 * free and the page step is measured from the rendered cards rather than
 * derived from a breakpoint the CSS could disagree with.
 *
 * Add to REVIEWS and the carousel simply gets more pages.
 */

const RED = "#ff2a2a";

const REVIEWS = [
  {
    quote:
      "Navjot rebuilt our Shopify store and ran our ads - orders doubled in the first month. Finally one person who owns the whole result.",
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
  {
    quote:
      "Our mobile checkout was losing people at the last step. After the rebuild, load time halved and mobile conversions climbed 60%.",
    name: "Priya Raghavan",
    role: "Founder, Silk & Sage",
  },
  {
    quote:
      "Moving 2,000 products off WooCommerce sounded terrifying. Three weeks, zero downtime, and we kept every ranking we had.",
    name: "Marcus Bell",
    role: "Ecommerce Lead, NorthPeak Gear",
  },
  {
    quote:
      "The email and SMS flows alone cover the retainer every month. Set up once, still pulling in orders a year later.",
    name: "Leila Haddad",
    role: "Co-founder, Amber & Oak",
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

function Card({ review }) {
  return (
    // h-full so the card fills its slot: the flex row stretches every slot to
    // the tallest card, but the figure would otherwise only be as tall as its
    // own text, leaving shorter quotes in a visibly shorter card.
    //
    // White fill rather than neutral-50: the section behind is pure white, so a
    // tinted card left the only grey on the page sitting in the cards
    // themselves. With no shadow and both surfaces white, the border is the
    // only thing separating a card from the page, so it carries the whole edge.
    <figure className="flex h-full flex-col rounded-3xl border border-black/10 bg-white p-8">
      <Stars />
      <blockquote className="mt-5 flex-1 text-lg leading-relaxed text-neutral-800">
        "{review.quote}"
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-4">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: RED }}
        >
          {review.name.split(" ").map((w) => w[0]).join("")}
        </div>
        <div>
          <p className="text-sm font-bold text-black">{review.name}</p>
          <p className="text-xs text-neutral-500">{review.role}</p>
        </div>
      </figcaption>
    </figure>
  );
}

/** Chevron. An SVG rather than a character so it sits true in the circle. */
function Chevron({ direction }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: direction === "prev" ? "rotate(180deg)" : undefined }}
    >
      <polyline points="9 5 16 12 9 19" />
    </svg>
  );
}

function ArrowButton({ direction, onClick, disabled, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous reviews" : "Next reviews"}
      // active: fills the circle red on press. It comes after hover: so it
      // wins while the button is held down, including on touch where there is
      // no hover state to fall back on.
      className={`h-12 w-12 shrink-0 items-center justify-center rounded-full border border-black/15 bg-white text-black shadow-[0_8px_24px_-12px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-transparent hover:bg-[#ff2a2a] hover:text-white active:scale-95 active:border-transparent active:bg-[#ff2a2a] active:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-black/15 disabled:hover:bg-white disabled:hover:text-black ${className}`}
    >
      <Chevron direction={direction} />
    </button>
  );
}

function Dots({ count, active, onSelect }) {
  return (
    <div className="flex items-center justify-center gap-2.5">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Go to review page ${i + 1}`}
          aria-current={i === active || undefined}
          className={`rounded-full transition-all duration-300 ${
            i === active
              ? "h-2.5 w-2.5 bg-[#ff2a2a]"
              : "h-2 w-2 bg-neutral-300 hover:bg-neutral-400"
          }`}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const scroller = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [activePage, setActivePage] = useState(0);
  // Mirrors activePage, but as a ref so it is readable the instant it changes.
  // The arrows step from here rather than from state: React has not
  // re-rendered by the time a second click lands mid-scroll, and stepping from
  // a stale activePage would re-target the page the carousel is already on.
  const pageRef = useRef(0);

  // Everything is read back from the rendered row rather than assumed, so the
  // page size follows whatever the CSS is actually showing: three cards wide
  // on desktop, one on a phone. Returns null before the first paint.
  const measure = useCallback(() => {
    const el = scroller.current;
    const card = el?.firstElementChild;
    if (!el || !card) return null;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const stride = card.getBoundingClientRect().width + gap;
    const perPage = Math.max(1, Math.round((el.clientWidth + gap) / stride));
    return {
      stride,
      perPage,
      limit: el.scrollWidth - el.clientWidth,
      pages: Math.max(1, Math.ceil(REVIEWS.length / perPage)),
    };
  }, []);

  // Drives the arrows' disabled state and which dot is lit. Recomputed from
  // real scroll geometry so it stays right through swipes and resizes alike.
  const sync = useCallback(() => {
    const el = scroller.current;
    const m = measure();
    if (!el || !m) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft >= m.limit - 2);
    setPageCount(m.pages);
    // The final page is usually a partial one, so clamp rather than trusting
    // the division to land inside the dot range.
    const page = Math.round(el.scrollLeft / (m.perPage * m.stride));
    const clamped = Math.min(Math.max(page, 0), m.pages - 1);
    pageRef.current = clamped;
    setActivePage(clamped);
  }, [measure]);

  // Watch the row itself rather than the window. A resize listener would miss
  // anything that changes card width without the window changing size — web
  // fonts landing, a scrollbar appearing — and the page size would stay wrong
  // until the next resize. ResizeObserver also fires once on observe, which
  // covers the initial measurement.
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    // Measure synchronously at commit so the dots are already correct on the
    // first paint, rather than flashing a placeholder count until the observer
    // delivers its first callback.
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, [sync]);

  const goToPage = (index) => {
    const el = scroller.current;
    const m = measure();
    if (!el || !m) return;

    const page = Math.min(Math.max(index, 0), m.pages - 1);
    const target = Math.min(page * m.perPage * m.stride, m.limit);

    el.scrollTo({
      left: target,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });

    // Settle the controls from the destination rather than waiting for the
    // scroll to arrive: a smooth scroll takes a few hundred ms, and leaving
    // them stale that long lets a quick second click run past an edge.
    setAtStart(target <= 2);
    setAtEnd(target >= m.limit - 2);
    pageRef.current = page;
    setActivePage(page);
  };

  /** Step one page from wherever the carousel is actually headed. */
  const step = (direction) => goToPage(pageRef.current + direction);

  return (
    <section className="w-full overflow-hidden bg-white py-24 md:py-32">
      {/*
        Padding outside, max-w-7xl centred inside — the same nesting every
        other left-aligned section uses, so the heading lines up with them.
      */}
      <div className="w-full px-6 md:px-10">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full border border-black/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-black/60">
              Loved by founders
            </span>
            <h2 className="mt-6 text-4xl font-black tracking-tight text-black sm:text-5xl md:text-6xl">
              Brands that grew with{" "}
              <span style={{ color: RED }}>Navjot</span>.
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-16"
          >
            {/*
              right-full / left-full park each arrow entirely outside the row,
              so they sit on the white panel and never overlap a card.
              That needs about 60px of gutter beside the content column, and
              the gutter is a flat 40px at every width up to ~1360 (it is just
              the section padding until max-w-7xl starts to bind). So the side
              arrows only appear from 1440px up, where there is real room; below
              that the pair below the row takes over.
            */}
            <ArrowButton
              direction="prev"
              onClick={() => step(-1)}
              disabled={atStart}
              className="absolute right-full top-1/2 z-10 mr-3 hidden -translate-y-1/2 min-[1440px]:flex"
            />
            <ArrowButton
              direction="next"
              onClick={() => step(1)}
              disabled={atEnd}
              className="absolute left-full top-1/2 z-10 ml-3 hidden -translate-y-1/2 min-[1440px]:flex"
            />

            <div
              ref={scroller}
              onScroll={sync}
              // Focusable and labelled so the carousel is reachable and
              // scrollable by keyboard, not only by the controls.
              role="region"
              aria-label="Customer reviews"
              tabIndex={0}
              className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto"
            >
              {REVIEWS.map((r) => (
                // Slot widths make whole cards fill the row: three at lg, two
                // at sm, and one just short of full width on mobile so the next
                // card peeks in and hints that the row scrolls.
                <div
                  key={r.name}
                  className="w-[85%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
                >
                  <Card review={r} />
                </div>
              ))}
            </div>
          </motion.div>

          {/*
            Below 1440px the gutter is too narrow for arrows beside the row, so
            they join the dots here instead — still on the white panel, just
            under the cards rather than next to them.
          */}
          <div className="mt-10 flex items-center justify-center gap-5">
            <ArrowButton
              direction="prev"
              onClick={() => step(-1)}
              disabled={atStart}
              className="flex min-[1440px]:hidden"
            />
            <Dots count={pageCount} active={activePage} onSelect={goToPage} />
            <ArrowButton
              direction="next"
              onClick={() => step(1)}
              disabled={atEnd}
              className="flex min-[1440px]:hidden"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
