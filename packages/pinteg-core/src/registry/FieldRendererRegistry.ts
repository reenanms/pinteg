import { ValidationResult, IValidationDef } from '@pinteg/validation';

/**
 * Core properties passed to all fields — framework agnostic.
 * Any UI framework adapter receives these properties.
 */
export interface CoreFieldProps {
    name: string;
    caption?: string;
    value: any;
    size?: string;
    readOnly: boolean;
    tableMode: boolean;
    onChange: (name: string, value: any) => void;
    onBlur?: (name: string) => void;
    formValues?: Record<string, any>;
    props?: any;
    validationResult?: ValidationResult;
}

/**
 * The Universal Component Adapter interface.
 * Provides a framework-agnostic lifecycle for mounting, updating,
 * and unmounting a field component in the DOM.
 */
export interface IComponentAdapter {
    /** Mount the component into the given DOM container */
    mount(container: HTMLElement, props: CoreFieldProps): void;

    /** Update the component with new properties */
    update(props: CoreFieldProps): void;

    /** Unmount the component and clean up */
    unmount(): void;

    /** Optional validations inherently required by this field type */
    defaultValidations?: IValidationDef[];
}

/**
 * Registry for field adapter factories.
 * Stores factory functions that produce IComponentAdapter instances,
 * ensuring each field gets its own adapter with independent lifecycle state.
 */
class Registry {
    private map = new Map<string, () => IComponentAdapter>();

    register(type: string, adapterFactory: () => IComponentAdapter): void {
        this.map.set(type, adapterFactory);
    }

    get(type: string): () => IComponentAdapter {
        const factory = this.map.get(type);
        if (!factory) {
            throw new Error(`Adapter for type '${type}' not found.`);
        }
        return factory;
    }

    has(type: string): boolean {
        return this.map.has(type);
    }
}

export const FieldAdapterRegistry = new Registry();
