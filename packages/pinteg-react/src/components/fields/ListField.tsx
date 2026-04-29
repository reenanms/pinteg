import React, { useState, useEffect } from 'react';
import { FieldRendererProps, IFieldRenderer } from 'pinteg-core';
import { resolveSizeStyle } from '../../utils/ComponentSizeUtils';
import { DataSourceManager } from 'pinteg-data-source';

function useDataSourceOptions(source?: string, parentValue?: any) {
    const [dynamicOptions, setDynamicOptions] = useState<any[]>([]);

    useEffect(() => {
        if (source) {
            let isMounted = true;
            const params = parentValue !== undefined ? { filter: parentValue } : undefined;
            DataSourceManager.resolve(source)(params)
                .then((data: any) => {
                    if (isMounted) setDynamicOptions(Array.isArray(data) ? data : []);
                })
                .catch(console.error);
            return () => { isMounted = false; };
        }
    }, [source, parentValue]);

    return dynamicOptions;
}

function resolveHardcodedOptions(options: any[], parentValue?: any) {
    if (parentValue === undefined) return options;
    return options.filter((opt: any) => {
        if (typeof opt === 'object') {
            return !opt.filter || opt.filter === parentValue;
        }
        return true;
    });
}

function resolveOption(opt: any): { val: any; label: any } {
    if (typeof opt === 'object') {
        return { val: opt.key, label: opt.caption };
    }
    return { val: opt, label: opt };
}

export const ListField: React.FC<FieldRendererProps> & IFieldRenderer = ({
    name, caption, value, size, readOnly, tableMode, onChange, onBlur, validationResult, props, formValues
}) => {
    const style = resolveSizeStyle(size);
    const parentValue = (props?.parent && formValues) ? formValues[props.parent] : undefined;

    const prevParentValue = React.useRef(parentValue);
    React.useEffect(() => {
        if (prevParentValue.current !== parentValue) {
            onChange(name, undefined);
            prevParentValue.current = parentValue;
        }
    }, [parentValue, name, onChange]);

    const dynamicOptions = useDataSourceOptions(props?.source, parentValue);
    const options = props?.source
        ? dynamicOptions
        : resolveHardcodedOptions(props?.options || [], parentValue);

    const hasError = validationResult && !validationResult.isValid;
    const inputClass = `pinteg-input ${hasError ? 'pinteg-input-' + validationResult.severity : ''}`;

    if (readOnly) {
        const activeOption = options.find((opt: any) => String(resolveOption(opt).val) === String(value));
        const label = activeOption ? resolveOption(activeOption).label : (value ?? '');

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
                className={inputClass}
                value={value ?? ''}
                onChange={(e) => {
                    onChange(name, e.target.value);
                    if (onBlur) onBlur(name);
                }}
                onBlur={() => onBlur && onBlur(name)}
            >
                <option value="">Select...</option>
                {options.map((opt: any, i: number) => {
                    const { val, label: lbl } = resolveOption(opt);
                    return <option key={val ?? i} value={val}>{lbl}</option>;
                })}
            </select>
            {hasError && !tableMode && (
                <span className={`pinteg-validation-msg pinteg-msg-${validationResult.severity}`}>
                    {validationResult.severity === 'error' ? '!' : '⚠'} {validationResult.message}
                </span>
            )}
        </div>
    );
};
