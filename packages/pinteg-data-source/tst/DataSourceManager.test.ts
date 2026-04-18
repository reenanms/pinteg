import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DataSourceManager } from '../src/DataSourceManager.js';

describe('DataSourceManager', () => {
    beforeEach(() => {
        DataSourceManager._sources.clear();
    });

    it('should register and resolve a handler by name', async () => {
        DataSourceManager.register('users.list', async () => [{ id: 1 }, { id: 2 }]);

        const result = await DataSourceManager.resolve('users.list')();
        expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('should pass params to the handler', async () => {
        DataSourceManager.register('users.list', async (p) => [{ role: p?.role }]);

        const result = await DataSourceManager.resolve('users.list')({ role: 'admin' });
        expect(result).toEqual([{ role: 'admin' }]);
    });

    it('should allow independent dot-namespaced registrations', async () => {
        const users = [{ id: '1', name: 'Alice' }];

        DataSourceManager.register('users.list',   async ()    => users);
        DataSourceManager.register('users.get',    async (p)   => users.find(u => u.id === p?.id));
        DataSourceManager.register('users.create', async (p)   => ({ id: '2', ...p }));
        DataSourceManager.register('users.delete', async (p)   => { /* no-op */ });

        expect(await DataSourceManager.resolve('users.list')()).toEqual(users);
        expect(await DataSourceManager.resolve('users.get')({ id: '1' })).toEqual({ id: '1', name: 'Alice' });
        expect(await DataSourceManager.resolve('users.create')({ name: 'Bob' })).toMatchObject({ name: 'Bob' });
    });

    it('should throw when resolving an unregistered source', () => {
        expect(() => DataSourceManager.resolve('users.list'))
            .toThrowError("Data source 'users.list' is not registered.");
    });

    it('has() should return true for registered sources and false otherwise', () => {
        DataSourceManager.register('departments.list', async () => []);

        expect(DataSourceManager.has('departments.list')).toBe(true);
        expect(DataSourceManager.has('departments.delete')).toBe(false);
    });

    it('should warn and overwrite when re-registering the same name', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

        DataSourceManager.register('users.list', async () => [1]);
        DataSourceManager.register('users.list', async () => [2]);

        expect(warn).toHaveBeenCalledWith("Data source 'users.list' is already registered and will be overwritten.");
        warn.mockRestore();
    });

    it('should support type-parameterized resolve', async () => {
        DataSourceManager.register('users.get', async (p: { id: string }) => ({ id: p.id, name: 'Alice' }));

        const user = await DataSourceManager.resolve<{ id: string }, { id: string; name: string }>('users.get')({ id: '1' });
        expect(user.name).toBe('Alice');
    });
});
