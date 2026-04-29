import React, { useEffect, useState } from 'react';
import { IComponentDefinition } from 'pinteg-core';
import { FieldRendererRegistry } from 'pinteg-core';
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

    let Renderer: React.FC<any> | undefined = undefined;
    if (FieldRendererRegistry.has(type)) {
        Renderer = FieldRendererRegistry.get(type) as React.FC<any>;
    }

    if (!Renderer) {
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
    }

    const rendererNode = (
        <Renderer
            name={name}
            caption={!tableMode ? (definition.caption ?? '') : ''}
            value={value}
            size={tableMode ? undefined : definition.size}
            readOnly={readOnly}
            tableMode={tableMode}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            formValues={formValues}
            validationResult={displayValidationResult}
            props={{ ...definition, options: listOptions?.[name] ?? definition.options }}
        />
    );

    if (tableMode) {
        return (
            <>
                <span className="pinteg-mobile-label">{definition.caption}</span>
                {rendererNode}
            </>
        );
    }

    return rendererNode;
};
