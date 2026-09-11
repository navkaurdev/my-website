import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ---------- Rotating word (morphs through a list) ---------- */
function RotatingWord({ words, className }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % words.length), 2200);
    return () => clearInterval(t);
  }, [words.length]);
  return (
    <span className={`relative inline-block overflow-hidden align-bottom ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[i]}
          initial={{ y: "100%", opacity: 0, rotateX: -40 }}
          animate={{ y: "0%", opacity: 1, rotateX: 0 }}
          exit={{ y: "-100%", opacity: 0, rotateX: 40 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ---------- Count-up stat (animates 0 → value on mount) ---------- */
function CountUp({ value, suffix = "", duration = 1800, delay = 0 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now() + delay;
    const tick = (now) => {
      const p = Math.min(Math.max((now - start) / duration, 0), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, delay]);
  const display = Number.isInteger(value) ? Math.round(n) : n.toFixed(1);
  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

/**
 * Hero
 * ----
 * Full-screen cinematic hero with a video background that starts paused and
 * plays only when the user clicks the custom "Play Reel" button.
 *
 * Background source (pick one):
 *   youtubeId? : string  — a YouTube video id. Rendered as a muted, cover-fit
 *                          iframe and driven via the YouTube IFrame Player API.
 *   videoSrc?  : string  — background video URL (mp4). Used when no youtubeId.
 *   poster?    : string  — poster image shown while the mp4 is paused.
 */

// Loads the YouTube IFrame API script once and resolves when ready.
let ytApiPromise;
function loadYouTubeApi() {
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) return resolve(window.YT);
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev && prev();
      resolve(window.YT);
    };
    document.head.appendChild(tag);
  });
  return ytApiPromise;
}

// Staggered container for the left-column content.
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero({
  youtubeId,
  // Placeholder reel — replace with your own (ideally a local /public/reel.mp4).
  videoSrc = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  poster = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80",
}) {
  const videoRef = useRef(null);
  const ytHostRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const ytReadyRef = useRef(false);
  const pendingPlayRef = useRef(false);
  const freezeRef = useRef(null);
  // With a YouTube background the video autoplays, so start in the playing state.
  const [isPlaying, setIsPlaying] = useState(Boolean(youtubeId));
  // Autoplay must start muted (browser policy). We ask for sound immediately
  // once the player is ready, and again on the first gesture if that's refused.
  const [isMuted, setIsMuted] = useState(true);

  // Toggle sound based on the player's REAL mute state (not React state, which
  // can drift when the browser silently ignores a programmatic unmute).
  const toggleSound = () => {
    const player = ytPlayerRef.current;
    if (youtubeId && player?.isMuted) {
      if (player.isMuted()) {
        player.unMute();
        player.setVolume(100);
        player.playVideo?.();
        setIsMuted(false);
      } else {
        player.mute();
        setIsMuted(true);
      }
      return;
    }
    const v = videoRef.current;
    if (v) {
      v.muted = !v.muted;
      if (!v.muted) v.play?.().catch(() => {});
      setIsMuted(v.muted);
    }
  };

  // Ask a freshly-started (muted) player for sound, then check whether the
  // browser actually granted it. Two things can go wrong and both have to be
  // caught: the unmute can be refused outright, or it can be honoured but stop
  // playback, which would leave the hero sitting on a frozen frame. Only keep
  // sound if the reel is genuinely audible AND still running; otherwise fall
  // back to silent playback and let the first-gesture listener try again.
  const requestSoundOnLoad = useCallback((player) => {
    player.unMute?.();
    player.setVolume?.(100);
    window.setTimeout(() => {
      const audible = player.isMuted && !player.isMuted();
      const playing =
        player.getPlayerState?.() === window.YT?.PlayerState?.PLAYING;
      if (audible && playing) {
        setIsMuted(false);
        return;
      }
      player.mute?.();
      player.playVideo?.();
      setIsMuted(true);
    }, 300);
  }, []);

  // Initialise the YouTube player (only when a youtubeId is provided).
  useEffect(() => {
    if (!youtubeId) return;
    let cancelled = false;

    loadYouTubeApi().then((YT) => {
      if (cancelled || !ytHostRef.current) return;
      // YT.Player REPLACES the node it's given with an <iframe>. Give it a
      // fresh inner node (owned by us and actually in the DOM) so StrictMode's
      // mount→unmount→mount cycle can't leave an orphaned, invisible player.
      const mount = document.createElement("div");
      mount.className = "h-full w-full";
      ytHostRef.current.appendChild(mount);
      ytPlayerRef.current = new YT.Player(mount, {
        videoId: youtubeId,
        playerVars: {
          autoplay: 1,
          controls: 0, // no control bar
          mute: 1,
          modestbranding: 1,
          rel: 0, // no related videos
          playsinline: 1,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3, // hide annotations
          // no `loop`/`playlist` → the reel plays exactly once
        },
        events: {
          onReady: (e) => {
            ytReadyRef.current = true;
            // Start muted: autoplay is only permitted silently, and asking for
            // sound up front would stop the reel from starting at all.
            e.target.mute();
            e.target.playVideo();
            pendingPlayRef.current = false;
            // Then immediately ask for sound. Where the browser allows it (the
            // user has enough media engagement with this site, or autoplay is
            // permitted by policy) the reel is audible from load with no
            // interaction. Where it doesn't, this is refused silently and the
            // first-gesture listener below takes over.
            requestSoundOnLoad(e.target);
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              // Freeze on the last frame just before the end so YouTube's
              // end screen (replay / next / related thumbnails) never appears.
              clearInterval(freezeRef.current);
              freezeRef.current = setInterval(() => {
                const p = ytPlayerRef.current;
                if (!p?.getDuration) return;
                const d = p.getDuration();
                if (d && p.getCurrentTime() >= d - 0.4) {
                  p.pauseVideo();
                  clearInterval(freezeRef.current);
                }
              }, 200);
            } else if (
              e.data === YT.PlayerState.PAUSED ||
              e.data === YT.PlayerState.ENDED
            ) {
              setIsPlaying(false);
              clearInterval(freezeRef.current);
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      ytReadyRef.current = false;
      pendingPlayRef.current = false;
      clearInterval(freezeRef.current);
      if (ytPlayerRef.current?.destroy) ytPlayerRef.current.destroy();
      ytPlayerRef.current = null;
      // Remove any iframe the API left behind so only the live player shows.
      if (ytHostRef.current) ytHostRef.current.innerHTML = "";
    };
  }, [youtubeId, requestSoundOnLoad]);

  // Browsers block autoplay WITH sound, so turn sound on (and ensure the reel
  // is playing) at the first sign of the user: cursor movement, scroll, or any
  // interaction. Cursor/scroll aren't "activating" gestures in strict browsers,
  // so if they're ignored the sound reliably kicks in on the first real click.
  useEffect(() => {
    const unmute = () => {
      const player = ytPlayerRef.current;
      if (player?.unMute) {
        player.unMute();
        player.setVolume(100);
        player.playVideo?.();
        // Only accept it (and stop listening) once the player is TRULY unmuted.
        // Strict browsers ignore unmute on cursor-move/scroll, so we keep
        // listening until a real gesture (e.g. a click) lands.
        setTimeout(() => {
          if (player.isMuted && !player.isMuted()) {
            setIsMuted(false);
            cleanup();
          }
        }, 250);
        return;
      }
      const v = videoRef.current;
      if (v) {
        v.muted = false;
        v.play?.().catch(() => {});
        setIsMuted(false);
      }
      cleanup();
    };
    const events = [
      "pointerdown",
      "pointermove",
      "mousemove",
      "keydown",
      "touchstart",
      "wheel",
      "scroll",
      "click",
    ];
    const cleanup = () =>
      events.forEach((ev) => window.removeEventListener(ev, unmute));
    events.forEach((ev) =>
      window.addEventListener(ev, unmute, { passive: true })
    );
    return cleanup;
  }, []);

  const togglePlay = () => {
    if (youtubeId) {
      const player = ytPlayerRef.current;
      // Player object may exist before it's ready to accept commands; queue
      // the intent so the very first click is never dropped.
      if (!player || !ytReadyRef.current) {
        pendingPlayRef.current = true;
        return;
      }
      // Drive off the player's real state rather than React state, so the
      // button stays correct even if an event was missed.
      const state = player.getPlayerState?.();
      if (state === window.YT.PlayerState.PLAYING) {
        player.pauseVideo();
      } else {
        player.playVideo();
        // A click is a real gesture, so this is the moment sound is allowed.
        player.unMute?.();
        player.setVolume?.(100);
        setIsMuted(false);
      }
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden bg-[#ff2a2a]">
      {/* Background: YouTube (cover-fit iframe) or native mp4 */}
      {youtubeId ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/*
            An iframe is fixed at 16:9. To cover any viewport we size it to
            100vw x 56.25vw (and 177.78vh x 100vh when the viewport is taller
            than 16:9), centered — the video-background "cover" trick.
          */}
          <div className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 scale-[1.35]">
            <div ref={ytHostRef} className="h-full w-full" />
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={videoSrc}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}

      {/* Soft scrim for text legibility (keeps the bright look on the right) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

      {/*
        Content.
        Top padding always clears the fixed navbar (~90px unscrolled) and
        bottom padding clears the services marquee pinned to the section's
        bottom edge (~46px) — otherwise, on short viewports the centred column
        overflows and slides underneath both.
      */}
      {/*
        Padding sits on this outer box and max-w-7xl is centred inside it,
        matching how every other left-aligned section is built (Services,
        Results, Projects). Putting the padding inside the centred box instead
        pushes the content in by one px-10 and leaves the hero misaligned with
        the rest of the page.
      */}
      <div className="relative z-10 flex min-h-screen w-full flex-col justify-center px-6 pb-28 pt-32 md:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-14 lg:flex-row lg:items-center lg:justify-between">
          {/* Left content */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-2xl"
          >
            {/* Certified badge */}
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md"
            >
              <span className="flex h-2 w-2">
                <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-[#ff2a2a] opacity-75" />
                <span className="inline-flex h-2 w-2 rounded-full bg-[#ff2a2a]" />
              </span>
              Certified Shopify Developer
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg font-medium tracking-wide text-white/80 drop-shadow-lg md:text-xl"
            >
              Hi, I'm Navjot 👋
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="mt-2 text-5xl font-black uppercase leading-[0.95] tracking-tight text-white drop-shadow-xl sm:text-6xl md:text-7xl lg:text-8xl"
            >
              Grow your
              <br />
              business{" "}
              <RotatingWord
                words={["online.", "sales.", "store.", "reach."]}
                className="text-[#ff2a2a] drop-shadow-[0_4px_20px_rgba(255,42,42,0.5)]"
              />
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-lg text-base leading-relaxed text-white/80 drop-shadow-md md:text-lg"
            >
              I help brands sell more with{" "}
              <span className="font-semibold text-white">
                high-converting Shopify stores
              </span>
              ,{" "}
              <span className="font-semibold text-white">SEO &amp; AEO</span>, and{" "}
              <span className="font-semibold text-white">paid ads</span> that
              actually deliver ROI - online and offline.
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={fadeUp}
              className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold uppercase tracking-wide text-black transition-transform duration-300 hover:scale-105"
              >
                Get Free Store Audit
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/5 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/10"
              >
                Book a Call
              </a>
            </motion.div>

            {/* Animated stats */}
            <motion.div
              variants={fadeUp}
              className="mt-12 flex flex-wrap gap-x-10 gap-y-6"
            >
              {[
                { v: 50, suffix: "+", label: "Stores built" },
                { v: 4.2, suffix: "×", label: "Avg. ROAS" },
                { v: 5, suffix: "+", label: "Years growing brands" },
              ].map((s, i) => (
                <div key={s.label}>
                  <p className="text-3xl font-black text-white drop-shadow-lg md:text-4xl">
                    <CountUp value={s.v} suffix={s.suffix} delay={800 + i * 200} />
                  </p>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right side — Play Reel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-14 flex flex-col items-center lg:mt-0"
          >
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause reel" : "Play reel"}
              className="group relative flex h-28 w-28 items-center justify-center rounded-full border border-white/40 bg-white/5 backdrop-blur-md transition-all duration-500 hover:scale-110 hover:border-[#ff2a2a] hover:shadow-[0_0_45px_10px_rgba(255,42,42,0.55)] md:h-36 md:w-36"
            >
              {isPlaying ? (
                // Pause icon
                <svg
                  className="h-9 w-9 text-white transition-transform duration-300 group-hover:scale-110 md:h-11 md:w-11"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                // Play icon
                <svg
                  className="ml-1 h-9 w-9 text-white transition-transform duration-300 group-hover:scale-110 md:h-11 md:w-11"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <span className="mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              {isPlaying ? "Pause" : "Play Reel"}
            </span>

            {/* Sound toggle — video autoplays muted; unmute for audio */}
            <button
              onClick={toggleSound}
              aria-label={isMuted ? "Unmute" : "Mute"}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/80 backdrop-blur-md transition-all duration-300 hover:border-[#ff2a2a] hover:text-white"
            >
              {isMuted ? (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v2.2l2.45 2.45c.03-.2.05-.41.05-.62zM19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.9 8.9 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.94-2.25 1.2v2.06a8.94 8.94 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.05A4.5 4.5 0 0 0 16.5 12zM14 3.23v2.06a7.001 7.001 0 0 1 0 13.42v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
              {isMuted ? "Sound off" : "Sound on"}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Infinite services marquee */}
      <div className="absolute bottom-0 left-0 z-10 w-full overflow-hidden border-y border-white/10 bg-black/60 py-3 backdrop-blur-sm">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center">
              {[
                "Shopify Development",
                "SEO",
                "AEO",
                "Google Ads",
                "Meta Ads",
                "Lead Generation",
                "CRO",
                "Email & SMS",
              ].map((item) => (
                <span
                  key={item}
                  className="flex items-center text-sm font-semibold uppercase tracking-[0.25em] text-white/70"
                >
                  <span className="px-6">{item}</span>
                  <span className="text-[#ff2a2a]">✦</span>
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator — desktop only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-20 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/50">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-10 w-6 items-start justify-center rounded-full border border-white/40 p-1.5"
        >
          <span className="block h-2 w-1 rounded-full bg-white/80" />
        </motion.div>
      </motion.div>
    </section>
  );
}
