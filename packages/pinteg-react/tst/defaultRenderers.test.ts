import { FieldAdapterRegistry } from 'pinteg-core';
import { registerDefaultRenderers } from '../src/registry/defaultRenderers';

describe('registerDefaultRenderers', () => {
    it('registers "text" adapter', () => {
        registerDefaultRenderers();
        expect(FieldAdapterRegistry.has('text')).toBe(true);
        expect(typeof FieldAdapterRegistry.get('text')).toBe('function');
    });

    it('registers "integer" adapter', () => {
        registerDefaultRenderers();
        expect(FieldAdapterRegistry.has('integer')).toBe(true);
        expect(typeof FieldAdapterRegistry.get('integer')).toBe('function');
    });

    it('registers "double" adapter', () => {
        registerDefaultRenderers();
        expect(FieldAdapterRegistry.has('double')).toBe(true);
        expect(typeof FieldAdapterRegistry.get('double')).toBe('function');
    });

    it('registers "list" adapter', () => {
        registerDefaultRenderers();
        expect(FieldAdapterRegistry.has('list')).toBe(true);
        expect(typeof FieldAdapterRegistry.get('list')).toBe('function');
    });

    it('is idempotent — calling twice does not throw or corrupt the registry', () => {
        registerDefaultRenderers();
        registerDefaultRenderers();
        expect(FieldAdapterRegistry.has('text')).toBe(true);
        expect(FieldAdapterRegistry.has('integer')).toBe(true);
        expect(FieldAdapterRegistry.has('double')).toBe(true);
        expect(FieldAdapterRegistry.has('list')).toBe(true);
    });

    it('"integer" adapter factory produces instances with defaultValidations', () => {
        registerDefaultRenderers();
        const factory = FieldAdapterRegistry.get('integer');
        const adapter = factory();
        expect(adapter.defaultValidations).toEqual([{ name: 'IsInteger' }]);
    });

    it('"double" adapter factory produces instances with defaultValidations', () => {
        registerDefaultRenderers();
        const factory = FieldAdapterRegistry.get('double');
        const adapter = factory();
        expect(adapter.defaultValidations).toEqual([{ name: 'IsNumber' }]);
    });
});
