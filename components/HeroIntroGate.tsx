import { HeroPipeline } from '@/components/sections/HeroPipeline';

/** The delivery pipeline as a cover screen: it runs Idea → Deploy once, then
 *  lifts to reveal the portfolio.
 *
 *  Deliberately a server component with no JS at all. A client-side gate would
 *  mount only after hydration, so the page would flash into view first and the
 *  cover would slam down on top of it — the exact thing a gate exists to
 *  prevent. Rendered in the server HTML it is already covering on first paint.
 *
 *  It never unmounts; the CSS ends on `visibility: hidden`, which also takes
 *  it out of the accessibility tree and stops it swallowing clicks. That means
 *  it plays once per full page load and does not replay on client-side
 *  navigation back to the homepage — the element is still in the DOM with its
 *  animation finished.
 *
 *  Timing lives in app/styles/components/intro-gate.css and is shared with the
 *  hero entrance via --intro-lift. Change one, change the others.
 */
export function HeroIntroGate() {
  return (
    <div className="intro-gate" aria-hidden="true">
      <div className="intro-gate-inner">
        <HeroPipeline />
      </div>
    </div>
  );
}
