import { type ThemeMode, type ThemeName, THEME_CONFIG, getThemeNames } from './themeConfig';

type Mode = ThemeMode;
const KEY = 'theme';
const TRANSITION_MS = 320;
let fallbackTimer: number | undefined;

export function getTheme(): Exclude<Mode, 'toggle'> {
    const saved = localStorage.getItem(KEY) as Mode | null;
    return saved === 'toggle' || saved === null ? 'dark' : saved;
}

function applyTheme(themeName: ThemeName) {
    const root = document.documentElement;
    const { colors } = THEME_CONFIG[themeName];

    root.setAttribute('data-theme', themeName);
    root.style.setProperty('--bg', colors.bg);
    root.style.setProperty('--text', colors.text);
    root.style.setProperty('--muted', colors.muted);
    root.style.setProperty('--card', colors.card);
    root.style.setProperty('--ring', colors.ring);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--mono-bg', colors.monoBg);
    root.style.setProperty('--mono-text', colors.monoText);
}

function updateWithTransition(update: () => void) {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (root.classList.contains('theme-prevent-transition') || reduceMotion) {
        update();
        return;
    }

    // Keep the live DOM visible so the sticky header's backdrop blur is preserved.

    window.clearTimeout(fallbackTimer);
    root.classList.remove('theme-transitioning');
    void root.offsetWidth;
    root.classList.add('theme-transitioning');
    update();
    fallbackTimer = window.setTimeout(() => root.classList.remove('theme-transitioning'), TRANSITION_MS);
}

export function setTheme(mode: Mode) {
    const root = document.documentElement;

    if (mode === 'toggle') {
        const current = root.getAttribute('data-theme') as ThemeName | null;
        mode = current === 'light' ? 'dark' : 'light';
    }

    if (mode === 'auto') {
        localStorage.setItem(KEY, 'auto');
        updateWithTransition(() => applyAuto());
        return;
    }

    if (getThemeNames().includes(mode as ThemeName)) {
        const themeName = mode as ThemeName;
        localStorage.setItem(KEY, themeName);
        updateWithTransition(() => applyTheme(themeName));
    }
}

export function applyAuto() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
}
