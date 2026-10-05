'use client';

import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

const RESUME_URL = '/resume.pdf';
const RESUME_FILENAME = 'JannCarlDungo_Resume.pdf';

/** A résumé link that previews before it downloads.
 *
 *  Renders a real link to the PDF, so without JS (or on a modifier/middle
 *  click) it still opens the file. A plain click opens a modal preview with
 *  explicit Download and Open-in-new-tab actions. The iframe only mounts
 *  while the dialog is open, so the PDF isn't fetched on page load. The
 *  dialog is portalled to <body> so the sidebar's descendant styles can't
 *  reach it. */
export function ResumeLink({ className, children, ariaLabel }: { className?: string; children: ReactNode; ariaLabel?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    setOpen(true);
    dialogRef.current?.showModal();
  };

  const close = () => dialogRef.current?.close();

  return (
    <>
      <a href={RESUME_URL} className={className} aria-label={ariaLabel} aria-haspopup="dialog" onClick={onClick}>
        {children}
      </a>
      {mounted && createPortal(<dialog
        ref={dialogRef}
        className="resume-dialog"
        aria-labelledby={titleId}
        onClose={() => setOpen(false)}
        onClick={(event) => { if (event.target === event.currentTarget) close(); }}
      >
        <div className="resume-dialog-panel">
          <header className="resume-dialog-bar">
            <h2 id={titleId}>Résumé</h2>
            <div className="resume-dialog-actions">
              <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" className="resume-dialog-newtab">Open in new tab</a>
              <a href={RESUME_URL} download={RESUME_FILENAME} className="resume-dialog-download">Download PDF</a>
              <button type="button" onClick={close} aria-label="Close résumé preview">
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </button>
            </div>
          </header>
          <div className="resume-dialog-body">
            {open && <iframe src={`${RESUME_URL}#view=FitH`} title="Résumé preview (PDF)" />}
          </div>
          <p className="resume-dialog-fallback">
            Preview not showing? <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">Open the PDF</a> or download it above.
          </p>
        </div>
      </dialog>, document.body)}
    </>
  );
}
