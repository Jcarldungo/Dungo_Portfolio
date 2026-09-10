import type { ReactNode } from 'react';

/** Software delivery lifecycle, left to right. The sweep, the check badges and
 *  the status readout are pure CSS on one shared 7s clock — no client JS, no
 *  hydration cost, because the hero is above the fold and this is decoration.
 *  Phase locking is the whole trick: every animated part runs the same
 *  `--pipeline-cycle` duration with no delay, so the badge for a node always
 *  lands on the frame the sweep arrives. */

type Step = { label: string; icon: ReactNode };

/* Stroke glyphs rather than simple-icons brand marks (see components/TechIcon.tsx
   — that set is vendor logos only). 24×24, currentColor, so they inherit the
   node's accent state for free. */
const STEPS: Step[] = [
  {
    label: 'Idea',
    icon: (
      <>
        <path d="M12 2.5a6.5 6.5 0 0 0-3.7 11.85V16.5h7.4v-2.15A6.5 6.5 0 0 0 12 2.5Z" />
        <path d="M9.75 19.5h4.5M10.5 22h3" />
      </>
    ),
  },
  {
    label: 'Code',
    icon: (
      <>
        <path d="m15.5 17.5 5.5-5.5-5.5-5.5" />
        <path d="m8.5 6.5-5.5 5.5 5.5 5.5" />
      </>
    ),
  },
  {
    label: 'Test',
    icon: (
      <>
        <path d="M9.5 2.5v6.2L4.9 16.9A2 2 0 0 0 6.65 20h10.7a2 2 0 0 0 1.75-3.1L14.5 8.7V2.5" />
        <path d="M8.5 2.5h7M7.6 14.5h8.8" />
      </>
    ),
  },
  {
    label: 'Deploy',
    icon: (
      <>
        <path d="M4 16.5v2.5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2.5" />
        <path d="m8.25 8.25 3.75-3.75 3.75 3.75" />
        <path d="M12 4.5v11.5" />
      </>
    ),
  },
];

const STATUSES = ['Planning', 'Building…', 'Running tests…', 'Deployed'];

export function HeroPipeline() {
  return (
    <div className="hero-pipeline">
      <div className="pipeline-flow">
        {/* Rail is a sibling of the list, not a child — <ol> may only contain <li>. */}
        <div className="pipeline-rail" aria-hidden="true">
          <span className="pipeline-progress" />
        </div>

        <ol className="pipeline-track">
          {STEPS.map((step, i) => (
            <li className="pipeline-step" key={step.label} data-step={i + 1}>
              <span className="pipeline-node">
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  {step.icon}
                </svg>
                {/* Decorative: the step name below already carries the meaning. */}
                <span className="pipeline-badge" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="11"
                    height="11"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="m4.5 12.5 5 5 10-11" />
                  </svg>
                </span>
              </span>
              <span className="pipeline-label">{step.label}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Cycling text is decorative — no aria-live, or it would re-announce every
          7s. The static line below is what assistive tech actually reads. */}
      <p className="pipeline-status" aria-hidden="true">
        {STATUSES.map((s, i) => (
          <span className="pipeline-status-state" key={s} data-state={i + 1}>
            {s}
          </span>
        ))}
      </p>
      <p className="sr-only">Continuous delivery pipeline: idea, code, test, deploy.</p>
    </div>
  );
}
