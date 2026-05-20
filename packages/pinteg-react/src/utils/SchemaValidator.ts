import { ComponentSchema, FieldAdapterRegistry } from 'pinteg-core';
import { ValidationManager } from '@pinteg/validation';
import { IValidationDef } from '@pinteg/validation';

export interface SchemaValidationSummary {
    isValid: boolean;
    errors: { field: string, caption: string, message: string }[];
    warnings: { field: string, caption: string, message: string }[];
}

export function getComponentValidations(definition: ComponentSchema[string]): IValidationDef[] {
    const activeValidations = (definition.validations || []).map(v => typeof v === 'string' ? { name: v } : v);
    
    const hasValidation = (name: string) => activeValidations.some(v => v.name === name);
    
    if (FieldAdapterRegistry.has(definition.type)) {
        const adapterFactory = FieldAdapterRegistry.get(definition.type);
        const adapter = adapterFactory();
        if (adapter.defaultValidations) {
            for (const defVal of adapter.defaultValidations) {
                if (!hasValidation(defVal.name)) {
                    activeValidations.push(defVal);
                }
            }
        }
    }
    
    return activeValidations;
}

export class SchemaValidator {
    /**
     * Validates an entire object against a ComponentSchema.
     * Evaluates explicit validations and implicit type-based validations.
     * 
     * @param schema The schema defining the fields and validations
     * @param data The object data to validate
     * @returns An object containing validation status and lists of errors/warnings.
     */
    static async validateSchema(schema: ComponentSchema, data: any): Promise<SchemaValidationSummary> {
        const errors: { field: string, caption: string, message: string }[] = [];
        const warnings: { field: string, caption: string, message: string }[] = [];

        if (!schema || !data) {
            return { isValid: true, errors, warnings };
        }

        const validationPromises = Object.entries(schema).map(async ([fieldName, definition]) => {
            const activeValidations = getComponentValidations(definition);

            if (activeValidations.length === 0) return;

            const value = data[fieldName];
            try {
                const results = await ValidationManager.validateMultiple(activeValidations, value, data);
                const fieldCaption = definition.caption || fieldName;

                for (const result of results) {
                    if (!result.isValid) {
                        if (result.severity === 'error') {
                            errors.push({ field: fieldName, caption: fieldCaption, message: result.message || 'Invalid value' });
                        } else if (result.severity === 'warning') {
                            warnings.push({ field: fieldName, caption: fieldCaption, message: result.message || 'Warning' });
                        }
                    }
                }
            } catch (err) {
                console.error(`Error validating field ${fieldName}:`, err);
            }
        });

        await Promise.all(validationPromises);

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }
}
