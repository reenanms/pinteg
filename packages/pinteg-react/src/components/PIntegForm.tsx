import React, { useCallback, useImperativeHandle } from 'react';
import { ComponentSchema } from 'pinteg-core';
import { useFormState } from '../hooks/useFormState';
import { FieldRendererRegistry } from 'pinteg-core';
import { SchemaRegistry } from '../registry/SchemaRegistry';
import { registerDefaultRenderers } from '../registry/defaultRenderers';
import { PIntegField } from './PIntegField';

// Ensure defaults are registered
registerDefaultRenderers();

export interface PIntegFormRef {
    readValue: () => Record<string, any>;
    writeValue: (v: Record<string, any>) => void;
}

export interface PIntegFormProps {
    schema: ComponentSchema;
    value?: Record<string, any>;
    defaultValue?: Record<string, any>;
    onChange?: (value: Record<string, any>) => void;
    readOnly?: boolean;
    listOptions?: Record<string, any[]>;
    orientation?: 'vertical' | 'horizontal';
    style?: React.CSSProperties;
}

export const PIntegForm = React.forwardRef<PIntegFormRef, PIntegFormProps>((props, ref) => {
    const { schema, value, defaultValue, onChange, readOnly, listOptions, orientation } = props;
    const isControlled = value !== undefined;
    const [internalValues, setInternalValues] = useFormState(schema, defaultValue);
    const values = isControlled ? value : internalValues;

    const handleChange = useCallback((name: string, fieldValue: any) => {
        if (!isControlled) {
            setInternalValues(prev => ({ ...prev, [name]: fieldValue }));
        }
        onChange?.({ ...values, [name]: fieldValue });
    }, [values, onChange, isControlled, setInternalValues]);

    useImperativeHandle(ref, () => ({
        readValue: () => values,
        writeValue: (v) => { if (!isControlled) setInternalValues(v); },
    }), [values, isControlled, setInternalValues]);

    return (
        <div className={`pinteg-form pinteg-area-${orientation ?? 'vertical'}`} style={props.style}>
            {Object.entries(schema).map(([name, definition]) => (
                <PIntegField
                    key={name}
                    name={name}
                    definition={definition}
                    value={values[name]}
                    formValues={values}
                    readOnly={readOnly ?? false}
                    tableMode={false}
                    listOptions={listOptions}
                    onChange={handleChange}
                />
            ))}
        </div>

    );
});
