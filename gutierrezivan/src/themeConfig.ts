// Centralized theme configuration
export const THEME_CONFIG = {
  light: {
    name: 'light',
    displayName: 'Light',
    colors: {
      bg: '#fafafa',
      text: '#141414',
      muted: '#6b6b6b',
      card: '#ffffff',
      ring: '#c9d6ff',
      accent: '#0f62fe',
      monoBg: '#fafafa',
      monoText: '#141414ff',
    }
  },
  dark: {
    name: 'dark',
    displayName: 'Dark',
    colors: {
      bg: '#0b0b0b',
      text: '#eaeaea',
      muted: '#9b9b9b',
      card: '#111111',
      ring: '#1f2937',
      accent: '#7dd3fc',
      monoBg: '#0c0c0c',
      monoText: '#e6e6e6',
    }
  },
  pink: {
    name: 'pink',
    displayName: 'Pink',
    colors: {
      bg: '#fff0f6',
      text: '#3b003b',
      muted: '#7a2a7a',
      card: '#ffe6f0',
      ring: '#ffb3d9',
      accent: '#ff66b2',
      monoBg: '#1a001a',
      monoText: '#ffccf2',
    }
  },
  crimson: {
    name: 'crimson',
    displayName: 'Crimson',
    colors: {
      bg: '#1a0808',
      text: '#f2e6e6',
      muted: '#bf9999',
      card: '#2b1010',
      ring: '#4d2020',
      accent: '#b31b1b',
      monoBg: '#140606',
      monoText: '#f0d4d4',
    }
  },
  maroon: {
    name: 'maroon',
    displayName: 'Maroon',
    colors: {
      bg: '#1a0c0c',
      text: '#f0e8e8',
      muted: '#b59999',
      card: '#281010',
      ring: '#4a2424',
      accent: '#800000',
      monoBg: '#160808',
      monoText: '#ecd6d6',
    }
  },
  hacker: {
    name: 'hacker',
    displayName: 'Hacker',
    colors: {
        bg: '#0b0b0b',
        text: '#eaeaea',
        muted: '#9b9b9b',
        card: '#111111',
        ring: '#1f2937',
        accent: '#7dd3fc',
        monoBg: '#0c0c0c',
        monoText: '#33ff33',
    }
  },
  'periwinkle': {
    name: 'periwinkle',
    displayName: 'Periwinkle',
    colors: {
        bg: '#f0f4ff',
        text: '#1a1a2e',
        muted: '#6b6b8a',
        card: '#ffffff',
        ring: '#c9d6ff',
        accent: '#896cfc',
        monoBg: '#1a1a2e',
        monoText: '#dcdcff',
    }
  },
  'cyberpunk': {
    name: 'cyberpunk',
    displayName: 'Cyberpunk',
    colors: {
        bg: '#0d0d12',
        text: '#fdfd96',
        muted: '#ff66c4',
        card: '#1a1a26',
        ring: '#ff66c4',
        accent: '#fdee00',
        monoBg: '#0a0a14',
        monoText: '#ffeaff',
    }
   },
   'forest': {
    name: 'forest',
    displayName: 'Forest',
    colors: {
        bg: '#0a0f0a',
        text: '#e8f5e8',
        muted: '#9bb59b',
        card: '#1a261a',
        ring: '#4d7c4d',
        accent: '#3bb143',
        monoBg: '#0a0f0a',
        monoText: '#d4f1d4',
    }
   }
  } as const;

// Derived types
export type ThemeName = keyof typeof THEME_CONFIG;
export type ThemeMode = ThemeName | 'auto' | 'toggle';

// Helper functions
export const getThemeNames = () => Object.keys(THEME_CONFIG) as ThemeName[];
export const getThemeDisplayNames = () => Object.values(THEME_CONFIG).map(t => t.displayName);
export const getThemeConfig = (name: ThemeName) => THEME_CONFIG[name];

// For help text generation
export const getThemeList = () => getThemeNames().join('|');
export const getThemeListWithAuto = () => [...getThemeNames(), 'auto'].join('|');