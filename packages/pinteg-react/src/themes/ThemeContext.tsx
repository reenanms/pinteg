import { createContext, useContext } from 'react';
import { Theme, themes } from './themes';

export interface ThemeContextType {
    themeId: string;
    theme: Theme;
    availableThemes: Theme[];
    setTheme: (themeId: string) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
    themeId: themes[0].id,
    theme: themes[0],
    availableThemes: themes,
    setTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);
