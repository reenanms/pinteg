import { FieldAdapterRegistry } from 'pinteg-core';
import { createReactAdapter } from 'pinteg-react';
import { FormulaField } from './FormulaField';

export function registerFormulaField() {
    FieldAdapterRegistry.register('formula', createReactAdapter(FormulaField));
}

// Auto-register when the package is imported
registerFormulaField();

export * from './FormulaField';
