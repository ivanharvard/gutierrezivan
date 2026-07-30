import type { Experience } from '../types/Experience';
import { slugify } from '../utils/slug';

type Props = Experience & { index: number };

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function parseDate(date: string) {
  const [month = 'Jan', year = '1970'] = date.replaceAll('.', '').trim().split(' ');
  return new Date(Number(year), MONTHS[month] ?? 0, 1).getTime();
}

export default function ExperienceCard({ organization, roles, url, tags, type, index }: Props) {
  const sortedRoles = [...roles].sort((a, b) => parseDate(b.startDate) - parseDate(a.startDate));

  return (
    <article className="experience-card" id={`experience-${slugify(organization)}`}>
      <div className="experience-meta">
        <span>E/{String(index).padStart(2, '0')}</span>
        <span>{type}</span>
      </div>

      <div className="experience-org">
        <h3>{organization}</h3>
        {url ? (
          <a href={url} target="_blank" rel="noreferrer" aria-label={`Visit ${organization}`}>
            Visit <span aria-hidden="true">↗</span>
          </a>
        ) : null}
      </div>

      <div className="roles-timeline">
        {sortedRoles.map((role) => {
          const isActive = !role.endDate;
          return (
            <div className={`role-entry${isActive ? ' active' : ''}`} key={`${role.title}-${role.startDate}`}>
              <div className="role-header">
                <h4>{role.title}</h4>
                <time>{role.startDate} — {role.endDate ?? 'Present'}</time>
              </div>
              {role.location ? <span className="role-location">{role.location}</span> : null}
              {role.blurb ? <p>{role.blurb}</p> : null}
            </div>
          );
        })}
      </div>

      {tags?.length ? (
        <ul className="tags" aria-label={`${organization} skills`}>
          {tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
      ) : null}
    </article>
  );
}
