import React from 'react';
import { ThemeProvider, ThemeProviderProps } from 'pinteg-theme-react';
import '../pinteg.css';

export interface PIntegRootProps extends ThemeProviderProps { }

export const PIntegRoot: React.FC<PIntegRootProps> = ({ theme, children }) => {
    return (
        <ThemeProvider theme={theme}>
            <div className="pinteg-root">
                {children}
            </div>
        </ThemeProvider>
    );
};
