import type { Project } from "../types/Project";

export default function ProjectCard(
    { title, blurb, liveUrl, codeUrl, tags }: Project
) {
    return (
        <article className="card proj">
            <div className="content">
                <h3>{title}</h3>
                <p>{blurb}</p>
            </div>
            {/* Checks if tags exists */}
            {tags?.length ? (
                // If tags exists, render each one
                <div className="tags">
                    {tags.map((t: string) => (
                        <span key={t} className="tag">{t}</span>
                    ))}
                </div>
            ) : null}
            {/* Hyperlinks */}
            <div className="actions">
                {liveUrl && <a className="btn" href={liveUrl} target="_blank" rel="noreferrer">Visit</a>}
                {codeUrl && <a className="btn" href={codeUrl} target="_blank" rel="noreferrer">See Code</a>}
            </div>
        </article>
    )
}