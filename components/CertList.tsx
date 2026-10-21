'use client';

import { useState } from 'react';
import type { Certification } from '@/lib/content';

/** How many rows show before "See all". The list is newest first, so the
 *  collapsed view is the most recent credentials. */
const VISIBLE = 5;

const CheckIcon = (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1.1 14.4l-4-4 1.4-1.4 2.6 2.6 5.6-5.6L17.9 9l-7 7.4z" />
  </svg>
);

export function CertList({ certifications }: { certifications: Certification[] }) {
  const [expanded, setExpanded] = useState(false);
  const hidden = certifications.length - VISIBLE;
  const shown = expanded || hidden <= 0 ? certifications : certifications.slice(0, VISIBLE);

  return (
    <>
      <ol className="cert-list" id="cert-list">
        {shown.map((cert) => (
          <li key={cert.name} className="cert-row">
            <a href={cert.verifyUrl} target="_blank" rel="noopener" className="cert-row-link">
              <span className="cert-issuer">
                <span className="cert-dot" aria-hidden="true" />
                {cert.issuerShort}
              </span>
              <span className="cert-name">{cert.name}</span>
              <span className="cert-tag">{cert.category}</span>
              <span className="cert-date">{cert.date}</span>
              <span className="cert-check">
                {CheckIcon}
                <span className="sr-only">Verified — opens the issuer&apos;s record</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
      {hidden > 0 && (
        <button
          type="button"
          className="cert-more"
          aria-expanded={expanded}
          aria-controls="cert-list"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show fewer' : `See all ${certifications.length} certifications`}
          <span className="cert-more-icon" aria-hidden="true">{expanded ? '↑' : '↓'}</span>
        </button>
      )}
    </>
  );
}
