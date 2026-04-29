export type ValidationSeverity = 'error' | 'warning';

export interface ValidationResult {
    isValid: boolean;
    message?: string;
    severity?: ValidationSeverity;
}

export type ValidationFn = (value: any, context?: any, params?: any[]) => ValidationResult | Promise<ValidationResult>;

export interface IValidationDef {
    name: string;
    params?: any[];
}

export interface IValidationManager {
    register(name: string, fn: ValidationFn): void;
    validate(name: string, value: any, context?: any, params?: any[]): Promise<ValidationResult>;
    validateMultiple(validations: IValidationDef[], value: any, context?: any): Promise<ValidationResult[]>;
}

class ValidationManagerImpl implements IValidationManager {
    private registry = new Map<string, ValidationFn>();

    public register(name: string, fn: ValidationFn): void {
        if (!name) {
            throw new Error("Validation name must be provided.");
        }
        if (!fn) {
            throw new Error("Validation function must be provided.");
        }
        this.registry.set(name, fn);
    }

    public async validate(name: string, value: any, context?: any, params?: any[]): Promise<ValidationResult> {
        if (!name) {
            throw new Error("Validation name must be provided.");
        }
        const validationFn = this.registry.get(name);
        if (!validationFn) {
            throw new Error(`Validation function with name '${name}' not found.`);
        }

        const result = await validationFn(value, context, params);
        return result;
    }

    public async validateMultiple(validations: IValidationDef[], value: any, context?: any): Promise<ValidationResult[]> {
        if (!validations || !Array.isArray(validations)) {
            throw new Error("An array of validations must be provided.");
        }
        
        const promises = validations.map(v => {
            return this.validate(v.name, value, context, v.params);
        });
        return Promise.all(promises);
    }
}

export const ValidationManager = new ValidationManagerImpl();
