import { IComponentSize } from './IComponentSize';

/**
 * Built-in size presets.
 *
 * Each preset maps a human-readable name to a fractional width (0 < width ≤ 1)
 * that `sizeToStyle` converts into a CSS flex declaration so the field occupies
 * that fraction of its parent row.
 *
 * | Preset | Fraction | Approx share of a row |
 * |--------|----------|-----------------------|
 * | XS     | 0.25     | 1/4 of the row        |
 * | S      | 0.33     | 1/3 of the row        |
 * | M      | 0.50     | 1/2 of the row        |
 * | L      | 0.75     | 3/4 of the row        |
 * | FULL   | 1.00     | full row              |
 *
 * You can also pass a custom `IComponentSize` object with any `width` in (0, 1].
 */
export const Sizes = {
    XS: { name: 'XS', width: 0.125 } satisfies IComponentSize,
    S: { name: 'S', width: 0.25 } satisfies IComponentSize,
    M: { name: 'M', width: 0.50 } satisfies IComponentSize,
    L: { name: 'L', width: 1.00 } satisfies IComponentSize
} as const;
