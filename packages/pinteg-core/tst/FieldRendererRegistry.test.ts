import { FieldAdapterRegistry, IComponentAdapter } from '../src/registry/FieldRendererRegistry';

// Use unique type names per test since the singleton is shared.

function createFakeAdapterFactory(): () => IComponentAdapter {
    return () => ({
        mount() {},
        update() {},
        unmount() {}
    });
}

describe('FieldAdapterRegistry', () => {
    const uniqueType = `test-type-${Date.now()}`;
    const fakeFactory = createFakeAdapterFactory();

    it('throws an error when getting an unregistered type', () => {
        expect(() => FieldAdapterRegistry.get('non-existent-type-xyz')).toThrow("Adapter for type 'non-existent-type-xyz' not found.");
    });

    it('has() returns false for an unregistered type', () => {
        expect(FieldAdapterRegistry.has('non-existent-type-abc')).toBe(false);
    });

    it('register() + get() returns the registered factory', () => {
        FieldAdapterRegistry.register(uniqueType, fakeFactory);
        expect(FieldAdapterRegistry.get(uniqueType)).toBe(fakeFactory);
    });

    it('has() returns true after registration', () => {
        const t = `has-test-${Date.now()}`;
        FieldAdapterRegistry.register(t, createFakeAdapterFactory());
        expect(FieldAdapterRegistry.has(t)).toBe(true);
    });

    it('re-registering a type overwrites the previous factory', () => {
        const t = `overwrite-test-${Date.now()}`;
        const factory1 = createFakeAdapterFactory();
        const factory2 = createFakeAdapterFactory();
        FieldAdapterRegistry.register(t, factory1);
        FieldAdapterRegistry.register(t, factory2);
        expect(FieldAdapterRegistry.get(t)).toBe(factory2);
    });

    it('factory produces new adapter instances with independent state', () => {
        const t = `instance-test-${Date.now()}`;
        FieldAdapterRegistry.register(t, createFakeAdapterFactory());
        const factory = FieldAdapterRegistry.get(t);
        const adapter1 = factory();
        const adapter2 = factory();
        expect(adapter1).not.toBe(adapter2);
    });
});
