import { SideNav } from '@/components/SideNav';
import { Footer } from '@/components/Footer';

/** The main portfolio shell — the side nav + footer + skip link. Lives in a
 *  route group so /work/[slug] can render its own full-screen chrome instead. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <SideNav />
      <main id="main-content" role="main">{children}</main>
      <Footer />
    </>
  );
}
