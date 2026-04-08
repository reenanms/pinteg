import React, { useCallback, useImperativeHandle } from 'react';
import { ComponentSchema } from 'pinteg-core';
import { useTableState } from '../hooks/useTableState';
import { registerDefaultRenderers } from '../registry/defaultRenderers';
import { resolveWidthStyle } from '../utils/ComponentSizeUtils';
import { PIntegField } from './PIntegField';

registerDefaultRenderers();

export interface PIntegTableRef {
    readValue: () => any[];
    writeValue: (v: any[]) => void;
}

export interface PIntegTableProps {
    schema: ComponentSchema;
    value?: any[];
    defaultValue?: any[];
    onChange?: (value: any[]) => void;
    readOnly?: boolean;
    listOptions?: Record<string, any[]>;
    style?: React.CSSProperties;
}

export const PIntegTable = React.forwardRef<PIntegTableRef, PIntegTableProps>((props, ref) => {
    const { schema, value, defaultValue, onChange, readOnly, listOptions } = props;
    const isControlled = value !== undefined;
    const [internalValues, setInternalValues] = useTableState(defaultValue);
    const values = isControlled ? value : internalValues;

    const handleRowChange = useCallback((rowIndex: number, name: string, fieldValue: any) => {
        const newValues = [...values];
        newValues[rowIndex] = { ...newValues[rowIndex], [name]: fieldValue };

        if (!isControlled) {
            setInternalValues(newValues);
        }
        onChange?.(newValues);
    }, [values, onChange, isControlled, setInternalValues]);

    useImperativeHandle(ref, () => ({
        readValue: () => values,
        writeValue: (v) => { if (!isControlled) setInternalValues(v); },
    }), [values, isControlled, setInternalValues]);

    const columns = Object.entries(schema);

    return (
        <table className="pinteg-table" style={props.style}>
            <thead>
                <tr>
                    {columns.map(([name, def]) => (
                        <th key={name} style={resolveWidthStyle(def.size)}>
                            {def.caption}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {values.map((row, rowIndex) => (
                    <tr key={rowIndex} className="pinteg-table-data-row">
                        {columns.map(([name, definition]) => (
                            <td key={name}>
                                <PIntegField
                                    name={name}
                                    definition={definition}
                                    value={row[name]}
                                    formValues={row}
                                    readOnly={readOnly ?? false}
                                    tableMode={true}
                                    listOptions={listOptions}
                                    onChange={(n: string, v: any) => handleRowChange(rowIndex, n, v)}
                                />
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
});
