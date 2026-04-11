export * from 'pinteg-core';
export * from 'pinteg-theme-react';
export * from './registry/SchemaRegistry';
export * from './components/PIntegRoot';
export * from './components/PIntegField';
export * from './registry/defaultRenderers';
export * from './hooks/useFormState';
export * from './hooks/useTableState';
export * from './components/PIntegForm';
export * from './components/PIntegTable';
export * from './utils/ComponentSizeUtils';

// Auto-register ReactRenderer when the package is imported
import { pinteg } from 'pinteg-core';
import { ReactRenderer } from './builder/ReactRenderer';
pinteg.setRenderer(new ReactRenderer());

export * from './builder/ReactRenderer';

import './pinteg.css';

