type Mode = 'light' | 'dark' | 'auto' | 'toggle';

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
///     Sets the theme to 'light', 'dark', 'auto', or toggles between light and dark.

export function setTheme(mode: Mode) {
    const root = document.documentElement;

    if (mode === "toggle") {
        const current = root.getAttribute("data-theme") as "light" | "dark" | null;
        mode = current === "light" ? "dark" : "light";
    }

    if (mode === "auto") {
        // remove manual override of theme
        root.removeAttribute("data-theme");
        localStorage.removeItem(KEY);
        applyAuto();
        return;
    }

    root.setAttribute("data-theme", mode); // light or dark
    localStorage.setItem(KEY, mode);
}

/// applyAuto()
///     Applies the 'auto' theme based on system preferences.

export function applyAuto() {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
}