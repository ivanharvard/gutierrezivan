import { useExperiences } from '../data/experiences';
import { useProjects } from '../data/projects';
import { ABOUT_LEDE, getHarvardRole, PROFILE } from '../data/profile';
import type { Section } from '../types/section';
import ExperienceCard from './ExperienceCard';
import ProjectCard from './ProjectCard';

type Props = {
  onNavigate: (section: Section) => void;
  onOpenTerminal: () => void;
};

export default function SectionView({ onNavigate, onOpenTerminal }: Props) {
  const { data: projects } = useProjects();
  const { data: experiences } = useExperiences();

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Software engineer · Data scientist</p>
          <h1 id="hero-title">BUILDING<br />WITH <em>SIGNAL.</em></h1>
          <p className="hero-intro">
            I&apos;m Ivan, a Harvard computer scientist building useful systems across software,
            data, privacy, and education.
          </p>
          <div className="hero-actions">
            <button type="button" className="button button-primary" onClick={() => onNavigate('projects')}>
              Explore my work <span aria-hidden="true">&darr;</span>
            </button>
            <button type="button" className="button button-secondary" onClick={onOpenTerminal}>
              Open terminal <kbd>`</kbd>
            </button>
          </div>
        </div>

        <aside className="signal-card" aria-label="Profile summary">
          <div className="signal-card-topline">
            <span>CAMBRIDGE, MA</span>
            <span>EST. 2004</span>
          </div>
          <div className="portrait-frame">
            <img src="/images/avatar.jpg" alt="Ivan Gutierrez" width="200" height="200" />
          </div>
          <div className="signal-card-bottom">
            <p>IVAN<br />GUTIERREZ</p>
            <div>
              <span className="status-dot" aria-hidden="true" />
              OPEN TO BUILDING<br />INTERESTING THINGS
            </div>
          </div>
        </aside>
      </section>

      <section className="content-section about-section" id="about" aria-labelledby="about-title">
        <div className="section-heading">
          <span className="section-number">01</span>
          <div>
            <p className="section-kicker">The person behind the work</p>
            <h2 id="about-title">ABOUT</h2>
          </div>
        </div>

        <div className="about-layout">
          <div className="about-copy" id="aboutText">
            <p className="about-lede">
              {ABOUT_LEDE}
            </p>
            <div className="about-columns">
              <p>
                Hey, I&apos;m Ivan, a <span id="harvardRole">{getHarvardRole()}</span>. I grew up in
                Destin, Florida, and now live in Cambridge, Massachusetts. I care deeply about
                making computer science less daunting for people just starting out, regardless of
                background.
              </p>
              <p>
                I&apos;m especially interested in privacy and security: the technologies designed to
                protect user data, and the ones designed to take it. Away from the keyboard, you&apos;ll
                usually find me at a movie theater proudly getting value from my AMC A-List.
              </p>
            </div>
            <button type="button" className="text-button about-link" onClick={() => onNavigate('contact')}>
              Let&apos;s make something useful <span aria-hidden="true">&rarr;</span>
            </button>
          </div>

          <div className="photo-grid" aria-label="Photos from Ivan's life">
            <figure className="photo-wide">
              <img src="/images/hhchina.jpg" alt="Ivan with friends at HackHarvard" loading="lazy" />
            </figure>
            <figure>
              <img src="/images/kenny.jpg" alt="Ivan with a friend outdoors" loading="lazy" />
            </figure>
            <figure>
              <img src="/images/zoe.jpg" alt="Ivan and a friend outdoors" loading="lazy" />
            </figure>
          </div>
        </div>
      </section>

      <section className="content-section" id="projects" aria-labelledby="projects-title">
        <div className="section-heading section-heading-split">
          <span className="section-number">02</span>
          <div>
            <p className="section-kicker">Selected engineering &amp; research</p>
            <h2 id="projects-title">PROJECTS</h2>
          </div>
          <p className="section-summary">
            From browser-native video tooling to privacy research and operating systems.
          </p>
        </div>

        <div className="projects-list">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} index={index + 1} {...project} />
          ))}
        </div>
      </section>

      <section className="content-section" id="experience" aria-labelledby="experience-title">
        <div className="section-heading section-heading-split">
          <span className="section-number">03</span>
          <div>
            <p className="section-kicker">Where I&apos;ve contributed</p>
            <h2 id="experience-title">EXPERIENCE</h2>
          </div>
          <p className="section-summary">
            Building software, teaching computer science, and leading technical communities.
          </p>
        </div>

        <div className="experience-list">
          {experiences.map((experience, index) => (
            <ExperienceCard key={experience.organization} index={index + 1} {...experience} />
          ))}
        </div>
      </section>

      <section className="content-section contact-section" id="contact" aria-labelledby="contact-title">
        <div className="contact-panel">
          <div className="contact-label">
            <span className="section-number">04</span>
            <p>Have a real problem<br />worth solving?</p>
          </div>
          <div className="contact-main">
            <h2 id="contact-title">LET&apos;S TALK.</h2>
            <a className="contact-email" href={`mailto:${PROFILE.email}`} id="email">
              {PROFILE.email} <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="contact-links" aria-label="Social links">
            <a href={PROFILE.githubUrl} id="github" target="_blank" rel="noopener noreferrer">
              GitHub <span aria-hidden="true">↗</span>
            </a>
            <a href={PROFILE.linkedinUrl} id="linkedin" target="_blank" rel="noopener noreferrer">
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
