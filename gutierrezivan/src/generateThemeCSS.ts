import { THEME_CONFIG } from './themeConfig';

// Generate CSS custom properties from theme config
export function generateThemeCSS(): string {
  let css = `/* Auto-generated theme CSS from themeConfig.ts */\n`;
  css += `:root {\n`;
  css += `  /* surface + text */\n`;
  css += `  --bg:      ${THEME_CONFIG.light.colors.bg};\n`;
  css += `  --text:    ${THEME_CONFIG.light.colors.text};\n`;
  css += `  --muted:   ${THEME_CONFIG.light.colors.muted};\n\n`;
  css += `  /* components */\n`;
  css += `  --card:    ${THEME_CONFIG.light.colors.card};\n`;
  css += `  --ring:    ${THEME_CONFIG.light.colors.ring};\n`;
  css += `  --accent:  ${THEME_CONFIG.light.colors.accent};\n\n`;
  css += `  /* terminal-ish */\n`;
  css += `  --mono-bg:   ${THEME_CONFIG.light.colors.monoBg};\n`;
  css += `  --mono-text: ${THEME_CONFIG.light.colors.monoText};\n`;
  css += `}\n\n`;

  // Generate theme-specific CSS
  Object.entries(THEME_CONFIG).forEach(([themeName, config]) => {
    if (themeName === 'light') return; // Skip light as it's the default

    css += `/* ${config.displayName} theme overrides */\n`;
    css += `html[data-theme="${themeName}"] {\n`;
    css += `  --bg:      ${config.colors.bg};\n`;
    css += `  --text:    ${config.colors.text};\n`;
    css += `  --muted:   ${config.colors.muted};\n\n`;
    css += `  --card:    ${config.colors.card};\n`;
    css += `  --ring:    ${config.colors.ring};\n`;
    css += `  --accent:  ${config.colors.accent};\n\n`;
    css += `  --mono-bg:   ${config.colors.monoBg};\n`;
    css += `  --mono-text: ${config.colors.monoText};\n`;
    css += `}\n\n`;
  });

  return css;
}