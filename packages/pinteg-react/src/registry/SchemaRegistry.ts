import { ComponentSchema } from 'pinteg-core';

class Registry {
    private schemas = new Map<string, ComponentSchema>();

    register(name: string, schema: ComponentSchema): this {
        this.schemas.set(name, schema);
        return this;
    }

    get(name: string): ComponentSchema | undefined {
        return this.schemas.get(name);
    }

    has(name: string): boolean {
        return this.schemas.has(name);
    }
}

export const SchemaRegistry = new Registry();
