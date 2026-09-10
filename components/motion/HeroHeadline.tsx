'use client';

import { LazyMotion, domAnimation, m } from 'motion/react';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';

/** The hero headline, revealed word by word.
 *
 *  This is the one place in the hero that needs JS: the rest of the entrance
 *  is the CSS ladder in hero.css, and the pipeline below is CSS on a timer.
 *  It is a `LazyMotion`/`m` tree rather than plain `motion.*` so only the DOM
 *  animation feature set is pulled into the above-the-fold bundle — the h1 is
 *  the LCP element, so every kB here is on the critical path.
 *
 *  Deliberately NOT routed through components/motion/enhancements.tsx: that
 *  module is dynamically imported with ssr:false and gated on Developer Mode.
 *  Both are wrong for a headline — it has to be in the server HTML, and it
 *  has to play for every visitor.
 *
 *  Timing is shared with the CSS around it. Words land 1.52s → 2.24s (after the intro gate); the
 *  supporting copy picks up at 0.60s (hero.css), and the pipeline starts at
 *  0.95s (--pipeline-start-delay). Change one, change the others.
 */

const NAME_WORDS = ['Jann', 'Carl', 'Dungo'];
const ROLE = 'Full-Stack Developer';

/* Matches --ease-out-soft in app/styles/base/variables.css. */
const EASE_OUT_SOFT = [0.33, 1, 0.68, 1] as const;

const headline = {
  hidden: {},
  shown: {
    /* 0.10s of its own, after --intro-lift (1.42s, variables.css) has
       let the intro gate finish. Kept as one number because motion
       cannot read a CSS custom property here. */
    transition: { delayChildren: 1.52, staggerChildren: 0.09 },
  },
};

const line = {
  hidden: { opacity: 0, y: 12 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT_SOFT },
  },
};

export function HeroHeadline() {
  const reduced = usePrefersReducedMotion();

  /* Reduced motion resolves to the finished headline. The matching CSS block
     in hero.css carries !important so the final state also wins on the first
     paint, before this hook's effect has run — inline styles from motion
     would otherwise show for a frame. */
  if (reduced) {
    return (
      <h1 className="hero-name" id="hero-heading">
        {NAME_WORDS.join(' ')}
        <span className="hero-role">{ROLE}</span>
      </h1>
    );
  }

  return (
    <LazyMotion features={domAnimation} strict>
      {/* If JS never runs, motion’s SSR inline opacity:0 would leave the
          name permanently invisible. This is the only safe net that does not
          fight motion: a CSS animation would outrank its inline styles in the
          cascade and take the reveal over entirely. */}
      <noscript>
        <style>{`.hero-word,.hero-role{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <m.h1
        className="hero-name"
        id="hero-heading"
        variants={headline}
        initial="hidden"
        animate="shown"
      >
        {NAME_WORDS.map((w) => (
          <m.span className="hero-word" variants={line} key={w}>
            {w}
          </m.span>
        ))}
        <m.span className="hero-role" variants={line}>
          {ROLE}
        </m.span>
      </m.h1>
    </LazyMotion>
  );
}
