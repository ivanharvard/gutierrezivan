import type { Project } from '../types/Project';
import { slugify } from '../utils/slug';

type Props = Project & { index: number };

export default function ProjectCard({ title, blurb, liveUrl, codeUrl, tags, index }: Props) {
  return (
    <article className="project-card" id={`project-${slugify(title)}`}>
      <div className="project-index">P/{String(index).padStart(2, '0')}</div>
      <div className="project-content">
        <h3 className={title === 'gutierrezivan.com' ? 'url-title' : undefined}>{title}</h3>
        <p>{blurb}</p>
        {tags?.length ? (
          <ul className="tags" aria-label={`${title} technologies`}>
            {tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
        ) : null}
      </div>
      <div className="project-actions">
        {liveUrl ? (
          <a href={liveUrl} target="_blank" rel="noreferrer">
            View project <span aria-hidden="true">↗</span>
          </a>
        ) : null}
        {codeUrl ? (
          <a href={codeUrl} target="_blank" rel="noreferrer">
            Source <span aria-hidden="true">↗</span>
          </a>
        ) : null}
      </div>
    </article>
  );
}
