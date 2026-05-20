import { FieldAdapterRegistry } from 'pinteg-core';

describe('FieldAdapterRegistry', () => {
    it('throws for unknown type', () => {
        expect(() => FieldAdapterRegistry.get('unknown')).toThrow();
    });

    it('gets a registered adapter factory', () => {
        const dummyFactory = () => ({
            mount() {},
            update() {},
            unmount() {}
        });
        FieldAdapterRegistry.register('dummy', dummyFactory);
        expect(FieldAdapterRegistry.get('dummy')).toBe(dummyFactory);
    });
});
