import { FieldRendererRegistry } from 'pinteg-core';

describe('FieldRendererRegistry', () => {
    it('throws for unknown type', () => {
        expect(() => FieldRendererRegistry.get('unknown')).toThrow();
    });

    it('gets a registered renderer', () => {
        const DummyComponent = () => null;
        FieldRendererRegistry.register('dummy', DummyComponent as any);
        expect(FieldRendererRegistry.get('dummy')).toBe(DummyComponent);
    });
});
