'use client';

import { useEffect, useRef } from 'react';
import { NAV_SECTIONS, SECTION_IDS } from '@/lib/sections';
import { useActiveSection } from '@/lib/useActiveSection';
import { useTheme } from './ThemeProvider';

const SunIcon = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
const MoonIcon = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
  </svg>
);

/**
 * The Index — a persistent left rail (a bottom bar on small screens) that
 * reads like a file's line-number gutter, matching the site's `// comment`
 * section labels and the jann.js card. Collapsed it shows only the numbered
 * sections and a spine whose fill IS the scroll progress — there is no
 * separate top progress bar. It opens on hover or keyboard focus to reveal
 * the labels.
 *
 * Reuses lib/useActiveSection for the active-section read and the same
 * rAF-batched scroll measurement the old top nav used for its progress bar,
 * written straight to a CSS variable (--sn-p) so scrolling never renders.
 */
export function SideNav() {
  const { theme, toggleTheme } = useTheme();
  const active = useActiveSection(SECTION_IDS);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ticking = false;

    function apply() {
      ticking = false;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const ratio = scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0;
      navRef.current?.style.setProperty('--sn-p', ratio.toFixed(4));
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(apply);
    }

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <nav ref={navRef} className="side-nav" aria-label="Section navigation">
      <a
        href="#home"
        className="side-nav-home"
        data-active={active === 'home' ? '' : undefined}
        aria-label="Jann Carl Dungo — back to top"
      >
        <span className="side-nav-mark" aria-hidden="true">JD</span>
      </a>

      <div className="side-nav-index">
        <div className="side-nav-list">
          <span className="side-nav-spine" aria-hidden="true">
            <span className="side-nav-spine-fill" />
          </span>

          <ol className="side-nav-rows">
            {NAV_SECTIONS.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="side-nav-item"
                  data-active={active === s.id ? '' : undefined}
                  aria-current={active === s.id ? 'true' : undefined}
                >
                  <span className="side-nav-node" aria-hidden="true" />
                  <span className="side-nav-num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="side-nav-label">{s.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="side-nav-foot">
        <button
          type="button"
          className="side-nav-theme"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? SunIcon : MoonIcon}
        </button>
      </div>
    </nav>
  );
}
