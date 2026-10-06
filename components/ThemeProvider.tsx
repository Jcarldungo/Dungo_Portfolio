'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';

type Theme = 'dark' | 'light';

const STORAGE_KEY = 'portfolio-theme';

/** Stored choice wins; otherwise follow the OS preference (dark if unknown).
 *  Mirrors the pre-paint script in app/layout.tsx. */
function resolveTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* ignore */
  }
  if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

type Origin = { x: number; y: number };

const ThemeContext = createContext<{ theme: Theme; toggleTheme: (origin?: Origin) => void } | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const transitioning = useRef(false);

  useEffect(() => {
    const resolved = resolveTheme();
    setTheme(resolved);
    document.documentElement.setAttribute('data-theme', resolved);

    // Follow live OS changes until the visitor makes an explicit choice.
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = () => {
      try {
        if (localStorage.getItem(STORAGE_KEY)) return;
      } catch {
        /* ignore */
      }
      const next: Theme = mq.matches ? 'light' : 'dark';
      setTheme(next);
      document.documentElement.setAttribute('data-theme', next);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  /** Switch theme. With an origin and View Transitions support, the new
   *  theme is revealed as a circle growing from that point (the keyframes
   *  live in styles/components/theme-transition.css). Otherwise, and under
   *  reduced motion, it switches instantly. */
  function toggleTheme(origin?: Origin) {
    if (transitioning.current) return;
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    const apply = () => {
      flushSync(() => setTheme(next));
      document.documentElement.setAttribute('data-theme', next);
    };
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }

    const doc = document as Document & { startViewTransition?: (cb: () => void) => {
      ready: Promise<void>; finished: Promise<void>; updateCallbackDone: Promise<void>;
    } };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!origin || !doc.startViewTransition || reduce) {
      apply();
      return;
    }
    const root = document.documentElement;
    const radius = Math.hypot(Math.max(origin.x, innerWidth - origin.x), Math.max(origin.y, innerHeight - origin.y));
    root.style.setProperty('--theme-x', `${origin.x}px`);
    root.style.setProperty('--theme-y', `${origin.y}px`);
    root.style.setProperty('--theme-r', `${radius}px`);
    transitioning.current = true;
    root.setAttribute('data-theme-transition', '');
    const cleanup = () => {
      transitioning.current = false;
      root.removeAttribute('data-theme-transition');
    };
    try {
      const transition = doc.startViewTransition(apply);
      // A hidden tab or interrupted snapshot can skip the animation while
      // still applying the theme. Consume that expected rejection.
      void transition.ready.catch(() => {});
      void transition.updateCallbackDone.catch(() => apply());
      void transition.finished.then(cleanup, cleanup);
    } catch {
      apply();
      cleanup();
    }
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
