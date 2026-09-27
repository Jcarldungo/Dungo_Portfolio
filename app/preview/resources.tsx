import { siClaude, siOpenai, siWix, siLaravel } from 'simple-icons';

const resources = [
  { name: 'Visual Studio Code', detail: 'Code editor', href: 'https://code.visualstudio.com/', icon: null },
  { name: 'Orca', detail: 'Agent development environment', href: 'https://www.onorca.dev/', icon: null },
  { name: 'Claude Code', detail: 'Pro plan', href: 'https://claude.com/product/claude-code', icon: siClaude },
  { name: 'Codex', detail: 'Plus plan', href: 'https://openai.com/codex/', icon: siOpenai },
  { name: 'Claude Design', detail: 'Design and prototyping', href: 'https://claude.com/product/design', icon: siClaude },
  { name: 'Wix', detail: 'Website builder', href: 'https://www.wix.com/', icon: siWix },
  { name: 'Laravel Herd', detail: 'Local PHP and Laravel development', href: 'https://herd.laravel.com/', icon: siLaravel },
];

export function Resources() {
  return <><h1 className="pv-page-title">Resources</h1><p className="pv-intro">The tools I use for development and design.</p><section className="pv-block pv-resources" aria-labelledby="resource-tools"><h2 id="resource-tools">Tools I use</h2>{resources.map(resource => <a className="pv-resource-row" key={resource.name} href={resource.href} target="_blank" rel="noopener noreferrer"><span className={`pv-resource-icon${resource.icon === siClaude ? ' pv-resource-claude' : ''}`} aria-hidden="true">{resource.icon ? <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d={resource.icon.path} /></svg> : <span className="pv-resource-initial" style={resource.name === 'Visual Studio Code' ? { fontSize: 16 } : undefined}>{resource.name === 'Visual Studio Code' ? 'VS' : 'O'}</span>}</span><span className="pv-resource-copy"><strong>{resource.name}</strong><span>{resource.detail}</span></span><span className="pv-resource-arrow" aria-hidden="true">↗</span></a>)}</section></>;
}

