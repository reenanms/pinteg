import { groupPages, filterPages } from '../src/utils';
import { PageDefinition } from '../src/types';

describe('groupPages', () => {
    const pages: PageDefinition[] = [
        { id: 'users', title: 'Users', group: 'Administration', configSource: 'page.users.config' },
        { id: 'roles', title: 'Roles', group: 'Administration', configSource: 'page.roles.config' },
        { id: 'products', title: 'Products', group: 'Catalog', configSource: 'page.products.config' },
        { id: 'categories', title: 'Categories', group: 'Catalog', configSource: 'page.categories.config' },
        { id: 'dashboard', title: 'Dashboard', configSource: 'page.dashboard.config' },
    ];

    it('groups pages by their group field', () => {
        const groups = groupPages(pages);
        const labels = groups.map(g => g.label);

        expect(labels).toContain('Administration');
        expect(labels).toContain('Catalog');
        expect(labels).toContain('General');
    });

    it('sorts groups alphabetically', () => {
        const groups = groupPages(pages);
        const labels = groups.map(g => g.label);

        expect(labels).toEqual(['Administration', 'Catalog', 'General']);
    });

    it('sorts pages within each group alphabetically by title', () => {
        const groups = groupPages(pages);
        const adminGroup = groups.find(g => g.label === 'Administration')!;
        const titles = adminGroup.pages.map(p => p.title);

        expect(titles).toEqual(['Roles', 'Users']);
    });

    it('places ungrouped pages under "General"', () => {
        const groups = groupPages(pages);
        const generalGroup = groups.find(g => g.label === 'General')!;

        expect(generalGroup.pages).toHaveLength(1);
        expect(generalGroup.pages[0].id).toBe('dashboard');
    });

    it('handles empty input', () => {
        const groups = groupPages([]);
        expect(groups).toEqual([]);
    });

    it('trims whitespace from group names', () => {
        const pagesWithWhitespace: PageDefinition[] = [
            { id: 'a', title: 'Page A', group: '  Admin  ', configSource: 'x' },
            { id: 'b', title: 'Page B', group: 'Admin', configSource: 'y' },
        ];
        const groups = groupPages(pagesWithWhitespace);

        expect(groups).toHaveLength(1);
        expect(groups[0].label).toBe('Admin');
        expect(groups[0].pages).toHaveLength(2);
    });
});

describe('filterPages', () => {
    const pages: PageDefinition[] = [
        { id: 'users', title: 'User Management', group: 'Administration', configSource: 'x' },
        { id: 'roles', title: 'Role Editor', group: 'Administration', configSource: 'y' },
        { id: 'products', title: 'Product List', group: 'Catalog', configSource: 'z' },
    ];

    it('returns all pages when query is empty', () => {
        expect(filterPages(pages, '')).toEqual(pages);
    });

    it('returns all pages when query is whitespace', () => {
        expect(filterPages(pages, '   ')).toEqual(pages);
    });

    it('filters by case-insensitive partial match', () => {
        const result = filterPages(pages, 'user');
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('users');
    });

    it('matches partial substrings', () => {
        const result = filterPages(pages, 'list');
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('products');
    });

    it('matches case-insensitively', () => {
        const result = filterPages(pages, 'ROLE');
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('roles');
    });

    it('returns empty array when nothing matches', () => {
        const result = filterPages(pages, 'zzzzz');
        expect(result).toEqual([]);
    });
});
