import { HeroPipeline } from '@/components/sections/HeroPipeline';

/** The page-load intro: a full-screen cover that runs the delivery pipeline
 *  once (Idea → Deploy), cross-fades to a one-line statement of intent, then
 *  lifts to reveal the portfolio.
 *
 *  Deliberately a server component with no JS at all. A client-side gate would
 *  mount only after hydration, so the page would flash into view first and the
 *  cover would slam down on top of it — the exact thing a gate exists to
 *  prevent. Rendered in the server HTML it is already covering on first paint.
 *
 *  Both stages are always in the DOM, stacked in one grid cell; their
 *  cross-fade and the cover's own lift are plain CSS keyframes on the shared
 *  page-load clock (app/styles/components/intro-gate.css). No state machine,
 *  no AnimatePresence — an earlier `motion`-based version left the headline
 *  invisible and was reverted.
 *
 *  It never unmounts; the CSS ends on `visibility: hidden`, which takes it out
 *  of the accessibility tree and stops it swallowing clicks. It does not replay
 *  on client-side navigation back to the homepage — the element is still in the
 *  DOM with its animation finished.
 *
 *  Shown once per tab session: components/IntroGateController marks
 *  `data-intro-done` on <html> when the sequence ends and remembers it in
 *  sessionStorage; a pre-paint script in app/layout.tsx re-applies that on the
 *  next load so a reload skips straight to the page with no flash.
 *
 *  Timing lives in app/styles/components/intro-gate.css and is shared with the
 *  hero entrance via --intro-lift (app/styles/base/variables.css). Change one,
 *  change the others (and INTRO_MS in IntroGateController).
 */
export function HeroIntroGate() {
  return (
    <div className="intro-gate" aria-hidden="true">
      <div className="intro-gate-inner">
        <div className="intro-stage intro-stage-pipeline">
          <HeroPipeline />
        </div>
        <div className="intro-stage intro-stage-line">
          {/* Drawn from the About bio: "building structured systems end to end"
              + "most of what I know comes from shipping real things". */}
          <p className="intro-line">Built end to end, learned by shipping.</p>
        </div>
      </div>
    </div>
  );
}
