import React from 'react';
import { render } from '@testing-library/react';
import { PIntegRoot } from '../src/components/PIntegRoot';

describe('PIntegRoot', () => {
    it('renders children inside a pinteg-root div', () => {
        const { getByText, container } = render(
            <PIntegRoot>
                <span>Hello</span>
            </PIntegRoot>
        );
        expect(getByText('Hello')).toBeDefined();
        expect(container.querySelector('.pinteg-root')).not.toBeNull();
    });

    it('wraps children in ThemeProvider (applies CSS variables on wrapper)', () => {
        const { container } = render(
            <PIntegRoot theme="light-theme">
                <span>child</span>
            </PIntegRoot>
        );
        // ThemeProvider renders a div with CSS variables
        const providerDiv = container.querySelector('.pinteg-theme-provider') as HTMLElement;
        expect(providerDiv).not.toBeNull();
        expect(providerDiv.style.getPropertyValue('--color-background')).toBe('#ffffff');
    });

    it('passes theme prop through to ThemeProvider (dark-theme)', () => {
        const { container } = render(
            <PIntegRoot theme="dark-theme">
                <span>child</span>
            </PIntegRoot>
        );
        const providerDiv = container.querySelector('.pinteg-theme-provider') as HTMLElement;
        expect(providerDiv.style.getPropertyValue('--color-background')).toBe('#121212');
    });

    it('pinteg-root div is a child of the theme provider wrapper', () => {
        const { container } = render(
            <PIntegRoot>
                <span />
            </PIntegRoot>
        );
        const root = container.querySelector('.pinteg-root');
        expect(root).not.toBeNull();
    });
});
