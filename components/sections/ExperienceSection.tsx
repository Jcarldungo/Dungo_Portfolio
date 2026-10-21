import { experience, certifications, certIssuerCount } from '@/lib/content';
import { CertList } from '@/components/CertList';

/** Experience + Credentials as one section: a connected timeline for the two
 *  real jobs, then every real certification as a verifiable row — issuer,
 *  name, domain tag, date, and a link straight to the issuer's record. */
export function ExperienceSection() {
  return (
    <section id="experience" className="section section-alt" aria-labelledby="experience-title">
      <div className="container">
        <div className="section-head reveal">
          <div className="section-label"><span className="c-comment">{'// '}</span>track record</div>
          <h2 className="section-title" id="experience-title">
            Experience &amp; <span className="title-em">Credentials</span>
          </h2>
        </div>

        <div className="exp-timeline">
          <h3 className="exp-timeline-label">On the job</h3>
          <div className="exp-list-timeline">
            {experience.map((job, i) => (
              <div key={job.title} className={`exp-card reveal ${i % 2 === 0 ? 'reveal-left' : 'reveal-right'}`}>
                <div className="exp-icon">{job.index}</div>
                <div className="exp-body">
                  <h4 className="exp-title">{job.title}</h4>
                  <div className="exp-org">{job.org} · {job.period}</div>
                  <ul className="exp-list">
                    {job.bullets.map((b) => <li key={b}>{b}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cert-list-block reveal">
          <h3 className="cert-list-label">Certifications</h3>
          <p className="cert-list-note">
            {certifications.length} earned · {certIssuerCount} issuers · every credential links to its issuer.
          </p>
          <CertList certifications={certifications} />
        </div>
      </div>
    </section>
  );
}
