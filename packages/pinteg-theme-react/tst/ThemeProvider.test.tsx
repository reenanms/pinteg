import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '../src/ThemeProvider';
import { themes } from '../src/themes';

describe('ThemeProvider', () => {
    it('applies light-theme CSS variables by default', () => {
        const { container } = render(
            <ThemeProvider>
                <div data-testid="child" />
            </ThemeProvider>
        );
        const providerDiv = container.firstChild as HTMLElement;
        expect(providerDiv.style.getPropertyValue('--color-background')).toBe('#fdf6e3');
    });

    it('applies dark-theme CSS variables when theme="dark-theme"', () => {
        const { container } = render(
            <ThemeProvider theme="dark-theme">
                <div data-testid="child" />
            </ThemeProvider>
        );
        const providerDiv = container.firstChild as HTMLElement;
        expect(providerDiv.style.getPropertyValue('--color-background')).toBe('#121212');
    });

    it('falls back to light-theme when theme is unknown', () => {
        const { container } = render(
            <ThemeProvider theme="unknown-theme">
                <div data-testid="child" />
            </ThemeProvider>
        );
        const providerDiv = container.firstChild as HTMLElement;
        expect(providerDiv.style.getPropertyValue('--color-background')).toBe('#fdf6e3');
    });
});
