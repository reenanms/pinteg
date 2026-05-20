import React, { useEffect, useRef, useState } from 'react';
import { IComponentDefinition, CoreFieldProps } from 'pinteg-core';
import { FieldAdapterRegistry, IComponentAdapter } from 'pinteg-core';
import { SchemaRegistry } from '../registry/SchemaRegistry';
import { PIntegForm } from './PIntegForm';
import { ValidationManager, ValidationResult } from '@pinteg/validation';
import { getComponentValidations } from '../utils/SchemaValidator';

export interface PIntegFieldProps {
    name: string;
    definition: IComponentDefinition;
    value: any;
    formValues?: Record<string, any>;
    readOnly: boolean;
    tableMode: boolean;
    listOptions?: Record<string, any[]>;
    onChange: (name: string, value: any) => void;
    forceValidate?: boolean;
}

/**
 * Builds the framework-agnostic CoreFieldProps from PIntegFieldProps.
 */
function buildCoreProps(
    props: PIntegFieldProps,
    displayValidationResult: ValidationResult | undefined,
    handleFieldChange: (name: string, value: any) => void,
    handleFieldBlur: (name: string) => void
): CoreFieldProps {
    const { name, definition, value, formValues, readOnly, tableMode, listOptions } = props;
    return {
        name,
        caption: !tableMode ? (definition.caption ?? '') : '',
        value,
        size: tableMode ? undefined : definition.size,
        readOnly,
        tableMode,
        onChange: handleFieldChange,
        onBlur: handleFieldBlur,
        formValues,
        validationResult: displayValidationResult,
        props: { ...definition, options: listOptions?.[name] ?? definition.options }
    };
}

export const PIntegField: React.FC<PIntegFieldProps> = ({
    name,
    definition,
    value,
    formValues,
    readOnly,
    tableMode,
    listOptions,
    onChange,
    forceValidate = false
}) => {
    const type = definition.type;
    const [validationResult, setValidationResult] = useState<ValidationResult | undefined>(undefined);
    const [isTouched, setIsTouched] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const adapterRef = useRef<IComponentAdapter | null>(null);

    const handleFieldChange = (n: string, v: any) => {
        if (!readOnly) setIsTouched(true);
        onChange(n, v);
    };

    const handleFieldBlur = (n: string) => {
        if (!readOnly) setIsTouched(true);
    };

    useEffect(() => {
        if (readOnly) {
            setValidationResult(undefined);
            return;
        }

        const activeValidations = getComponentValidations(definition);

        if (activeValidations.length === 0) {
            setValidationResult(undefined);
            return;
        }

        ValidationManager.validateMultiple(activeValidations, value, formValues).then(results => {
            let errorResult = results.find(r => !r.isValid && r.severity === 'error');
            let warningResult = results.find(r => !r.isValid && r.severity === 'warning');
            let anyFailing = results.find(r => !r.isValid);

            if (errorResult) {
                setValidationResult(errorResult);
            } else if (warningResult) {
                setValidationResult(warningResult);
            } else if (anyFailing) {
                setValidationResult(anyFailing);
            } else {
                setValidationResult({ isValid: true });
            }
        }).catch(err => {
            console.error('Validation error for field', name, err);
        });
    }, [value, type, definition.validations, formValues, name, readOnly]);

    const displayValidationResult = (isTouched || forceValidate) ? validationResult : undefined;

    // Check if there's an adapter registered for this type
    const hasAdapter = FieldAdapterRegistry.has(type);

    // Mount/unmount the adapter when the field type changes
    useEffect(() => {
        if (!hasAdapter) return;

        const factory = FieldAdapterRegistry.get(type);
        adapterRef.current = factory();

        if (containerRef.current) {
            const coreProps = buildCoreProps(
                { name, definition, value, formValues, readOnly, tableMode, listOptions, onChange, forceValidate },
                displayValidationResult,
                handleFieldChange,
                handleFieldBlur
            );
            adapterRef.current.mount(containerRef.current, coreProps);
        }

        return () => {
            adapterRef.current?.unmount();
            adapterRef.current = null;
        };
    }, [type]); // Re-mount only if the field type changes

    // Update the adapter when props change
    useEffect(() => {
        if (!adapterRef.current) return;

        const coreProps = buildCoreProps(
            { name, definition, value, formValues, readOnly, tableMode, listOptions, onChange, forceValidate },
            displayValidationResult,
            handleFieldChange,
            handleFieldBlur
        );
        adapterRef.current.update(coreProps);
    });

    // If we have an adapter, render the container for it
    if (hasAdapter) {
        if (tableMode) {
            return (
                <>
                    <span className="pinteg-mobile-label">{definition.caption}</span>
                    <div ref={containerRef} className="pinteg-adapter-container" />
                </>
            );
        }
        return <div ref={containerRef} className="pinteg-adapter-container" />;
    }

    // No adapter: try a nested schema (form mode only)
    if (!tableMode) {
        const subSchema = SchemaRegistry.get(type);
        if (subSchema) {
            return (
                <div className="pinteg-nested-section">
                    {definition.caption && <h4 className="pinteg-nested-caption">{definition.caption}</h4>}
                    <PIntegForm
                        schema={subSchema}
                        value={value || {}}
                        readOnly={readOnly}
                        onChange={(subVal) => onChange(name, subVal)}
                        style={{ borderLeft: '2px solid var(--color-border)', paddingLeft: '1rem' }}
                    />
                </div>
            );
        }
    }

    console.warn(`No renderer or schema found for type: ${type}`);
    return null;
};
