import { FieldRendererRegistry } from 'pinteg-core';
import { FormulaField } from './FormulaField';

export function registerFormulaField() {
    FieldRendererRegistry.register('formula', FormulaField);
}

// Auto-register when the package is imported
registerFormulaField();

export * from './FormulaField';
