import { FieldRendererRegistry } from 'pinteg-core';
import { registerDefaultRenderers } from '../src/registry/defaultRenderers';

describe('registerDefaultRenderers', () => {
    it('registers "text" renderer', () => {
        registerDefaultRenderers();
        expect(FieldRendererRegistry.has('text')).toBe(true);
        expect(FieldRendererRegistry.get('text')).toBeDefined();
    });

    it('registers "integer" renderer', () => {
        registerDefaultRenderers();
        expect(FieldRendererRegistry.has('integer')).toBe(true);
        expect(FieldRendererRegistry.get('integer')).toBeDefined();
    });

    it('registers "double" renderer', () => {
        registerDefaultRenderers();
        expect(FieldRendererRegistry.has('double')).toBe(true);
        expect(FieldRendererRegistry.get('double')).toBeDefined();
    });

    it('registers "list" renderer', () => {
        registerDefaultRenderers();
        expect(FieldRendererRegistry.has('list')).toBe(true);
        expect(FieldRendererRegistry.get('list')).toBeDefined();
    });

    it('is idempotent — calling twice does not throw or corrupt the registry', () => {
        registerDefaultRenderers();
        registerDefaultRenderers();
        expect(FieldRendererRegistry.has('text')).toBe(true);
        expect(FieldRendererRegistry.has('integer')).toBe(true);
        expect(FieldRendererRegistry.has('double')).toBe(true);
        expect(FieldRendererRegistry.has('list')).toBe(true);
    });
});
