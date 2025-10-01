export class UnsupportedComponentTypeError extends Error {
    constructor(typeName: string) {
        super(`The component type "${typeName}" is not supported.`);
        this.name = 'UnsupportedComponentTypeError';
    }
}
