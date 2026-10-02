'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { ProjectScreen } from '@/lib/content';

export function Gallery({ title, screens }: { title: string; screens: ProjectScreen[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  // The track stays a native scroll-snap strip (touch swipe, trackpad), so the
  // counter follows whichever slide is actually in view.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) setIndex(Number((entry.target as HTMLElement).dataset.index));
      }
    }, { root: track, threshold: 0.6 });
    track.querySelectorAll('figure').forEach(figure => observer.observe(figure));
    return () => observer.disconnect();
  }, [screens.length]);

  const go = (next: number) => {
    const track = trackRef.current;
    if (!track) return;
    const target = Math.max(0, Math.min(screens.length - 1, next));
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.children[target]?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'nearest', inline: 'start' });
  };

  if (!screens.length) return null;
  return <div className="pv-gallery-wrap">
    <div className="pv-gallery" ref={trackRef} tabIndex={0} aria-label={`${title} screenshots`} onKeyDown={event => {
      if (event.key === 'ArrowRight') { event.preventDefault(); go(index + 1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); go(index - 1); }
    }}>
      {screens.map((screen, i) => <figure key={screen.src} data-index={i}><Image src={screen.src} alt={`${title}: ${screen.label}`} width={1200} height={800} /><figcaption><strong>{screen.label}</strong>{screen.caption && <> — {screen.caption}</>}</figcaption></figure>)}
    </div>
    {screens.length > 1 && <div className="pv-gallery-controls">
      <span className="pv-gallery-count" aria-live="polite">{index + 1} / {screens.length}</span>
      <div>
        <button type="button" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous screenshot">←</button>
        <button type="button" onClick={() => go(index + 1)} disabled={index === screens.length - 1} aria-label="Next screenshot">→</button>
      </div>
    </div>}
  </div>;
}
