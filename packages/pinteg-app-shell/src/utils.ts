import { PageDefinition, PageGroup } from './types';

/** Default group label for pages that have no explicit group. */
const DEFAULT_GROUP = 'General';

/**
 * Groups pages by their `group` field, sorts groups alphabetically,
 * and sorts pages within each group alphabetically by title.
 *
 * Ungrouped pages are placed under the "General" group.
 */
export function groupPages(pages: PageDefinition[]): PageGroup[] {
    const map = new Map<string, PageDefinition[]>();

    for (const page of pages) {
        const label = page.group?.trim() || DEFAULT_GROUP;
        const existing = map.get(label);
        if (existing) {
            existing.push(page);
        } else {
            map.set(label, [page]);
        }
    }

    const groups: PageGroup[] = [];
    for (const [label, groupPages] of map.entries()) {
        groups.push({
            label,
            pages: groupPages.sort((a, b) => a.title.localeCompare(b.title)),
        });
    }

    return groups.sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Filters pages by title using case-insensitive partial matching.
 */
export function filterPages(pages: PageDefinition[], query: string): PageDefinition[] {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return pages;
    return pages.filter(p => p.title.toLowerCase().includes(trimmed));
}
