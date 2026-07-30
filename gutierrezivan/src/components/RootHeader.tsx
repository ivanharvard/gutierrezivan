import type { Section } from '../types/section';

type Props = {
  onNavigate: (section: Section) => void;
  onOpenTerminal: () => void;
};

const navigation: Array<{ label: string; section: Exclude<Section, 'root'> }> = [
  { label: 'About', section: 'about' },
  { label: 'Projects', section: 'projects' },
  { label: 'Experience', section: 'experience' },
  { label: 'Contact', section: 'contact' },
];

export default function RootHeader({ onNavigate, onOpenTerminal }: Props) {
  return (
    <header className="site-header">
      <button type="button" className="wordmark" onClick={() => onNavigate('root')} aria-label="Go to top">
        <span>IVAN</span>
        <span>GUTIERREZ</span>
      </button>

      <nav className="site-nav" aria-label="Main navigation">
        {navigation.map((item, index) => (
          <button type="button" key={item.section} onClick={() => onNavigate(item.section)}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="header-actions">
        <button type="button" className="terminal-button" onClick={onOpenTerminal}>
          <span className="terminal-glyph" aria-hidden="true">&gt;_</span>
          Terminal
        </button>
        <a
          className="resume-button"
          id="resumeLink"
          href="https://gutierrezivan.netlify.app/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Resume <span aria-hidden="true">↗</span>
        </a>
      </div>
    </header>
  );
}
