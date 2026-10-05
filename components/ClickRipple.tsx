'use client';

import { useEffect } from 'react';

/** A ring that expands from the pointer on each mouse press.
 *
 *  Desktop mouse only, the same gate as the outlined cursor in cursor.css:
 *  touch already has its own native feedback. Each press appends one span
 *  that runs a CSS keyframe (transform + opacity) and removes itself, so
 *  there is no rAF loop. Under reduced motion nothing is drawn. */
export function ClickRipple() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 769px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      if (!fine.matches || reduce.matches) return;
      const ring = document.createElement('span');
      ring.className = 'click-ripple';
      ring.setAttribute('aria-hidden', 'true');
      ring.style.left = `${event.clientX}px`;
      ring.style.top = `${event.clientY}px`;
      ring.addEventListener('animationend', () => ring.remove(), { once: true });
      document.body.appendChild(ring);
    };

    window.addEventListener('pointerdown', onDown, { passive: true });
    return () => window.removeEventListener('pointerdown', onDown);
  }, []);

  return null;
}
