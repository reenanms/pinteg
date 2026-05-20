import { FieldAdapterRegistry } from 'pinteg-core';
import { createReactAdapter } from '../adapters/createReactAdapter';
import { TextField } from '../components/fields/TextField';
import { IntegerField } from '../components/fields/IntegerField';
import { DoubleField } from '../components/fields/DoubleField';
import { ListField } from '../components/fields/ListField';

export function registerDefaultRenderers() {
    FieldAdapterRegistry.register('text', createReactAdapter(TextField));
    FieldAdapterRegistry.register('integer', createReactAdapter(IntegerField, [{ name: 'IsInteger' }]));
    FieldAdapterRegistry.register('double', createReactAdapter(DoubleField, [{ name: 'IsNumber' }]));
    FieldAdapterRegistry.register('list', createReactAdapter(ListField));
}
