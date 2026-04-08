import { FieldRendererRegistry } from 'pinteg-core';
import { TextField } from '../components/fields/TextField';
import { IntegerField } from '../components/fields/IntegerField';
import { DoubleField } from '../components/fields/DoubleField';
import { ListField } from '../components/fields/ListField';

export function registerDefaultRenderers() {
    FieldRendererRegistry.register('text', TextField);
    FieldRendererRegistry.register('integer', IntegerField);
    FieldRendererRegistry.register('double', DoubleField);
    FieldRendererRegistry.register('list', ListField);
}
