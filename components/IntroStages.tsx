'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'motion/react';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';

/** intro → quote → done.
 *
 *  Module scope, deliberately: this survives client-side navigation inside one
 *  document but resets on a real page load, which is exactly the "initial load
 *  only" rule. Set when the sequence FINISHES rather than on mount, so React
 *  StrictMode's dev-only mount→unmount→mount does not consume it before the
 *  first run and silently skip the intro in development.
 */
let sequenceHasPlayed = false;

/* Shared with intro-gate.css. The CSS owns the overlay's own fade-out; these
   only decide when the content inside it swaps. If they ever drift, the worst
   case is a mistimed quote — the overlay still lifts, because that is CSS. */
const QUOTE_AT_MS = 1420;
/* The CSS fade runs 3.0s -> 3.5s. Unmounting lands after it, so the visible
   exit is always the CSS one and React only clears the DOM afterwards. */
const DONE_AT_MS = 3550;

type Stage = 'intro' | 'quote' | 'done';

export function IntroStages({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  /* Read once per mount, before any effect flips the flag. */
  const [isFirstLoad] = useState(() => !sequenceHasPlayed);
  const [stage, setStage] = useState<Stage>('intro');

  useEffect(() => {
    if (!isFirstLoad || reduced) return;
    const toQuote = setTimeout(() => setStage('quote'), QUOTE_AT_MS);
    const toDone = setTimeout(() => {
      setStage('done');
      sequenceHasPlayed = true;
    }, DONE_AT_MS);
    return () => {
      clearTimeout(toQuote);
      clearTimeout(toDone);
    };
  }, [isFirstLoad, reduced]);

  /* Nothing at all on a client-side navigation back to the homepage, and
     nothing for reduced motion — no cover, no delay, straight to the page.
     The `display:none` rule in intro-gate.css covers the reduced-motion case
     for the first paint too, before this component has hydrated. */
  if (!isFirstLoad || reduced || stage === 'done') return null;

  return (
    <div className="intro-gate" aria-hidden="true">
      <LazyMotion features={domAnimation} strict>
        {/* Both stages occupy the same grid cell so their fades overlap into a
            real cross-fade, rather than one finishing before the other starts. */}
        <div className="intro-gate-inner">
          <AnimatePresence>
            {stage === 'intro' && (
              <m.div
                key="intro"
                className="intro-stage"
                /* opacity:1, not 0 — this is what the server renders, and an
                   inline opacity:0 here would hide the pipeline until JS ran. */
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
              >
                {children}
              </m.div>
            )}

            {stage === 'quote' && (
              <m.div
                key="quote"
                className="intro-stage"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
              >
                <p className="intro-quote">Built end to end, learned by shipping.</p>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </LazyMotion>
    </div>
  );
}
