import { ValidationManager } from '@pinteg/validation';

export function registerDefaultValidations() {
    ValidationManager.register('IsRequired', (value) => {
        console.log("TST: value", value);

        if (value === null || value === undefined || value === '') {
            return { isValid: false, message: 'This field is required', severity: 'error' };
        }
        return { isValid: true };
    });

    ValidationManager.register('IsNumber', (value) => {
        if (value === null || value === undefined || value === '') return { isValid: true };
        if (typeof value !== 'number' || Number.isNaN(value)) {
            return { isValid: false, message: 'Value must be a valid number', severity: 'error' };
        }
        return { isValid: true };
    });

    ValidationManager.register('IsInteger', (value) => {
        if (value === null || value === undefined || value === '') return { isValid: true };
        if (typeof value !== 'number' || !Number.isInteger(value)) {
            return { isValid: false, message: 'Value must be an integer', severity: 'error' };
        }
        return { isValid: true };
    });

    ValidationManager.register('IsPositiveNumber', (value) => {
        if (value === null || value === undefined || value === '') return { isValid: true };
        if (typeof value !== 'number' || value <= 0) {
            return { isValid: false, message: 'Value must be a positive number', severity: 'error' };
        }
        return { isValid: true };
    });

    ValidationManager.register('MaxLength', (value: any, context?: any, params?: any[]) => {
        if (value === null || value === undefined || value === '') return { isValid: true };
        const maxLength = params && params[0] !== undefined ? params[0] : undefined;
        if (maxLength !== undefined && typeof value === 'string' && value.length > maxLength) {
            return { isValid: false, message: `Length must be at most ${maxLength} characters`, severity: 'warning' };
        }
        return { isValid: true };
    });

    ValidationManager.register('MinLength', (value: any, context?: any, params?: any[]) => {
        if (value === null || value === undefined || value === '') return { isValid: true };
        const minLength = params && params[0] !== undefined ? params[0] : undefined;
        if (minLength !== undefined && typeof value === 'string' && value.length < minLength) {
            return { isValid: false, message: `Length must be at least ${minLength} characters`, severity: 'error' };
        }
        return { isValid: true };
    });
}
