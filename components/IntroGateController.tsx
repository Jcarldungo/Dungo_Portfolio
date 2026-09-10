'use client';

import { useEffect } from 'react';

/** Belt-and-braces for the CSS page-load intro (app/styles/components/intro-gate.css).
 *
 *  The gate covers on first paint and lifts itself with a pure-CSS animation
 *  ending on visibility:hidden — this component does NOT drive that. It only
 *  does two things after the fact, and if it never runs (JS off, error) the
 *  intro simply plays and lifts on its own:
 *
 *   1. When the sequence is over it sets `data-intro-done` on <html>, and CSS
 *      then display:none's the gate — so nothing can leave a dead full-screen
 *      overlay on top of the page.
 *   2. It records `intro-seen` for the tab session, so a reload or a return to
 *      the tab skips straight to the page (the pre-paint script in layout.tsx
 *      reads the flag). A forced full-screen sequence is a first-visit thing,
 *      not something you sit through on every navigation.
 */

const SEEN_KEY = 'intro-seen';
/* Wait out the WHOLE first-load sequence before flipping data-intro-done: the
   gate lift ends ~3.75s but the hero entrance it triggers (hero.css, timed off
   --intro-lift) is still settling until ~4.65s, and flipping the attribute
   collapses --intro-lift to 0 — do that mid-entrance and elements still
   animating would jump. */
const INTRO_MS = 5000;

export function IntroGateController() {
  useEffect(() => {
    const root = document.documentElement;

    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {
      /* storage blocked (private mode) — treat as first visit */
    }

    if (seen) {
      root.setAttribute('data-intro-done', '');
      return;
    }

    const t = window.setTimeout(() => {
      root.setAttribute('data-intro-done', '');
      try {
        sessionStorage.setItem(SEEN_KEY, '1');
      } catch {
        /* ignore */
      }
    }, INTRO_MS);

    return () => window.clearTimeout(t);
  }, []);

  return null;
}
