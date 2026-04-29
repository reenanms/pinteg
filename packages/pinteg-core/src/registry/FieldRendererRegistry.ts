import { ValidationResult } from '@pinteg/validation';

export interface FieldRendererProps {
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

import { IValidationDef } from '@pinteg/validation';

export interface IFieldRenderer {
    /**
     * Optional default validations that this component inherently requires.
     */
    defaultValidations?: IValidationDef[];
    
    // We allow any other properties so UI frameworks (like React, Vue) 
    // can pass their native component signatures.
    [key: string]: any; 
}

export type RendererType = IFieldRenderer;
class Registry {
    private map = new Map<string, RendererType>();

    register(type: string, component: RendererType) {
        this.map.set(type, component);
    }

    get(type: string): RendererType {
        const component = this.map.get(type);
        if (!component) {
            throw new Error(`Renderer for type '${type}' not found.`);
        }
        return component;
    }

    has(type: string): boolean {
        return this.map.has(type);
    }
}

export const FieldRendererRegistry = new Registry();
