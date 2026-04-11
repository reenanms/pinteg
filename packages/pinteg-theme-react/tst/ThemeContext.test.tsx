import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { ThemeProvider } from '../src/ThemeProvider';
import { useTheme } from '../src/ThemeContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
);

const darkWrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme="dark-theme">{children}</ThemeProvider>
);

describe('useTheme', () => {
    it('returns light-theme by default', () => {
        const { result } = renderHook(() => useTheme(), { wrapper });
        expect(result.current.themeId).toBe('light-theme');
    });

    it('returns the correct theme object', () => {
        const { result } = renderHook(() => useTheme(), { wrapper });
        expect(result.current.theme.id).toBe('light-theme');
        expect(result.current.theme.properties).toBeDefined();
    });

    it('returns dark-theme when ThemeProvider is set to dark-theme', () => {
        const { result } = renderHook(() => useTheme(), { wrapper: darkWrapper });
        expect(result.current.themeId).toBe('dark-theme');
    });

    it('availableThemes contains at least 4 themes', () => {
        const { result } = renderHook(() => useTheme(), { wrapper });
        expect(result.current.availableThemes.length).toBeGreaterThanOrEqual(4);
    });

    it('setTheme changes the active theme', () => {
        const { result } = renderHook(() => useTheme(), { wrapper });
        act(() => {
            result.current.setTheme('dark-theme');
        });
        expect(result.current.themeId).toBe('dark-theme');
    });
});
