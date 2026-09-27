import { siteInfo } from '@/lib/content';

type Day = { date: string; level: number; label: string };

// Read the public calendar directly; no token or third-party proxy is needed.
export async function GitHubActivity() {
  let days: Day[] = [];
  let total = '';
  try {
    const response = await fetch('https://github.com/users/Jcarldungo/contributions', {
      next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error('GitHub unavailable');
    const html = await response.text();
    total = html.match(/([\d,]+)\s+contributions\s+in the last year/)?.[1] ?? '';
    const tips = new Map([...html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)].map(match => [match[1].match(/\bfor="([^"]+)"/)?.[1], match[2].replace(/<[^>]*>/g, '').trim()]));
    days = [...html.matchAll(/<td\b[^>]*data-date="[^"]+"[^>]*>/g)].flatMap(([tag]) => {
      const date = tag.match(/data-date="(\d{4}-\d{2}-\d{2})"/)?.[1];
      const rawLevel = tag.match(/data-level="([0-4])"/)?.[1];
      const id = tag.match(/\bid="([^"]+)"/)?.[1];
      return date && rawLevel !== undefined ? [{ date, level: Number(rawLevel), label: tips.get(id) || date }] : [];
    }).sort((a,b) => a.date.localeCompare(b.date));
    if (!total || days.length < 350) throw new Error('Calendar markup changed');
  } catch {
    days = [];
  }
  const offset = days.length ? new Date(`${days[0].date}T00:00:00Z`).getUTCDay() : 0;
  return <section className="pv-block pv-github"><div className="pv-section-heading"><h2>GitHub</h2><a href={siteInfo.github} target="_blank" rel="noreferrer">{days.length ? `${total} contributions in the last year` : 'View GitHub profile ↗'}</a></div>
    {days.length ? <><div className="pv-calendar-scroll" tabIndex={0} role="region" aria-label={`${total} GitHub contributions in the last year. Scroll to explore the calendar.`}><div className="pv-calendar" role="img" aria-label={`${total} contributions in the last year on GitHub`}>{Array.from({length:offset},(_,i) => <span key={`blank-${i}`} />)}{days.map(day => <span key={day.date} className={`pv-day pv-level-${day.level}`} title={`${day.date}: ${day.label}`} />)}</div></div><div className="pv-calendar-legend"><a href={siteInfo.github} target="_blank" rel="noreferrer">@Jcarldungo ↗</a><span>Less {[0,1,2,3,4].map(level => <i key={level} className={`pv-day pv-level-${level}`} />)} More</span></div></> : <p className="pv-github-fallback">GitHub activity is temporarily unavailable. You can still view my contributions on GitHub.</p>}
  </section>;
}
