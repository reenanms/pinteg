import React from 'react';
import { IComponentDefinition } from 'pinteg-core';
import { FieldRendererRegistry } from 'pinteg-core';
import { SchemaRegistry } from '../registry/SchemaRegistry';
import { PIntegForm } from './PIntegForm';

export interface PIntegFieldProps {
    name: string;
    definition: IComponentDefinition;
    value: any;
    formValues?: Record<string, any>;
    readOnly: boolean;
    tableMode: boolean;
    listOptions?: Record<string, any[]>;
    onChange: (name: string, value: any) => void;
}

export const PIntegField: React.FC<PIntegFieldProps> = ({
    name,
    definition,
    value,
    formValues,
    readOnly,
    tableMode,
    listOptions,
    onChange
}) => {
    const type = definition.type;
    let Renderer = FieldRendererRegistry.get(type);

    if (!Renderer) {
        // Check if it's a registered schema for nesting (only supported in form mode for now)
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
            caption={!tableMode ? (definition.caption ?? '') : ''} // Tables render headers separately
            value={value}
            size={tableMode ? undefined : definition.size} // In table mode, the flex wrapper handles size
            readOnly={readOnly}
            tableMode={tableMode}
            onChange={onChange}
            formValues={formValues}
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
