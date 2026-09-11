import type { ReactNode } from 'react';
import { services } from '@/lib/content';

/** Stroke glyphs, one per service — drawn in the same style as the hero
 *  pipeline's icons (components/sections/HeroPipeline.tsx): 24×24 viewBox,
 *  currentColor stroke, no fill. Kept here rather than in lib/content.ts
 *  because they're presentation, not data — a JSX value has no business
 *  sitting next to the copy that content-authoring edits. Keyed by the
 *  service's `index` so a reordering in content.ts can't silently pair a
 *  row with the wrong glyph. */
const SERVICE_ICONS: Record<string, ReactNode> = {
  // 01 — Full-Stack Web Development: a browser window over code brackets.
  '01': (
    <>
      <path d="M3.5 5.5a1 1 0 0 1 1-1h15a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1v-13Z" />
      <path d="M3.5 9h17" />
      <path d="M9.5 12.5 7 15l2.5 2.5" />
      <path d="M14.5 12.5 17 15l-2.5 2.5" />
    </>
  ),
  // 02 — System Design & Architecture: three connected nodes, a blueprint.
  '02': (
    <>
      <circle cx="6" cy="6.2" r="2.1" />
      <circle cx="18" cy="6.2" r="2.1" />
      <circle cx="12" cy="18" r="2.1" />
      <path d="M7.85 7.5 10.3 16M16.15 7.5 13.7 16M8.1 6.2h7.8" />
    </>
  ),
  // 03 — Database Management: a stacked cylinder.
  '03': (
    <>
      <path d="M12 5c4.14 0 7.5 1.12 7.5 2.5S16.14 10 12 10 4.5 8.88 4.5 7.5 7.86 5 12 5Z" />
      <path d="M4.5 7.5V12c0 1.38 3.36 2.5 7.5 2.5s7.5-1.12 7.5-2.5V7.5" />
      <path d="M4.5 12v4.5c0 1.38 3.36 2.5 7.5 2.5s7.5-1.12 7.5-2.5V12" />
    </>
  ),
  // 04 — API Development & Integration: a plug, current flowing through it.
  '04': (
    <>
      <path d="M9 2.5v5M15 2.5v5" />
      <path d="M6 7.5h12v3a6 6 0 0 1-12 0v-3Z" />
      <path d="M12 16.5V21" />
    </>
  ),
  // 05 — Client Websites: a globe, the browser's own.
  '05': (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.8 2.4 4.3 5.3 4.3 8.5s-1.5 6.1-4.3 8.5c-2.8-2.4-4.3-5.3-4.3-8.5S9.2 5.9 12 3.5Z" />
    </>
  ),
  // 06 — Business & Internal Tools: a dashboard grid.
  '06': (
    <>
      <path d="M4 4.5h7v7H4v-7Z" />
      <path d="M13 4.5h7v4.5h-7v-4.5Z" />
      <path d="M13 11.5h7v8h-7v-8Z" />
      <path d="M4 14h7v5.5H4V14Z" />
    </>
  ),
};

/** What I can help with — six kinds of work, each provable from the
 *  Projects or Experience section below (see the comment above `services`
 *  in lib/content.ts for exactly which). A numbered row list rather than a
 *  card grid: denser, and the number doubles as the same register the rest
 *  of the page already uses in Experience's timeline. Deliberately not an
 *  agency service menu: no pricing, no packages, no invented metrics. */
export function ServicesSection() {
  return (
    <section id="services" className="section" aria-labelledby="services-title">
      <div className="container">
        <div className="section-head reveal">
          <div className="section-label"><span className="c-comment">{'// '}</span>how i can help</div>
          <h2 className="section-title" id="services-title">
            Where I Can <span className="title-em">Help</span>
          </h2>
          <p className="section-subtitle">
            Six kinds of work — each one backed by something real elsewhere on this page, not a claim on its own.
          </p>
        </div>

        <ol className="services-list reveal">
          {services.map((service) => (
            <li key={service.index} className="service-row">
              <span className="service-index" aria-hidden="true">{service.index}</span>
              <span className="service-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  focusable="false"
                >
                  {SERVICE_ICONS[service.index]}
                </svg>
              </span>
              <span className="service-body">
                <h3 className="service-title">{service.title}</h3>
                <p className="service-desc">{service.description}</p>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
