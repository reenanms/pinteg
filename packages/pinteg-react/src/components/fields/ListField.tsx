import React from 'react';
import { FieldRendererProps } from 'pinteg-core';
import { resolveSizeStyle } from '../../utils/ComponentSizeUtils';

export const ListField: React.FC<FieldRendererProps> = ({
    name, caption, value, size, readOnly, tableMode, onChange, props, formValues
}) => {
    const style = resolveSizeStyle(size);
    let options = props?.options || [];

    // Apply filtering if a parent is defined
    if (props?.parent && formValues) {
        const parentValue = formValues[props.parent];
        options = options.filter((opt: any) => {
            if (typeof opt === 'object') {
                return !opt.filter || opt.filter === parentValue;
            }
            return true;
        });
    }

    if (readOnly) {
        const activeOption = options.find((opt: any) => {
            const val = typeof opt === 'object' ? (opt.key ?? opt.value ?? opt.id) : opt;
            return String(val) === String(value);
        });
        const label = activeOption
            ? (typeof activeOption === 'object' ? (activeOption.caption ?? activeOption.label ?? activeOption.name) : activeOption)
            : (value ?? '');

        return (
            <div className="pinteg-field" style={style}>
                {!tableMode && caption && <label className="pinteg-label" htmlFor={name}>{caption}</label>}
                <input
                    id={name}
                    name={name}
                    type="text"
                    className="pinteg-input"
                    value={label}
                    readOnly
                />
            </div>
        );
    }

    return (
        <div className="pinteg-field" style={style}>
            {!tableMode && caption && <label className="pinteg-label" htmlFor={name}>{caption}</label>}
            <select
                id={name}
                name={name}
                className="pinteg-input"
                value={value ?? ''}
                onChange={(e) => onChange(name, e.target.value)}
            >
                <option value="">Select...</option>
                {options.map((opt: any, i: number) => {
                    const val = typeof opt === 'object' ? (opt.key ?? opt.value ?? opt.id) : opt;
                    const lbl = typeof opt === 'object' ? (opt.caption ?? opt.label ?? opt.name) : opt;
                    return <option key={val ?? i} value={val}>{lbl}</option>;
                })}
            </select>
        </div>
    );
};
