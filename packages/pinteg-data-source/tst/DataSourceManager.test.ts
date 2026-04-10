import { describe, it, expect, beforeEach } from 'vitest';
import { DataSourceManager } from '../src/DataSourceManager.js';

describe('DataSourceManager', () => {
    beforeEach(() => {
        DataSourceManager._resolvers.clear();
    });

    it('should register and resolve a static data source', async () => {
        DataSourceManager.register('staticList', async () => [1, 2, 3]);

        const result = await DataSourceManager.resolve('staticList');
        expect(result).toEqual([1, 2, 3]);
    });

    it('should register and resolve a data source with params', async () => {
        DataSourceManager.register('dynamicList', async (params) => {
            if (params?.role === 'admin') {
                return ['user1'];
            }
            return [];
        });

        const result = await DataSourceManager.resolve('dynamicList', { role: 'admin' });
        expect(result).toEqual(['user1']);

        const emptyResult = await DataSourceManager.resolve('dynamicList');
        expect(emptyResult).toEqual([]);
    });

    it('should throw an error if resolving an unregistered source', async () => {
        await expect(DataSourceManager.resolve('unregistered')).rejects.toThrowError("Data source 'unregistered' is not registered.");
    });

    it('should resolve with a specific type', async () => {
        DataSourceManager.register('typedSource', async () => ({ id: 1, name: 'Test' }));

        type ExpectedType = { id: number; name: string };
        const result = await DataSourceManager.resolve<ExpectedType>('typedSource');

        expect(result.id).toBe(1);
        expect(result.name).toBe('Test');
    });

    it('should resolve an array and allow counting its items', async () => {
        DataSourceManager.register('arraySource', async () => ['apple', 'banana', 'cherry']);

        const result = await DataSourceManager.resolve<Array<string>>('arraySource');

        expect(result.length).toBe(3);
    });
});
