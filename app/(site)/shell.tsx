'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { publishedProjects, siteInfo, techToolCount } from '@/lib/content';
const links = [['/projects', 'Projects', 'grid'], ['/stack', 'Stack', 'stack'], ['/about', 'More about me', 'user'], ['/experience', 'Experience & credentials', 'briefcase']];
export function PreviewShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [light, setLight] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!mobileOpen) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMobileOpen(false); menuRef.current?.focus(); }
      if (event.key === 'Tab') {
        const items = document.querySelectorAll<HTMLElement>('#preview-sidebar a, #preview-sidebar button');
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);
  const closeMenu = () => setMobileOpen(false);
  return <div className={`pv pv-sidebar-layout${light ? ' pv-light' : ''}${collapsed ? ' pv-collapsed' : ''}${mobileOpen ? ' pv-menu-open' : ''}`}>
    <a className="pv-skip" href="#preview-main">Skip to content</a>
    <header className="pv-mobile-bar"><button ref={menuRef} aria-label="Open menu" aria-expanded={mobileOpen} aria-controls="preview-sidebar" onClick={() => { setMobileOpen(!mobileOpen); setCollapsed(false); }}>☰</button><Link href="/">Jann Carl Dungo</Link><span className="pv-mobile-status"><i className="pv-dot" />Open to work</span></header>
    {collapsed && <button className="pv-expand" aria-label="Expand sidebar" onClick={() => setCollapsed(false)}>☰</button>}
    {mobileOpen && <button className="pv-backdrop" onClick={closeMenu} aria-label="Close navigation" />}
    <aside className="pv-sidebar" id="preview-sidebar" aria-label="Sidebar">
      <div className="pv-sidebar-inner">
      <div className="pv-sidebar-head"><Link href="/" onClick={closeMenu}>Jann Carl Dungo</Link><button ref={closeRef} aria-label="Collapse sidebar" onClick={() => { setCollapsed(true); setMobileOpen(false); menuRef.current?.focus(); }}><SidebarIcon type="panel" /></button></div>
      <Link className="pv-sidebar-contact" href="/contact" onClick={closeMenu}><SidebarIcon type="mail" />Contact</Link>
      <nav className="pv-side-nav" aria-label="Portfolio"><span className="pv-side-label">Explore</span><Link href="/resources" onClick={closeMenu} aria-current={pathname === '/resources' ? 'page' : undefined}><SidebarIcon type="resources" /><span>Resources</span></Link><span className="pv-side-label pv-side-group">Work with me</span><Link href="/services" onClick={closeMenu} aria-current={pathname === '/services' ? 'page' : undefined}><SidebarIcon type="briefcase" /><span>Services</span></Link><span className="pv-side-label pv-side-group">Portfolio</span>{links.map(([url, title, icon]) => <Link key={url} href={url} onClick={closeMenu} aria-current={pathname === url || (url.endsWith('projects') && pathname.includes('/projects/')) ? 'page' : undefined}><SidebarIcon type={icon} /><span>{title}</span>{title === 'Projects' && <small>{String(publishedProjects.length).padStart(2,'0')}</small>}{title === 'Stack' && <small>{techToolCount}</small>}</Link>)}</nav>
      <div className="pv-side-bottom"><a className="pv-sidebar-resume" href="/resume.pdf" download>Résumé (PDF)<span>↓</span></a><p className="pv-side-available"><i className="pv-dot" />Open to internships &amp; freelance work</p><div className="pv-side-tools"><span>Pampanga, PH<small>GMT+8</small></span><button onClick={() => setLight(!light)} aria-label={`Switch to ${light ? 'dark' : 'light'} mode`}>◐</button><a href={`mailto:${siteInfo.email}`} aria-label="Email"><SidebarIcon type="mail" /></a><a href={siteInfo.github} aria-label="GitHub" target="_blank" rel="noreferrer"><SidebarIcon type="github" /></a><a href={siteInfo.linkedin} aria-label="LinkedIn" target="_blank" rel="noreferrer">in</a></div></div>
      </div>
    </aside>
    <div className="pv-content-shell"><main id="preview-main" className="pv-main">{children}</main><footer className="pv-footer"><div><a href={siteInfo.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><a href={siteInfo.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={`mailto:${siteInfo.email}`}>Email ↗</a></div><span>© {new Date().getFullYear()} {siteInfo.name}</span></footer></div>
  </div>;
}
function SidebarIcon({ type }: { type: string }) {
  const paths: Record<string,string> = {
    panel:'M9 4v16 M4 4h16v16H4z', mail:'M3 5h18v14H3z M3 6l9 7 9-7',
    resources:'M5 3h14v18H5z M8 7h8 M8 11h8 M8 15h5',
    home:'M3 10l9-7 9 7 M5 9v12h14V9 M9 21v-8h6v8',
    grid:'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
    stack:'M2 7l10-5 10 5-10 5z M2 12l10 5 10-5 M2 17l10 5 10-5',
    user:'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M4 21v-2a8 8 0 0 1 16 0v2',
    briefcase:'M3 7h18v14H3z M8 7V3h8v4 M3 12h18',
    github:'M9 20c-4 1-4-2-6-2 M15 22v-4c0-1-.3-2-1-2 4 0 6-2 6-6a5 5 0 0 0-1-3c0-1 0-3-1-4-2 0-3 1-4 1h-4C9 3 7 3 6 3c-1 1-1 3-1 4a5 5 0 0 0-1 3c0 4 2 6 6 6-1 0-1 1-1 2v4',
  };
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[type] ?? paths.grid} /></svg>;
}

