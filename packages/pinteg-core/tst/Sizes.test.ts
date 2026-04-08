import { Sizes } from '../src/schema/Sizes';

describe('Sizes', () => {
    it('has XS preset with correct name and width', () => {
        expect(Sizes.XS.name).toBe('XS');
        expect(Sizes.XS.width).toBe(0.125);
    });

    it('has S preset with correct name and width', () => {
        expect(Sizes.S.name).toBe('S');
        expect(Sizes.S.width).toBe(0.25);
    });

    it('has M preset with correct name and width', () => {
        expect(Sizes.M.name).toBe('M');
        expect(Sizes.M.width).toBe(0.5);
    });

    it('has L preset with correct name and width', () => {
        expect(Sizes.L.name).toBe('L');
        expect(Sizes.L.width).toBe(1.0);
    });

    it('all presets have width in range (0, 1]', () => {
        for (const [key, size] of Object.entries(Sizes)) {
            expect(size.width).toBeGreaterThan(0);
            expect(size.width).toBeLessThanOrEqual(1);
        }
    });

    it('all presets have name matching their key', () => {
        for (const [key, size] of Object.entries(Sizes)) {
            expect(size.name).toBe(key);
        }
    });
});
