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
                    <p id="aboutText">hey! my name is ivan. i'm studying computer science and applied math at harvard. in the summer of 2025, i worked as a software engineer intern at <a href="https://cs50.harvard.edu">CS50</a>, where i contributed to improving CS50's tools and curriculum, serving over 5 million student. </p>
                </div>
            </section>
        );
    }
    if (section === 'experience') {
        return (
            <section id="experience">
                <h2>experience/</h2>
                <div className="card">
                    <p id="experienceText">interned at cs50</p>
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