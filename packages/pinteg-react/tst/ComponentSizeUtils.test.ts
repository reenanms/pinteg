import { sizeToStyle, resolveSizeStyle, resolveWidthStyle } from '../src/utils/ComponentSizeUtils';

describe('sizeToStyle', () => {
    it('generates a flex style with the correct percentage for width 0.5', () => {
        const style = sizeToStyle({ name: 'M', width: 0.5 });
        expect(style.flex).toContain('50%');
    });

    it('generates a flex style with the correct percentage for width 1.0', () => {
        const style = sizeToStyle({ name: 'FULL', width: 1 });
        expect(style.flex).toContain('100%');
    });

    it('generates a flex style with the correct percentage for width 0.25', () => {
        const style = sizeToStyle({ name: 'S', width: 0.25 });
        expect(style.flex).toContain('25%');
    });

    it('generates a flex style with the correct percentage for width 0.125', () => {
        const style = sizeToStyle({ name: 'XS', width: 0.125 });
        expect(style.flex).toContain('12.5%');
    });

    it('throws when width is 0', () => {
        expect(() => sizeToStyle({ name: 'X', width: 0 })).toThrow();
    });

    it('throws when width is negative', () => {
        expect(() => sizeToStyle({ name: 'X', width: -0.1 })).toThrow();
    });

    it('throws when width is greater than 1', () => {
        expect(() => sizeToStyle({ name: 'X', width: 1.1 })).toThrow();
    });

    it('throws when width is not a number', () => {
        expect(() => sizeToStyle({ name: 'X', width: NaN })).toThrow();
    });

    it('gap factor is embedded in the flex expression', () => {
        // For width=0.5 the gap factor is 0.5, so the calc should contain * 0.5
        const style = sizeToStyle({ name: 'M', width: 0.5 });
        expect(style.flex).toContain('0.5');
    });
});

describe('resolveSizeStyle', () => {
    it('returns full-width when size is undefined', () => {
        const style = resolveSizeStyle(undefined);
        expect(style.flex).toContain('100%');
    });

    it('returns full-width when size is empty string', () => {
        const style = resolveSizeStyle('');
        expect(style.flex).toContain('100%');
    });

    it('resolves XS preset correctly', () => {
        const style = resolveSizeStyle('XS');
        expect(style.flex).toContain('12.5%');
    });

    it('resolves S preset correctly', () => {
        const style = resolveSizeStyle('S');
        expect(style.flex).toContain('25%');
    });

    it('resolves M preset correctly', () => {
        const style = resolveSizeStyle('M');
        expect(style.flex).toContain('50%');
    });

    it('resolves L preset correctly', () => {
        const style = resolveSizeStyle('L');
        expect(style.flex).toContain('100%');
    });

    it('falls back to full-width for an unknown size string', () => {
        const style = resolveSizeStyle('UNKNOWN');
        expect(style.flex).toContain('100%');
    });
});

describe('resolveWidthStyle', () => {
    it('returns 100% when size is undefined', () => {
        expect(resolveWidthStyle(undefined)).toEqual({ width: '100%' });
    });

    it('returns 25% for size S', () => {
        expect(resolveWidthStyle('S')).toEqual({ width: '25%' });
    });

    it('returns 50% for size M', () => {
        expect(resolveWidthStyle('M')).toEqual({ width: '50%' });
    });

    it('returns 100% for size L', () => {
        expect(resolveWidthStyle('L')).toEqual({ width: '100%' });
    });

    it('returns 12.5% for size XS', () => {
        expect(resolveWidthStyle('XS')).toEqual({ width: '12.5%' });
    });

    it('returns 100% for unknown size', () => {
        expect(resolveWidthStyle('NOTASIZE')).toEqual({ width: '100%' });
    });
});
