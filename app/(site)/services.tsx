import Link from 'next/link';

const services = [
  ['Full-stack Web Development', 'Complete web apps built from scratch — semantic markup, a custom CSS system, and the server side behind it. No page-builder, no template.'],
  ['REST API Design & Development', 'Clean, predictable endpoints with real auth, validation, and error handling — including working within tight hosting limits when the plan caps you.'],
  ['Database Design', 'Schemas modelled on how the data is actually queried — normalised tables, sane constraints, and columns that mean one thing each.'],
  ['Responsive & Accessible Frontends', 'Mobile-first layouts tuned for low-end phones, with skip links, ARIA labels, and keyboard navigation built in rather than bolted on.'],
  ['Deployment & Hosting Setup', 'Getting it live and keeping it that way — Vercel or Netlify, continuous deployment from GitHub, environment config, and a custom domain.'],
  ['Offline-first & PWA Features', "Service workers that queue what you do with no signal and sync it once you're back online, plus installable-to-home-screen setup."],
];

export function Services() {
  return <><h1 className="pv-page-title">Services</h1><p className="pv-intro">End-to-end web work — from a first wireframe to a deployed, working app.</p><section className="pv-block pv-services" aria-labelledby="services-heading"><h2 id="services-heading">What I can build for you</h2>{services.map(([title, description]) => <article className="pv-service" key={title}><h3>{title}</h3><p>{description}</p></article>)}</section><div className="pv-closing"><h2>Have something in mind?</h2><p>Tell me what you&apos;re building and I&apos;ll tell you honestly whether I&apos;m the right fit — and what I&apos;d have to learn first if I&apos;m not.</p><Link href="/contact">Get in touch →</Link></div></>;
}
