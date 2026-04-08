import React, { useState, useMemo } from 'react';
import { ThemeContext } from './ThemeContext';
import { themes } from './themes';

export interface ThemeProviderProps {
    theme?: string;
    children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ theme = 'light-theme', children }) => {
    const [currentThemeId, setCurrentThemeId] = useState(theme);

    const activeTheme = useMemo(() => {
        return themes.find(t => t.id === currentThemeId) || themes[0];
    }, [currentThemeId]);

    const styleVars = useMemo(() => {
        const vars: Record<string, string> = {};
        Object.entries(activeTheme.properties).forEach(([key, value]: [string, string]) => {
            vars[`--${key}`] = value;
        });
        return vars as React.CSSProperties;
    }, [activeTheme]);

    return (
        <ThemeContext.Provider value={{
            themeId: currentThemeId,
            theme: activeTheme,
            availableThemes: themes,
            setTheme: setCurrentThemeId
        }}>
            <div className="pinteg-theme-provider" style={styleVars}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
};
