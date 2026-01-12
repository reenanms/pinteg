

export interface Theme {
  id: string;
  name: string;
  properties: {
    [key: string]: string;
  };
}
export const themes: Theme[] = [
  {
    id: "light-theme",
    name: "Light Theme",
    properties: {
      "color-primary": "#007bff",
      "color-background": "#ffffff",
      "color-text": "#222222",
      "color-surface": "#f5f5f5",
      "color-surface-alt": "#f5f5f5",
      "color-surface-hover": "#f9f9f9",
      "color-border": "#cccccc",
      "color-border-subtle": "#e0e0e0",
      "color-focus-border": "var(--color-primary)",
      "color-focus-background": "rgba(0, 123, 255, 0.1)",
      "input-width": "500px",
      "input-height": "30px",
      "input-radius": "6px",
      "table-radius": "6px",
      "font-size": "14px",
      "input-padding": "6px 8px",
    },
  },
  {
    id: "dark-theme",
    name: "Dark Theme",
    properties: {
      "color-primary": "#009dff",
      "color-background": "#121212",
      "color-text": "#f1f1f1",
      "color-surface": "#1e1e1e",
      "color-surface-alt": "#1e1e1e",
      "color-surface-hover": "#2a2a2a",
      "color-border": "#444",
      "color-border-subtle": "#333",
      "color-focus-border": "var(--color-primary)",
      "color-focus-background": "rgba(0, 157, 255, 0.15)",
      "input-width": "500px",
      "input-height": "40px",
      "input-radius": "6px",
      "table-radius": "6px",
      "font-size": "14px",
      "input-padding": "6px 8px",
    },
  },
  {
    id: "compact-theme",
    name: "Compact Theme",
    properties: {
      "color-primary": "#d33682",
      "color-background": "#fdf6e3",
      "color-text": "#333333",
      "color-surface": "#fff8dc",
      "color-surface-alt": "#f0eada",
      "color-surface-hover": "#f7f1e3",
      "color-border": "#aaa",
      "color-border-subtle": "#dcdcdc",
      "color-focus-border": "var(--color-primary)",
      "color-focus-background": "rgba(211, 54, 130, 0.1)",
      "input-width": "500px",
      "input-height": "50px",
      "input-radius": "6px",
      "table-radius": "6px",
      "font-size": "14px",
      "input-padding": "6px 8px",
    },
  }
];
