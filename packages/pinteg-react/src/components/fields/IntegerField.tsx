import React from 'react';
import { FieldRendererProps } from 'pinteg-core';
import { resolveSizeStyle } from '../../utils/ComponentSizeUtils';

export const IntegerField: React.FC<FieldRendererProps> = ({
    name, caption, value, size, readOnly, tableMode, onChange,
}) => {
    const style = resolveSizeStyle(size);
    return (
        <div className="pinteg-field" style={style}>
            {!tableMode && caption && <label className="pinteg-label" htmlFor={name}>{caption}</label>}
            <input
                id={name}
                name={name}
                type="number"
                step="1"
                className="pinteg-input"
                value={value ?? ''}
                readOnly={readOnly}
                onChange={(e) => {
                    const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
                    onChange(name, Number.isNaN(val) ? undefined : val);
                }}
            />
        </div>
    );
};
