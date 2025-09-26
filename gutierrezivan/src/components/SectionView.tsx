import { useProjects } from '../data/projects';
import ProjectCard from './ProjectCard';

export default function SectionView(
    { section }: { section: 'root' | 'about' | 'projects' | 'contact' }
) {
    const { data: projects, error, loading } = useProjects();

    if (section === 'root') {
        return (
            <section aria-label="Intro">
                <div className="card">
                    <p>Yapyapyap.</p>
                </div>
            </section>
        );
    }
    if (section === 'about') {
        return (
            <section id="about">
                <h2>about/</h2>
                <div className="card">
                    <p id="aboutText">bio and stuff</p>
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