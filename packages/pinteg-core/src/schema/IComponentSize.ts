/**
 * Defines the fractional width of a form field relative to its container row.
 *
 * - `name`  — semantic label (e.g. "S", "M", "L") used for display / tooling only.
 * - `width` — fraction of the available row to occupy, in the range (0, 1].
 *             Example: 0.25 → 25 %, 0.5 → 50 %, 1.0 → 100 %.
 *
 * There is no implicit default: every ComponentSchema field definition MUST
 * provide a valid IComponentSize. Using an unknown / missing size is a bug.
 */
export interface IComponentSize {
  /** Human-readable label. Not used for layout logic. */
  name: string;
  /** Fraction of the parent row width. Must be in the range (0, 1]. */
  width: number;
}
