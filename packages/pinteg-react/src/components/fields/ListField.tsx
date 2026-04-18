import React, { useState, useEffect } from 'react';
import { FieldRendererProps } from 'pinteg-core';
import { resolveSizeStyle } from '../../utils/ComponentSizeUtils';
import { DataSourceManager } from 'pinteg-data-source';

function useDataSourceOptions(source?: string, parentValue?: any) {
    const [dynamicOptions, setDynamicOptions] = useState<any[]>([]);

    useEffect(() => {
        if (source) {
            let isMounted = true;
            const params = parentValue !== undefined ? { filter: parentValue } : undefined;
            const sourceInstance = DataSourceManager.resolve(source);
            sourceInstance.read(params)
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

export const ListField: React.FC<FieldRendererProps> = ({
    name, caption, value, size, readOnly, tableMode, onChange, props, formValues
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
                className="pinteg-input"
                value={value ?? ''}
                onChange={(e) => onChange(name, e.target.value)}
            >
                <option value="">Select...</option>
                {options.map((opt: any, i: number) => {
                    const { val, label: lbl } = resolveOption(opt);
                    return <option key={val ?? i} value={val}>{lbl}</option>;
                })}
            </select>
        </div>
    );
};
