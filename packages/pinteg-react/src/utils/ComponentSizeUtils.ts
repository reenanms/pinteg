import { IComponentSize } from 'pinteg-core';
import { Sizes } from 'pinteg-core';

/**
 * Converts an `IComponentSize` into a CSS style object for React's `style` prop.
 *
 * The field occupies `size.width * 100%` of the parent row. Because the parent
 * container is sized by theme CSS variables, this function never needs to
 * hard-code pixel values — the theme controls the total space and `width`
 * controls the fraction each field claims.
 *
 * @throws {Error} if `size.width` is not in (0, 1].
 */
export function sizeToStyle(size: IComponentSize): Record<string, string> {
    const { width, name } = size;

    if (typeof width !== 'number' || Number.isNaN(width) || width <= 0 || width > 1) {
        throw new Error(
            `[pinteg] sizeToStyle: size.width must be a number in the range (0, 1]. ` +
            `Received ${JSON.stringify(width)} for size "${name}".`
        );
    }

    const pct = `${width * 100}%`;
    // Each field must give up its share of the column gaps so N fields tile exactly.
    // Formula: flex-basis = width% - gap × (1 - width)
    //   e.g. S (0.25): calc(25% - var(--pinteg-col-gap) * 0.75)
    //   4×S: 4 × (25% - 0.75g) = 100% - 3g  ← 3 gaps between 4 items ✓
    //   2×S + 1×M: (2×25% - 2×0.75g) + (50% - 0.5g) = 100% - 2g ← 2 gaps ✓
    const gapFactor = 1 - width; // fraction of a gap each field surrenders

    return {
        flex: `${width} 1 calc(${pct} - var(--pinteg-col-gap, 12px) * ${gapFactor})`,
    };
}

/**
 * Resolves a size name string (e.g. "S", "M", "L") to a CSS style object.
 *
 * Looks up the name in the built-in `Sizes` registry. If `size` is undefined
 * the field defaults to full row width. If the string doesn't match any known
 * preset an error is thrown immediately — silent fallbacks are not allowed.
 *
 * @throws {Error} if `size` is a non-empty string that isn't a known preset key.
 */
export function resolveSizeStyle(size?: string): Record<string, string> {
    if (!size) {
        return sizeToStyle({ name: 'FULL', width: 1 });
    }

    const preset = (Sizes as Record<string, IComponentSize>)[size];
    if (!preset) {
        return sizeToStyle({ name: 'FULL', width: 1 });
    }

    return sizeToStyle(preset);
}

/**
 * Returns a style object with a flat `width` property for use
 * in standard HTML `<th>` or `<col>` elements (e.g. `width: "25%"`).
 */
export function resolveWidthStyle(size?: string): Record<string, string> {
    if (!size) {
        return { width: '100%' };
    }

    const preset = (Sizes as Record<string, IComponentSize>)[size];
    if (!preset) {
        return { width: '100%' };
    }

    return { width: `${preset.width * 100}%` };
}
