import { useEffect, useState, useCallback } from 'react';
import './styles/global.css'
import RootHeader from './components/RootHeader';
import DirectoryGrid from "./components/DirectoryGrid"; 
import SectionView from "./components/SectionView";
import TerminalOverlay from "./components/TerminalOverlay"; 
import { getTheme, setTheme, applyAuto } from './theme';
import type { Section } from './types/section';
import { Analytics } from "@vercel/analytics/next"

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

  // helper to normalize hash into Section
  const fromHash = useCallback((h: string): Section => (
    ["root", "about", "projects", "contact", "experience"].includes(h)
      ? (h as Section)
      : 'root'
  ), []);

  // Navigate without causing the browser to scroll to the target element
  const navigateTo = useCallback((s: Section) => {
    setSection(s);
    const url = s === 'root' ? `${location.pathname}${location.search}` : `${location.pathname}${location.search}#${s}`;
    // Update URL without triggering default anchor scrolling
    window.history.pushState({ section: s }, '', url);
  }, []);

  // Initialize from current hash and keep in sync on history navigation
  useEffect(() => {
    // Initialize state from hash on first load
    setSection(fromHash(location.hash.replace('#', '')));

    // Prevent initial jump to anchor if page loaded with a hash
    if (location.hash) {
      // Defer to next tick and force scroll to top to avoid jumping to the target element
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }, 0);
    }

    const onPopState = () => {
      // When navigating back/forward, just update state; history API doesn't auto-scroll to hash targets
      setSection(fromHash(location.hash.replace('#', '')));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [fromHash]);

  // Intercept in-page anchor clicks like <a href="#contact"> to avoid scrolling to the element
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;

      // Only handle same-page hash links
      const href = anchor.getAttribute('href') || '';
      // Ignore just '#' or empty
      if (href === '#' || href === '') return;

      e.preventDefault();
      const next = fromHash(href.replace('#', ''));
      navigateTo(next);
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, [fromHash, navigateTo]);

  // keyboard shortcuts definition
  const onKey = useCallback((e: KeyboardEvent) => {
    // Check if terminal input is focused
    const activeElement = document.activeElement;
    const isTerminalInputFocused = activeElement && 
      activeElement.classList.contains('terminal-input');
    
    if (e.key === "`" && !terminalOpen && !isTerminalInputFocused) {
      setTerminalOpen(true);
    }
    if (e.key === "Escape") setTerminalOpen(false);
  }, [terminalOpen]);

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  return (
    <>
      <div className="wrap">
        <RootHeader />
  <DirectoryGrid onSelect={(s) => navigateTo(s)} />
        <SectionView section={section} />

        <TerminalOverlay 
          open={terminalOpen} 
          onOpen={() => setTerminalOpen(true)} 
          onClose={() => setTerminalOpen(false)} 
          navigate={(s) => navigateTo(s as Exclude<Section, 'root'>)}
        />
        <Analytics />
      </div>
    </>
  )
}
