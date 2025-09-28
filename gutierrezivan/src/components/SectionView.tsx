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
            return "junior at Harvard studying Computer Science";
        } else if (today < eoySpring2027) {
            return "senior at Harvard studying Computer Science";
        } else {
            return "recent Harvard graduate with a B.A. in Computer Science";
        }
    };

    if (section === 'root') {
        return (
            <section aria-label="Intro">
                <div className="card">
                    <p>Hi there! Press <code>`</code> to open the terminal.</p>
                </div>
            </section>
        );
    }
    if (section === 'about') {
        return (
            <section id="about">
                <h2>about/</h2>
                <div className="card">
                    <p id="aboutText">
                        Hey! My name is Ivan. I'm a <span id="harvardRole">{getHarvardRole()}</span>.
                        <br /><br />
                        I grew up in Destin, FL, a small beach town known for its white sand beaches. I currently live in Cambridge, MA while attending Harvard University. I think the field of Computer Science can feel particularly daunting to those who are just starting out, so I feel uniquely inclined to make Computer Science as accessible as possible, regardless of background. I strive to participate in efforts that promote CS education for all.
                        <br /><br />
                        I also have a great interest in privacy and security, and I enjoy investigating technologies that are designed to protect (and steal!) user data. I've met some of the most fascinating professors and researchers through my interest in this field, and I look forward to continuing to learn more about it in the future. Hopefully, I'll get to build more projects that prioritize user privacy while still delivering great user experiences.
                        <br /><br />
                        In my free time, I enjoy going to the movie theatre and playing the daily Wordle!
                        <br /><br />
                        Feel free to <a href="#contact">reach out</a> if you'd like to connect.
                    </p>
                </div>
                <br />
                <div className="card-centered">
                    <div className="centered-row">
                        <img src="/hhchina.jpg" className="card-img" width="60%"/>
                        <img src="/halloween.jpg" className="card-img" width="30%"/>
                    </div>
                    <div className="centered-row">
                        <img src="/zoe.jpg" className="card-img" width="44%"/>
                        <img src="/kenny.jpg" className="card-img" width="50%"/>
                    </div>
                    <div className="centered-row">
                        <img src="/airport.jpg" className="card-img" width="25%"/>
                        <img src="/mom.jpg" className="card-img" width="60%"/>
                    </div>
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