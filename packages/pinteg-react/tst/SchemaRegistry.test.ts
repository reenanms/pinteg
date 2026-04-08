import { SchemaRegistry } from '../src/registry/SchemaRegistry';

describe('SchemaRegistry', () => {
    const uniqueName = `schema-${Date.now()}`;
    const schema = { field1: { type: 'text', caption: 'Field 1' } };

    it('get() returns undefined for an unregistered name', () => {
        expect(SchemaRegistry.get('non-existent-schema-xyz')).toBeUndefined();
    });

    it('has() returns false for an unregistered name', () => {
        expect(SchemaRegistry.has('non-existent-schema-abc')).toBe(false);
    });

    it('register() + get() returns the registered schema', () => {
        SchemaRegistry.register(uniqueName, schema);
        expect(SchemaRegistry.get(uniqueName)).toBe(schema);
    });

    it('has() returns true after registration', () => {
        const n = `has-test-schema-${Date.now()}`;
        SchemaRegistry.register(n, schema);
        expect(SchemaRegistry.has(n)).toBe(true);
    });

    it('register() supports method chaining (returns this)', () => {
        const n = `chain-${Date.now()}`;
        const result = SchemaRegistry.register(n, schema);
        expect(result).toBe(SchemaRegistry);
    });

    it('re-registering overwrites the previous schema', () => {
        const n = `overwrite-schema-${Date.now()}`;
        const schema2 = { field2: { type: 'integer' } };
        SchemaRegistry.register(n, schema);
        SchemaRegistry.register(n, schema2);
        expect(SchemaRegistry.get(n)).toBe(schema2);
    });
});
