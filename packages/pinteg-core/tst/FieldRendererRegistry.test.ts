import { FieldRendererRegistry } from '../src/registry/FieldRendererRegistry';

// Use a fresh isolated registry instance by testing the class behavior
// The exported singleton is shared, so we test with unique type names per test.

describe('FieldRendererRegistry', () => {
    const uniqueType = `test-type-${Date.now()}`;
    const fakeComponent = () => null;

    it('returns undefined for an unregistered type', () => {
        expect(FieldRendererRegistry.get('non-existent-type-xyz')).toBeUndefined();
    });

    it('has() returns false for an unregistered type', () => {
        expect(FieldRendererRegistry.has('non-existent-type-abc')).toBe(false);
    });

    it('register() + get() returns the registered component', () => {
        FieldRendererRegistry.register(uniqueType, fakeComponent);
        expect(FieldRendererRegistry.get(uniqueType)).toBe(fakeComponent);
    });

    it('has() returns true after registration', () => {
        const t = `has-test-${Date.now()}`;
        FieldRendererRegistry.register(t, fakeComponent);
        expect(FieldRendererRegistry.has(t)).toBe(true);
    });

    it('re-registering a type overwrites the previous renderer', () => {
        const t = `overwrite-test-${Date.now()}`;
        const comp1 = () => null;
        const comp2 = () => null;
        FieldRendererRegistry.register(t, comp1);
        FieldRendererRegistry.register(t, comp2);
        expect(FieldRendererRegistry.get(t)).toBe(comp2);
    });
});
