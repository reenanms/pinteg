import { describe, it, expect, beforeEach } from 'vitest';
import { DataSourceManager } from '../src/DataSourceManager.js';

describe('DataSourceManager', () => {
    beforeEach(() => {
        DataSourceManager._sources.clear();
    });

    it('should register and resolve a static data source', async () => {
        DataSourceManager.register('staticList', { read: async () => [1, 2, 3] });

        const result = await DataSourceManager.resolve('staticList').read();
        expect(result).toEqual([1, 2, 3]);
    });

    it('should throw an error if resolving an unregistered source', () => {
        expect(() => DataSourceManager.resolve('unregistered')).toThrowError("Data source 'unregistered' is not registered.");
    });
});
