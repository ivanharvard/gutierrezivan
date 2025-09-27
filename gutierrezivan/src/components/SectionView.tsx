import { useProjects } from '../data/projects';
import ProjectCard from './ProjectCard';

export default function SectionView(
    { section }: { section: 'root' | 'about' | 'projects' | 'contact' | 'experience' }
) {
    const { data: projects, error, loading } = useProjects();
    
    // Calculate Harvard role based on current date
    const getHarvardRole = () => {
        const today = new Date();
        const eoySpring2026 = new Date("2026-05-31");
        const eoySpring2027 = new Date("2027-05-31");

        if (today < eoySpring2026) {
            return "junior at harvard studying computer science";
        } else if (today < eoySpring2027) {
            return "senior at harvard studying computer science";
        } else {
            return "recent harvard graduate with a B.A. in computer science";
        }
    };

    if (section === 'root') {
        return (
            <section aria-label="Intro">
                <div className="card">
                    <p>hi there! press <code>`</code> to open the terminal.</p>
                </div>
            </section>
        );
    }
    if (section === 'about') {
        return (
            <section id="about">
                <h2>about/</h2>
                <div className="card">
                    <p id="aboutText">hey! my name is ivan. i'm a <span id="harvardRole">{getHarvardRole()}</span>.</p>
                </div>
            </section>
        );
    }
    if (section === 'experience') {
        return (
            <section id="experience">
                <h2>experience/</h2>
                <div className="experience">
                    {loading && <div className="card"><p>Loading...</p></div>}
                    {error && <div className="card"><p>Failed to load experience: {error}</p></div>}
                    {experience && experience.map((exp) => (
                        <ProjectCard key={exp.title} {...exp} />
                    ))}
                </div>
            </section>
        );
    }
    if (section === 'projects') {
        return (
            <section id="projects">
                <h2>projects/</h2>
                {/* Load projects */}
                <div className="projects">
                    {loading && <div className="card proj"><p>Loading...</p></div>}
                    {error && <div className="card proj"><p>Failed to load projects: {error}</p></div>}
                    {projects && projects.map((project) => (
                        <ProjectCard key={project.title} {...project} />
                    ))}
                </div>
            </section>
        );
    }
    if (section === 'contact') {
        return (
            <section id="contact">
                <h2>contact/</h2>
                <div className="card">
                    <p id="email">igzjobs@gmail.com</p>
                    <p id="github">https://www.github.com/ivanharvard</p>
                    <p id="linkedin">https://www.linkedin.com/in/-ivan-gutierrez/</p>
                </div>
            </section>
        );
    }
}