import React from 'react';
import { CoreFieldProps } from 'pinteg-core';
import { resolveSizeStyle } from '../../utils/ComponentSizeUtils';

export const IntegerField: React.FC<CoreFieldProps> = ({
    name, caption, value, size, readOnly, tableMode, onChange, onBlur, validationResult
}) => {
    const style = resolveSizeStyle(size);
    const hasError = validationResult && !validationResult.isValid;
    const inputClass = `pinteg-input ${hasError ? 'pinteg-input-' + validationResult.severity : ''}`;

    return (
        <div className="pinteg-field" style={style}>
            {!tableMode && caption && <label className="pinteg-label" htmlFor={name}>{caption}</label>}
            <input
                id={name}
                name={name}
                type="number"
                step="1"
                className={inputClass}
                value={value ?? ''}
                readOnly={readOnly}
                onChange={(e) => {
                    const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
                    onChange(name, Number.isNaN(val) ? undefined : val);
                }}
                onBlur={() => onBlur && onBlur(name)}
            />
            {hasError && !tableMode && (
                <span className={`pinteg-validation-msg pinteg-msg-${validationResult.severity}`}>
                    {validationResult.severity === 'error' ? '!' : '⚠'} {validationResult.message}
                </span>
            )}
        </div>
    );
};
