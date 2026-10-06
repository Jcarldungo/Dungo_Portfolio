'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { publishedProjects, siteInfo, techToolCount } from '@/lib/content';
import { useTheme } from '@/components/ThemeProvider';
const links = [['/projects', 'Projects', 'grid'], ['/stack', 'Stack', 'stack'], ['/about', 'More about me', 'user'], ['/experience', 'Experience & credentials', 'award']];
export function PreviewShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const light = theme === 'light';
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
  return <div className={`pv pv-sidebar-layout${collapsed ? ' pv-collapsed' : ''}${mobileOpen ? ' pv-menu-open' : ''}`}>
    <a className="pv-skip" href="#preview-main">Skip to content</a>
    <header className="pv-mobile-bar"><button ref={menuRef} aria-label="Open menu" aria-expanded={mobileOpen} aria-controls="preview-sidebar" onClick={() => { setMobileOpen(!mobileOpen); setCollapsed(false); }}><SidebarIcon type="menu" /></button><Link href="/">Jann Carl Dungo</Link><span className="pv-mobile-status"><i className="pv-dot" />Open to work</span></header>
    {collapsed && <button className="pv-expand" aria-label="Expand sidebar" onClick={() => setCollapsed(false)}><SidebarIcon type="panel" /></button>}
    {mobileOpen && <button className="pv-backdrop" onClick={closeMenu} aria-label="Close navigation" />}
    <aside className="pv-sidebar" id="preview-sidebar" aria-label="Sidebar">
      <div className="pv-sidebar-inner">
      <div className="pv-sidebar-head"><Link href="/" onClick={closeMenu}>Jann Carl Dungo</Link><button ref={closeRef} aria-label="Collapse sidebar" onClick={() => { setCollapsed(true); setMobileOpen(false); menuRef.current?.focus(); }}><SidebarIcon type="panel" /></button></div>
      <Link className="pv-sidebar-contact" href="/contact" onClick={closeMenu}><SidebarIcon type="mail" />Contact</Link>
      <nav className="pv-side-nav" aria-label="Portfolio"><span className="pv-side-label">Explore</span><Link href="/resources" onClick={closeMenu} aria-current={pathname === '/resources' ? 'page' : undefined}><SidebarIcon type="resources" /><span>Resources</span></Link><span className="pv-side-label pv-side-group">Work with me</span><Link href="/services" onClick={closeMenu} aria-current={pathname === '/services' ? 'page' : undefined}><SidebarIcon type="briefcase" /><span>Services</span></Link><span className="pv-side-label pv-side-group">Portfolio</span>{links.map(([url, title, icon]) => <Link key={url} href={url} onClick={closeMenu} aria-current={pathname === url || (url.endsWith('projects') && pathname.includes('/projects/')) ? 'page' : undefined}><SidebarIcon type={icon} /><span>{title}</span>{title === 'Projects' && <small>{String(publishedProjects.length).padStart(2,'0')}</small>}{title === 'Stack' && <small>{techToolCount}</small>}</Link>)}</nav>
      <div className="pv-side-bottom"><div className="pv-side-status"><p><strong><i className="pv-dot" />Open to work</strong><span>Pampanga, PH</span></p></div><div className="pv-side-foot"><span>GMT+8</span><button onClick={(event) => { const r = event.currentTarget.getBoundingClientRect(); toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 }); }} aria-label={`Switch to ${light ? 'dark' : 'light'} mode`}><SidebarIcon type="contrast" /></button><a href={`mailto:${siteInfo.email}`} aria-label="Email"><SidebarIcon type="mail" /></a><a href={siteInfo.github} aria-label="GitHub" target="_blank" rel="noreferrer"><SidebarIcon type="github" /></a><a href={siteInfo.linkedin} aria-label="LinkedIn" target="_blank" rel="noreferrer"><SidebarIcon type="linkedin" /></a></div></div>
      </div>
    </aside>
    <div className="pv-content-shell"><main id="preview-main" className="pv-main">{children}</main><footer className="pv-footer"><div><a href={siteInfo.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><a href={siteInfo.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={`mailto:${siteInfo.email}`}>Email ↗</a></div><span>© {new Date().getFullYear()} {siteInfo.name}</span></footer></div>
  </div>;
}
function SidebarIcon({ type }: { type: string }) {
  // One family (Lucide geometry, 1.5 stroke, rounded corners) so nav, controls and social marks read as a set.
  const paths: Record<string,string> = {
    panel:'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M9 3v18',
    menu:'M4 7h16 M4 12h16 M4 17h16',
    mail:'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7',
    resources:'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z M14 2v4a2 2 0 0 0 2 2h4 M16 13H8 M16 17H8 M10 9H8',
    home:'M3 10l9-7 9 7 M5 9v12h14V9 M9 21v-8h6v8',
    grid:'M4 3h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z M15 3h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z M15 14h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1z M4 14h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1z',
    stack:'M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12 M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17',
    user:'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
    briefcase:'M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16 M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z',
    award:'M6 8a6 6 0 1 0 12 0 6 6 0 1 0-12 0 M15.48 12.89l1.51 8.53a.5.5 0 0 1-.81.47l-3.58-2.69a1 1 0 0 0-1.2 0l-3.59 2.69a.5.5 0 0 1-.81-.47l1.51-8.53',
    download:'M12 15V3 M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5',
    contrast:'M2 12a10 10 0 1 0 20 0 10 10 0 1 0-20 0',
    github:'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4 M9 18c-4.51 2-5-2-7-2',
    linkedin:'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M2 4a2 2 0 1 0 4 0 2 2 0 1 0-4 0',
  };
  const fills: Record<string,string> = { contrast:'M12 18a6 6 0 0 0 0-12z' };
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[type] ?? paths.grid} />{fills[type] && <path d={fills[type]} fill="currentColor" stroke="none" />}</svg>;
}

