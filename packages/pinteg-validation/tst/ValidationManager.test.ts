import { describe, it, expect, beforeEach } from 'vitest';
import { ValidationManager, ValidationResult } from '../src/ValidationManager';

describe('ValidationManager', () => {
    beforeEach(() => {
        // Since ValidationManager is a singleton, we need to clear its state if possible,
        // or just use unique names for each test.
    });

    it('should register and execute a synchronous validation', async () => {
        ValidationManager.register('IsRequired', (value) => {
            if (value === null || value === undefined || value === '') {
                return { isValid: false, message: 'Required', severity: 'error' };
            }
            return { isValid: true };
        });

        const resultValid = await ValidationManager.validate('IsRequired', 'test');
        expect(resultValid.isValid).toBe(true);

        const resultInvalid = await ValidationManager.validate('IsRequired', '');
        expect(resultInvalid.isValid).toBe(false);
        expect(resultInvalid.message).toBe('Required');
        expect(resultInvalid.severity).toBe('error');
    });

    it('should register and execute an asynchronous validation', async () => {
        ValidationManager.register('AsyncCheck', async (value) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ isValid: value === 'valid' });
                }, 10);
            });
        });

        const result = await ValidationManager.validate('AsyncCheck', 'valid');
        expect(result.isValid).toBe(true);
    });

    it('should throw an error when registering without a name', () => {
        expect(() => {
            ValidationManager.register('', () => ({ isValid: true }));
        }).toThrow('Validation name must be provided.');
    });

    it('should throw an error when registering without a function', () => {
        expect(() => {
            ValidationManager.register('NoFunc', null as any);
        }).toThrow('Validation function must be provided.');
    });

    it('should throw an error when validating without a name', async () => {
        await expect(ValidationManager.validate('', 'test'))
            .rejects
            .toThrow('Validation name must be provided.');
    });

    it('should throw an error when validating an unknown name', async () => {
        await expect(ValidationManager.validate('Unknown', 'test'))
            .rejects
            .toThrow("Validation function with name 'Unknown' not found.");
    });

    it('should validate multiple rules correctly', async () => {
        ValidationManager.register('Rule1', (v) => ({ isValid: v > 0, message: 'Must be positive' }));
        ValidationManager.register('Rule2', (v) => ({ isValid: v < 10, message: 'Must be less than 10' }));

        const results = await ValidationManager.validateMultiple([{ name: 'Rule1' }, { name: 'Rule2' }], 5);
        expect(results.length).toBe(2);
        expect(results[0].isValid).toBe(true);
        expect(results[1].isValid).toBe(true);

        const resultsInvalid = await ValidationManager.validateMultiple([{ name: 'Rule1' }, { name: 'Rule2' }], 15);
        expect(resultsInvalid[0].isValid).toBe(true);
        expect(resultsInvalid[1].isValid).toBe(false);
        expect(resultsInvalid[1].message).toBe('Must be less than 10');
    });

    it('should throw an error when validating multiple without an array', async () => {
        await expect(ValidationManager.validateMultiple(null as any, 'test'))
            .rejects
            .toThrow('An array of validations must be provided.');
    });
});
