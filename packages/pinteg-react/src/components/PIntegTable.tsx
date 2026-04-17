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
    onRowClick?: (rowIndex: number, rowData: any) => void;
    actions?: (rowData: any, rowIndex: number) => React.ReactNode;
    /** Optional render prop for the content of an expanded row */
    expandedRow?: (rowData: any, rowIndex: number) => React.ReactNode;
    /** List of indices of rows that are currently expanded */
    expandedRowIndices?: number[];
}

export const PIntegTable = React.forwardRef<PIntegTableRef, PIntegTableProps>((props, ref) => {
    const {
        schema,
        value,
        defaultValue,
        onChange,
        readOnly,
        listOptions,
        expandedRow,
        expandedRowIndices = []
    } = props;
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
                    {props.actions && <th style={{ width: '100px' }}>Actions</th>}
                </tr>
            </thead>
            <tbody>
                {values.map((row, rowIndex) => {
                    const isExpanded = expandedRowIndices.includes(rowIndex);

                    if (isExpanded && expandedRow) {
                        // Content fills data columns; actions column is rendered separately
                        return (
                            <tr key={rowIndex} className="pinteg-table-expanded-row">
                                <td colSpan={columns.length} style={{ padding: 0 }}>
                                    <div className="pinteg-table-expanded-content">
                                        {expandedRow(row, rowIndex)}
                                    </div>
                                </td>
                                {props.actions && (
                                    <td style={{ textAlign: 'center', padding: '8px', verticalAlign: 'top' }}>
                                        {props.actions(row, rowIndex)}
                                    </td>
                                )}
                            </tr>
                        );
                    }

                    return (
                        <tr
                            key={rowIndex}
                            className="pinteg-table-data-row"
                            onClick={() => props.onRowClick?.(rowIndex, row)}
                            style={{ cursor: props.onRowClick ? 'pointer' : 'default' }}
                        >
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
                            {props.actions && (
                                <td style={{ textAlign: 'center', padding: '8px' }}>
                                    {props.actions(row, rowIndex)}
                                </td>
                            )}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
});
