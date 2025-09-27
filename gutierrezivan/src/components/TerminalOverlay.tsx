import { useEffect, useRef, useState } from "react";
import { useTerminal } from "../../hooks/useTerminal";
import { useProjects } from "../data/projects";
import { setTheme } from "../theme";

type Props = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  email?: string;
};

const DEFAULT_WINDOW_HEIGHT = 0.6;
const MIN_H = 180;
const MAX_WINDOW_HEIGHT = 0.92;
const FOCUS_DELAY = 120;
const IDLE_MS = 6000;
const NUDGE_DURATION = 800;
const NUDGE_TICK = 2000;

export default function TerminalOverlay({
  open, onOpen, onClose, email = "guest@gutierrezivan",
}: Props) {
  const [height, setHeight] = useState(Math.round(window.innerHeight * DEFAULT_WINDOW_HEIGHT));
  const [prevHeight, setPrevHeight] = useState<number | null>(null);
  const [drag, setDrag] = useState<{ startY: number; startH: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [nudging, setNudging] = useState(false);

  const lastInteractRef = useRef<number>(Date.now());
  const inputRef = useRef<HTMLInputElement | null>(null);

  const user = (email.split("@")[0] || "guest");
  const host = (email.split("@")[1] || "localhost");

  const { lines, cmd, setCmd, bodyRef, executeCommand, prompt, onKeyDown } = useTerminal({
    who: { user, host },
    navigate: (section) => (location.hash = `#${section}`),
    setTheme: (mode) => setTheme(mode),
    downloadResume: () => (document.getElementById("resumeLink") as HTMLAnchorElement | null)?.click(),
    openTerminal: () => {
      if (!open) {
        onOpen();
      }
      // Always attempt to focus, regardless of current open state
      setTimeout(() => {
        inputRef.current?.focus();
        // Also scroll to bottom when focusing
        const el = bodyRef.current;
        if (el) {
          el.scrollTop = el.scrollHeight;
        }
      }, FOCUS_DELAY + 100); // Extra delay for navigation and DOM updates
    },
    projects: useProjects().data || [],
  });

  const clamp = (h: number) => Math.max(MIN_H, Math.min(h, Math.floor(window.innerHeight * MAX_WINDOW_HEIGHT)));

  useEffect(() => { 
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
        // Also scroll to bottom when terminal opens
        const el = bodyRef.current;
        if (el) {
          el.scrollTop = el.scrollHeight;
        }
      }, FOCUS_DELAY);
    } else {
      // Unfocus the input when terminal closes
      inputRef.current?.blur();
    }
  }, [open]);

  useEffect(() => {
    const t = setInterval(() => {
      if (!open && Date.now() - lastInteractRef.current > IDLE_MS) {
        setNudging(true);
        setTimeout(() => setNudging(false), NUDGE_DURATION);
        lastInteractRef.current = Date.now();
      }
    }, NUDGE_TICK);
    return () => clearInterval(t);
  }, [open]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!drag) return;
      const dy = e.clientY - drag.startY;
      setHeight(clamp(drag.startH - dy));
    };
    const onUp = () => {
        setDrag(null)
        setIsDragging(false);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [drag]);

  const onGrabDown = (y: number) => { 
    lastInteractRef.current = Date.now(); 
    if (!open) { onOpen(); return; } 
    setDrag({ startY: y, startH: height }); 
    setIsDragging(true);
};

  // traffic lights
  const onCloseClick = () => { if (!open) return; onClose(); };
  const onMinimizeClick = () => { if (!open) return; onClose(); };
  const onMaximizeClick = () => {
    lastInteractRef.current = Date.now();
    if (!open) { setPrevHeight(null); onOpen(); return; }
    if (prevHeight == null) { setPrevHeight(height); setHeight(clamp(Math.floor(window.innerHeight * MAX_WINDOW_HEIGHT))); }
    else { setHeight(prevHeight); setPrevHeight(null); }
  };

  // click anywhere to focus input (ignore buttons and drag areas)
  const focusIfTerminal = (e: React.MouseEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest(".term-dots") || t.closest(".grab")) return;
    
    // Also ignore if clicking on input itself (already focused)
    if (t.tagName === 'INPUT') return;
    
    // Focus with a small delay to ensure other handlers complete
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  // Track mouse down/up for text selection vs click detection
  const [mouseDownPos, setMouseDownPos] = useState<{x: number, y: number} | null>(null);

  const onTerminalMouseDown = (e: React.MouseEvent) => {
    setMouseDownPos({ x: e.clientX, y: e.clientY });
  };

  const onTerminalMouseUp = (e: React.MouseEvent) => {
    if (!mouseDownPos) return;
    
    // Calculate distance moved
    const dx = Math.abs(e.clientX - mouseDownPos.x);
    const dy = Math.abs(e.clientY - mouseDownPos.y);
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Only focus if it was a click (not a drag for text selection)
    if (distance < 5) { // 5px tolerance for click vs drag
      focusIfTerminal(e);
    }
    
    setMouseDownPos(null);
  };

  // right-click paste
  const onContextMenu = async (e: React.MouseEvent) => {
    try {
      e.preventDefault();
      const txt = await navigator.clipboard.readText();
      if (txt) {
        const el = inputRef.current;
        const start = el?.selectionStart ?? cmd.length;
        const end = el?.selectionEnd ?? cmd.length;
        const next = cmd.slice(0, start) + txt + cmd.slice(end);
        setCmd(next);
        requestAnimationFrame(() => {
          if (!el) return;
          el.selectionStart = el.selectionEnd = start + txt.length;
          el.focus();
        });
      }
    } catch {
      // if clipboard blocked, let the default menu open on second click
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmd.trim()) return;
    lastInteractRef.current = Date.now();
    executeCommand(cmd);
    setCmd("");
  };

  return (
    <div
      className={`terminal ${open ? "open" : ""} ${nudging ? "nudge" : ""} ${isDragging ? "dragging" : ""}`}
      style={{ height, bottom: open ? 0 : `calc(-${height}px + 36px)` }}
      role="dialog" aria-modal="true" aria-label="Terminal"
      onMouseDown={onTerminalMouseDown}
      onMouseUp={onTerminalMouseUp}
      onMouseMove={() => (lastInteractRef.current = Date.now())}
      onKeyDown={() => (lastInteractRef.current = Date.now())}
      onContextMenu={onContextMenu}
    >
      <div className="term-head" onMouseDown={(e) => onGrabDown(e.clientY)}>
        <div className="term-dots">
          <button className="dot red" aria-label="Close" onClick={onCloseClick} />
          <button className="dot yellow" aria-label="Minimize" onClick={onMinimizeClick} />
          <button className="dot green" aria-label="Maximize" onClick={onMaximizeClick} />
        </div>
        <div className="term-title">{email} — interactive shell</div>
        <div className="term-spacer" />
      </div>

      {/* output + input in the same scroll area */}
      <div className="term-body" ref={bodyRef}>
        {lines.map((l, i) => <pre className="line" key={i}>{l}</pre>)}

        {/* inline input line */}
        <form className="input-line" onSubmit={submit}>
          <span className="prompt">{prompt()}</span>
          <input
            ref={inputRef}
            className="terminal-input"
            value={cmd}
            onChange={(e) => setCmd(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type 'help'"
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  );
}
