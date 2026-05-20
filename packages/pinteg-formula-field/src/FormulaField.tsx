import React, { useMemo } from 'react';
import { CoreFieldProps, Sizes, IComponentSize } from 'pinteg-core';
import { TemplateEngine } from 'pinteg-string-template';

const engine = new TemplateEngine();

function sizeToStyle(size: IComponentSize): Record<string, string> {
    const { width } = size;
    const pct = `${width * 100}%`;
    const gapFactor = 1 - width;
    return {
        flex: `${width} 1 calc(${pct} - var(--pinteg-col-gap, 12px) * ${gapFactor})`,
    };
}

function resolveSizeStyle(size?: string): Record<string, string> {
    if (!size) return sizeToStyle({ name: 'FULL', width: 1 });
    const preset = (Sizes as Record<string, IComponentSize>)[size];
    if (!preset) return sizeToStyle({ name: 'FULL', width: 1 });
    return sizeToStyle(preset);
}

export const FormulaField: React.FC<CoreFieldProps> = ({
    name, caption, size, tableMode, formValues, props
}) => {
    const formula = props?.formula || props?.props?.formula || '';
    const displayValue = useMemo(() => {
        if (!formula) return '';
        try {
            // Ensure numeric values are numbers, not strings, if possible
            const context = { ...formValues };
            for (const key in context) {
                if (typeof context[key] === 'string' && !isNaN(Number(context[key])) && context[key] !== '') {
                    context[key] = Number(context[key]);
                }
            }
            return engine.render(formula, context);
        } catch (e) {
            console.error(`[pinteg-formula-field] Error evaluating formula for field ${name}:`, e);
            return 'Error';
        }
    }, [formula, formValues, name]);

    const style = resolveSizeStyle(size);

    return (
        <div className="pinteg-field" style={style}>
            {!tableMode && caption && <label className="pinteg-label" htmlFor={name}>{caption}</label>}
            <input 
                id={name}
                name={name}
                type="text"
                className="pinteg-input" 
                value={displayValue}
                readOnly={true}
            />
        </div>
    );
};
