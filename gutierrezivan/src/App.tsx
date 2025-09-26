import { useEffect, useState, useCallback } from 'react';
import './styles/global.css'
import RootHeader from './components/RootHeader';
import DirectoryGrid from "./components/DirectoryGrid"; 
import SectionView from "./components/SectionView";
import TerminalOverlay from "./components/TerminalOverlay"; 
import { getTheme, setTheme, applyAuto } from './theme';
import type { Section } from './types/section';

// Set initial theme
const saved = getTheme();
if (saved === 'auto') {
    applyAuto();
} else {
    setTheme(saved);
}


export default function App() {
  const [section, setSection] = useState<Section>('root');
  const [terminalOpen, setTerminalOpen] = useState(false);

  // sync with hash
  useEffect(() => {
    // on load, set section from hash
    const fromHash = (h: string): Section => 
      (["root", "about", "projects", "contact"].includes(h) ? (h as Section) : 'root');
    const apply = () => setSection(fromHash(location.hash.replace("#", "")));
    apply();

    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  // keyboard shortcuts definition
  const onKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "`") setTerminalOpen(v => !v);
    if (e.key === "Escape") setTerminalOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  return (
    <>
      <div className="wrap">
        <RootHeader />
        <DirectoryGrid onSelect={(s) => (location.hash = s === 'root' ? '' : `#${s}`)} />
        <SectionView section={section} />

        <TerminalOverlay open={terminalOpen} onOpen={() => setTerminalOpen(true)} onClose={() => setTerminalOpen(false)} />
      </div>
    </>
  )
}
