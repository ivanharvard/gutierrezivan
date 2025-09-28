import { type ThemeMode, type ThemeName, THEME_CONFIG, getThemeNames } from './themeConfig';

type Mode = ThemeMode;

const KEY = "theme";

/// getTheme()
///     Reads the theme from localStorage. If not found, returns 'auto'.

export function getTheme(): Exclude<Mode, 'toggle'> {
    const saved = localStorage.getItem(KEY) as Mode | null;
    if (saved === 'toggle' || saved === null) {
        return 'auto';
    }
    return saved;
}

/// setTheme(mode)
///     Sets the theme to any available theme, 'auto', or toggles between light and dark.

export function setTheme(mode: Mode) {
    const root = document.documentElement;

    if (mode === "toggle") {
        const current = root.getAttribute("data-theme") as ThemeName | null;
        mode = current === "light" ? "dark" : "light";
    }

    if (mode === "auto") {
        // remove manual override of theme
        root.removeAttribute("data-theme");
        localStorage.removeItem(KEY);
        applyAuto();
        return;
    }

    // Validate theme name
    if (getThemeNames().includes(mode as ThemeName)) {
        root.setAttribute("data-theme", mode);
        localStorage.setItem(KEY, mode);
        
        // Apply CSS custom properties dynamically
        const themeConfig = THEME_CONFIG[mode as ThemeName];
        if (themeConfig) {
            const { colors } = themeConfig;
            root.style.setProperty('--bg', colors.bg);
            root.style.setProperty('--text', colors.text);
            root.style.setProperty('--muted', colors.muted);
            root.style.setProperty('--card', colors.card);
            root.style.setProperty('--ring', colors.ring);
            root.style.setProperty('--accent', colors.accent);
            root.style.setProperty('--mono-bg', colors.monoBg);
            root.style.setProperty('--mono-text', colors.monoText);
        }
    }
}

/// applyAuto()
///     Applies the 'auto' theme based on system preferences.

export function applyAuto() {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
}