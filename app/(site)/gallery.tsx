'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { ProjectScreen } from '@/lib/content';

export function Gallery({ title, screens }: { title: string; screens: ProjectScreen[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  // The live index, readable mid-event: two presses in a row must step 1 → 2 → 3,
  // not both read the index from before the first re-render.
  const indexRef = useRef(0);
  const show = (i: number) => { indexRef.current = i; setIndex(i); };

  // The track stays a native scroll-snap strip (touch swipe, trackpad), so the
  // counter follows whichever slide is actually in view.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        indexRef.current = Number((entry.target as HTMLElement).dataset.index);
        setIndex(indexRef.current);
      }
    }, { root: track, threshold: 0.6 });
    track.querySelectorAll('figure').forEach(figure => observer.observe(figure));
    return () => observer.disconnect();
  }, [screens.length]);

  // Commit the index on press rather than when the scroll lands, and scroll only the
  // track: scrollIntoView could also drag the page when the strip is half off-screen.
  const step = (delta: number) => {
    const track = trackRef.current;
    const target = Math.max(0, Math.min(screens.length - 1, indexRef.current + delta));
    const figure = track?.children[target];
    if (!track || !figure || target === indexRef.current) return;
    show(target);
    const left = figure.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' });
  };

  if (!screens.length) return null;
  return <div className="pv-gallery-wrap">
    <div className="pv-gallery" ref={trackRef} tabIndex={0} aria-label={`${title} screenshots`} onKeyDown={event => {
      if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
    }}>
      {screens.map((screen, i) => <figure key={screen.src} data-index={i}><Image src={screen.src} alt={`${title}: ${screen.label}`} width={1200} height={800} /><figcaption><strong>{screen.label}</strong>{screen.caption && <> — {screen.caption}</>}</figcaption></figure>)}
    </div>
    {screens.length > 1 && <div className="pv-gallery-controls">
      <span className="pv-gallery-count" aria-live="polite">{index + 1} / {screens.length}</span>
      <div>
        <button type="button" onClick={() => step(-1)} disabled={index === 0} aria-label="Previous screenshot"><Arrow d="M19 12H5 M12 19l-7-7 7-7" /></button>
        <button type="button" onClick={() => step(1)} disabled={index === screens.length - 1} aria-label="Next screenshot"><Arrow d="M5 12h14 M12 5l7 7-7 7" /></button>
      </div>
    </div>}
  </div>;
}

// Same geometry and stroke as the sidebar icon set.
function Arrow({ d }: { d: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;
}
