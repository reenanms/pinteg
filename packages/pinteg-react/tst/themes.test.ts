import { themes } from '../src/themes/themes';

describe('themes', () => {
    it('exports at least 4 themes', () => {
        expect(themes.length).toBeGreaterThanOrEqual(4);
    });

    it('every theme has id, name and properties', () => {
        for (const theme of themes) {
            expect(typeof theme.id).toBe('string');
            expect(typeof theme.name).toBe('string');
            expect(typeof theme.properties).toBe('object');
        }
    });

    it('light-theme exists and has white background', () => {
        const light = themes.find(t => t.id === 'light-theme');
        expect(light).toBeDefined();
        expect(light?.properties['color-background']).toBe('#ffffff');
    });

    it('dark-theme exists and has dark background', () => {
        const dark = themes.find(t => t.id === 'dark-theme');
        expect(dark).toBeDefined();
        expect(dark?.properties['color-background']).toBe('#121212');
    });

    it('every theme has a color-primary property', () => {
        for (const theme of themes) {
            expect(theme.properties).toHaveProperty('color-primary');
        }
    });

    it('every theme id is unique', () => {
        const ids = themes.map(t => t.id);
        const unique = new Set(ids);
        expect(unique.size).toBe(ids.length);
    });
});
