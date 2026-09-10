import { HeroPipeline } from '@/components/sections/HeroPipeline';
import { IntroStages } from '@/components/IntroStages';

/** The intro sequence: the delivery pipeline runs, cross-fades to a one-line
 *  statement of intent, then the whole cover lifts to reveal the homepage.
 *
 *  Server component. The stage machine inside is a client component, but
 *  HeroPipeline is passed to it as children so the pipeline itself stays
 *  server-rendered and is painted before any JS arrives.
 *
 *  The cover's fade-out is CSS (intro-gate.css), not motion, on purpose: an
 *  overlay that fails to lift hides the entire site, which is a far worse
 *  failure than a missed animation. CSS cannot fail that way, so the reveal is
 *  guaranteed even if JS never runs — in which case the visitor simply sees
 *  the pipeline and then the page, with no quote. AnimatePresence handles only
 *  the cross-fade between stages, where failing degrades gracefully.
 *
 *  Timing lives in intro-gate.css and --intro-lift (variables.css).
 */
export function HeroIntroGate() {
  return (
    <IntroStages>
      <HeroPipeline />
    </IntroStages>
  );
}
