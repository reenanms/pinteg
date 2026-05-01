import { TemplateFunction } from './types.js';

export const BuiltInFunctions: Map<string, TemplateFunction> = new Map([
    ['SUM', (...args: any[]) => args.reduce((acc, val) => acc + (Number(val) || 0), 0)],
    ['SUBSTRING', (text: string, start: number, length?: number) => {
        if (typeof text !== 'string') return '';
        return length !== undefined ? text.substring(start, start + length) : text.substring(start);
    }],
    ['UPPER', (text: string) => (typeof text === 'string' ? text.toUpperCase() : '')],
    ['LOWER', (text: string) => (typeof text === 'string' ? text.toLowerCase() : '')],
    ['IF', (condition: any, trueValue: any, falseValue: any) => (condition ? trueValue : falseValue)],
]);
