import { useCallback, useEffect, useState } from 'react';
import './styles/global.css';
import RootHeader from './components/RootHeader';
import SectionView from './components/SectionView';
import TerminalOverlay from './components/TerminalOverlay';
import { applyAuto, getTheme, setTheme } from './theme';
import type { Section } from './types/section';

const savedTheme = getTheme();
if (savedTheme === 'auto') {
  applyAuto();
} else {
  setTheme(savedTheme);
}

export default function App() {
  const [terminalOpen, setTerminalOpen] = useState(false);

  const navigateTo = useCallback((section: Section) => {
    const targetId = section === 'root' ? 'top' : section;
    document.getElementById(targetId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, []);

  useEffect(() => {
    const legacySection = window.location.hash.slice(1) as Section;
    const validSections: Section[] = ['about', 'projects', 'experience', 'contact'];

    if (validSections.includes(legacySection)) {
      requestAnimationFrame(() => navigateTo(legacySection));
    }
  }, [navigateTo]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isTerminalInput = document.activeElement?.classList.contains('terminal-input');

      if (event.key === '`' && !terminalOpen && !isTerminalInput) {
        event.preventDefault();
        setTerminalOpen(true);
      }

      if (event.key === 'Escape') {
        setTerminalOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [terminalOpen]);

  return (
    <div className="site-shell" id="top">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <RootHeader
        onNavigate={navigateTo}
        onOpenTerminal={() => setTerminalOpen(true)}
      />

      <main id="main-content">
        <SectionView
          onNavigate={navigateTo}
          onOpenTerminal={() => setTerminalOpen(true)}
        />
      </main>

      <footer className="site-footer">
        <button type="button" className="text-button" onClick={() => navigateTo('root')}>
          Back to top <span aria-hidden="true">&uarr;</span>
        </button>
      </footer>

      <TerminalOverlay
        open={terminalOpen}
        onOpen={() => setTerminalOpen(true)}
        onClose={() => setTerminalOpen(false)}
        navigate={navigateTo}
      />
    </div>
  );
}
