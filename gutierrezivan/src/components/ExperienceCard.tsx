import type { Experience } from '../types/Experience';

export default function ExperienceCard(
    { organization, roles, url, tags, type }: Experience
) {
    // Sort roles by start date (most recent first)
    const sortedRoles = [...roles].sort((a, b) => {
        // Convert date strings to comparable format
        const parseDate = (dateStr: string) => {
            // Handle formats like "Mar. 2025", "Aug. 2024", etc.
            const cleaned = dateStr.replace(/\./g, '').trim();
            
            // Split into month and year
            const parts = cleaned.split(' ');
            if (parts.length === 2) {
                const [month, year] = parts;
                // Create a proper date string that JS can parse
                const monthMap: { [key: string]: string } = {
                    'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
                    'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
                    'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
                };
                const monthNum = monthMap[month] || '01';
                return new Date(`${year}-${monthNum}-01`).getTime();
            }
            
            // Fallback - try to parse as-is
            return new Date(cleaned).getTime() || 0;
        };
        
        const dateA = parseDate(a.startDate);
        const dateB = parseDate(b.startDate);
        
        return dateB - dateA; // Most recent first
    });

    return (
        <article className="card proj">
            <div className="content">
                <div className="exp-header">
                    <h3>{organization}</h3>
                    <span className="exp-type">{type}</span>
                </div>
                
                {/* Timeline of roles */}
                <div className="roles-timeline">
                    {sortedRoles.map((role, index) => {
                        const isActive = !role.endDate; // No endDate means current role
                        return (
                            <div 
                                key={index} 
                                className={`role-entry ${isActive ? 'active' : ''}`}
                            >
                                <div className="role-header">
                                    <h4 className="role-title">{role.title}</h4>
                                    <span className="role-duration">
                                        {role.startDate} - {role.endDate || "Present"}
                                    </span>
                                </div>
                                {role.location && <span className="role-location">{role.location}</span>}
                                {role.blurb && <p className="role-blurb">{role.blurb}</p>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Organization-wide tags */}
            {tags?.length ? (
                <div className="tags">
                    {tags.map((t) => (
                        <span key={t} className="tag">{t}</span>
                    ))}
                </div>
            ) : null}

            {/* Organization link */}
            <div className="actions">
                {url && <a className="btn" href={url} target="_blank" rel="noreferrer">Visit</a>}
            </div>
        </article>
        
    );
}