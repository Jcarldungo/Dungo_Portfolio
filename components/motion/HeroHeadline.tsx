/** The hero headline, revealed word by word.
 *
 *  This was a Framer Motion (`LazyMotion`/`m`) staggerChildren tree. It is CSS
 *  now, for one decisive reason: motion writes `opacity: 0` into the server
 *  HTML and only clears it once JS has hydrated AND a requestAnimationFrame
 *  has fired. When either did not happen, the headline — this page's LCP
 *  element, and the owner's own name — stayed invisible while the rest of the
 *  hero animated in around the gap.
 *
 *  A CSS animation cannot fail that way: no JS, no rAF, and it runs on the
 *  first paint rather than after hydration. It also takes / back down from
 *  45.5 kB of route JS to a few hundred bytes, since nothing here pulls in
 *  motion any more.
 *
 *  Same visual contract as before: 90ms stagger, opacity 0→1, y 12px→0,
 *  ease-out. Timing now lives entirely in hero.css off --intro-lift, so there
 *  is no JS constant left to keep in sync with the CSS.
 *
 *  No 'use client' — this is a server component again.
 */

const NAME_WORDS = ['Jann', 'Carl', 'Dungo'];
const ROLE = 'Full-Stack Developer';

export function HeroHeadline() {
  return (
    <h1 className="hero-name" id="hero-heading">
      {/* data-word drives the per-word delay in hero.css, mirroring the
          data-step pattern the pipeline already uses. */}
      {NAME_WORDS.map((w, i) => (
        <span className="hero-word" data-word={i + 1} key={w}>
          {w}
        </span>
      ))}
      <span className="hero-role" data-word={NAME_WORDS.length + 1}>
        {ROLE}
      </span>
    </h1>
  );
}
