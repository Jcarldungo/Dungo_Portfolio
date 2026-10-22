'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import './project-fan.css';

export type FanItem = {
  slug: string;
  title: string;
  category: string;
  status: 'live' | 'client' | 'in-progress' | 'concept';
  summary: string;
  image?: string;
  tech: string[];
  external?: { href: string; label: string };
};

const statusLabel: Record<FanItem['status'], string> = {
  live: 'Live', client: 'Client work', 'in-progress': 'In progress', concept: 'Concept',
};

const SWIPE_DISTANCE = 48;
const SWIPE_CLICK_WINDOW = 120;

/** Signed distance from the active card, wrapped so the deck is circular. */
function offsetOf(index: number, active: number, count: number) {
  const half = Math.floor(count / 2);
  return ((index - active + count + half) % count) - half;
}

export function ProjectFan({ items }: { items: FanItem[] }) {
  const count = items.length;
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState(0);
  const dragStart = useRef<number | null>(null);
  const swipedAt = useRef(0);

  const go = (next: number) => {
    const target = (next + count) % count;
    if (target === active) return;
    setPrevious(active);
    setActive(target);
  };

  // A card that wraps from one end of the deck to the other would sweep
  // across the stack; it repositions without a transition instead.
  const step = Math.min(Math.abs(active - previous), count - Math.abs(active - previous));
  const wrapped = (index: number) =>
    Math.abs(offsetOf(index, active, count) - offsetOf(index, previous, count)) !== step;

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); go(active - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); go(active + 1); }
  };

  const onPointerDown = (event: React.PointerEvent) => { dragStart.current = event.clientX; };
  const onPointerUp = (event: React.PointerEvent) => {
    const start = dragStart.current;
    dragStart.current = null;
    if (start === null) return;
    const delta = event.clientX - start;
    if (Math.abs(delta) < SWIPE_DISTANCE) return;
    swipedAt.current = event.timeStamp;
    go(active + (delta < 0 ? 1 : -1));
  };
  // The click that follows a swipe must not open the card the swipe started on.
  const swallowSwipeClick = (event: React.MouseEvent) => {
    if (event.timeStamp - swipedAt.current < SWIPE_CLICK_WINDOW) { event.preventDefault(); event.stopPropagation(); }
  };

  return <div className="pv-fan" role="group" aria-roledescription="carousel" aria-label="Projects" onKeyDown={onKeyDown}>
    <div className="pv-fan-stage" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => { dragStart.current = null; }} onClickCapture={swallowSwipeClick}>
      {items.map((item, index) => {
        const offset = offsetOf(index, active, count);
        const current = offset === 0;
        const pos = Math.max(-3, Math.min(3, offset));
        return <article className="pv-fan-card" key={item.slug} data-pos={pos} data-current={current || undefined} data-wrapped={wrapped(index) || undefined} aria-hidden={current ? undefined : true} aria-roledescription="slide" aria-label={`${index + 1} of ${count}`}>
          <div className="pv-fan-inner" inert={!current}>
            <div className="pv-fan-meta">
              <span>{String(index + 1).padStart(2, '0')} · {item.category}</span>
              <span className="pv-fan-status" data-status={item.status}>{statusLabel[item.status]}</span>
            </div>
            <div className="pv-fan-head">
              <h3>{item.title}</h3>
              {item.image && <Image src={item.image} alt="" width={88} height={64} />}
            </div>
            <p className="pv-fan-summary">{item.summary}</p>
            <p className="pv-fan-tech">{item.tech.join(' · ')}</p>
            <div className="pv-fan-foot">
              <Link className="pv-fan-case" href={`/projects/${item.slug}`}>Case study <span aria-hidden="true">→</span></Link>
              {item.external && <a className="pv-fan-ext" href={item.external.href} target="_blank" rel="noopener noreferrer">{item.external.label} <span aria-hidden="true">↗</span></a>}
            </div>
          </div>
          {!current && Math.abs(offset) < 3 && <button type="button" className="pv-fan-hit" tabIndex={-1} onClick={() => go(index)} aria-label={`Show ${item.title}`} />}
        </article>;
      })}
    </div>
    <div className="pv-fan-controls">
      <button type="button" className="pv-fan-step" onClick={() => go(active - 1)} aria-label="Previous project"><span aria-hidden="true">←</span> Prev</button>
      <div className="pv-fan-pager">
        <span className="pv-fan-count"><strong>{String(active + 1).padStart(2, '0')}</strong> / {String(count).padStart(2, '0')}</span>
        <div className="pv-fan-dots">{items.map((item, index) => <button type="button" key={item.slug} className="pv-fan-dot" aria-label={`Show ${item.title}`} aria-current={index === active || undefined} onClick={() => go(index)} />)}</div>
      </div>
      <button type="button" className="pv-fan-step" onClick={() => go(active + 1)} aria-label="Next project">Next <span aria-hidden="true">→</span></button>
    </div>
    <p className="sr-only" aria-live="polite">{`Project ${active + 1} of ${count}: ${items[active].title}`}</p>
  </div>;
}
