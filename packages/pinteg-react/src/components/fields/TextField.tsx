import React from 'react';
import { FieldRendererProps } from 'pinteg-core';
import { resolveSizeStyle } from '../../utils/ComponentSizeUtils';

export const TextField: React.FC<FieldRendererProps> = ({
    name, caption, value, size, readOnly, tableMode, onChange,
}) => {
    const style = resolveSizeStyle(size);
    return (
        <div className="pinteg-field" style={style}>
            {!tableMode && caption && <label className="pinteg-label" htmlFor={name}>{caption}</label>}
            <input
                id={name}
                name={name}
                type="text"
                className="pinteg-input"
                value={value ?? ''}
                readOnly={readOnly}
                onChange={(e) => onChange(name, e.target.value)}
            />
        </div>
    );
};
