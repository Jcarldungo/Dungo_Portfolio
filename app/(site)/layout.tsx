import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import { PreviewShell } from './shell';
import './preview.css';
const figtree = Figtree({ subsets: ['latin'], variable: '--font-preview', display: 'swap' });

export const metadata: Metadata = { alternates: { canonical: '/' } };

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <div className={figtree.variable}><PreviewShell>{children}</PreviewShell></div>;
}
