import React, { createRef } from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import { PIntegTable, PIntegTableRef } from '../src/components/PIntegTable';
import { ComponentSchema } from 'pinteg-core';

const schema: ComponentSchema = {
    name: { type: 'text', caption: 'Name' },
    age: { type: 'integer', caption: 'Age' }
};

describe('PIntegTable', () => {
    it('renders column headers from schema captions', () => {
        const { getByText } = render(<PIntegTable schema={schema} />);
        expect(getByText('Name')).toBeDefined();
        expect(getByText('Age')).toBeDefined();
    });

    it('renders a row per value entry', () => {
        const values = [
            { name: 'Alice', age: 30 },
            { name: 'Bob', age: 40 }
        ];
        const { container } = render(<PIntegTable schema={schema} value={values} />);
        const rows = container.querySelectorAll('tbody tr');
        expect(rows.length).toBe(2);
    });

    it('renders zero rows when value is empty', () => {
        const { container } = render(<PIntegTable schema={schema} value={[]} />);
        expect(container.querySelectorAll('tbody tr').length).toBe(0);
    });

    it('calls onChange with updated rows when a cell changes', () => {
        const onChange = vi.fn();
        const values = [{ name: 'Alice', age: 30 }];
        const { container } = render(
            <PIntegTable schema={schema} value={values} onChange={onChange} />
        );
        const inputs = container.querySelectorAll('input[type="text"]');
        fireEvent.change(inputs[0], { target: { value: 'Updated' } });
        expect(onChange).toHaveBeenCalledWith([{ name: 'Updated', age: 30 }]);
    });

    it('readOnly=true makes all inputs read-only', () => {
        const values = [{ name: 'Alice', age: 30 }];
        const { container } = render(<PIntegTable schema={schema} value={values} readOnly={true} />);
        const inputs = container.querySelectorAll('input');
        inputs.forEach(input => expect(input.readOnly).toBe(true));
    });

    it('uncontrolled: internal state updates on cell change', () => {
        const { container } = render(
            <PIntegTable schema={schema} defaultValue={[{ name: 'Alice', age: 30 }]} />
        );
        const input = container.querySelector('input[type="text"]') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'Bob' } });
        expect(input.value).toBe('Bob');
    });

    it('controlled: value prop drives rendered values', () => {
        const { container } = render(
            <PIntegTable schema={schema} value={[{ name: 'Controlled', age: 5 }]} onChange={() => { }} />
        );
        const input = container.querySelector('input[type="text"]') as HTMLInputElement;
        expect(input.value).toBe('Controlled');
    });

    it('ref.readValue() returns current rows', () => {
        const ref = createRef<PIntegTableRef>();
        const values = [{ name: 'Alice', age: 30 }];
        render(<PIntegTable schema={schema} value={values} onChange={() => { }} ref={ref} />);
        expect(ref.current?.readValue()).toEqual(values);
    });

    it('ref.writeValue() updates uncontrolled state', () => {
        const ref = createRef<PIntegTableRef>();
        const { container } = render(
            <PIntegTable schema={schema} defaultValue={[{ name: 'Old', age: 1 }]} ref={ref} />
        );
        act(() => {
            ref.current?.writeValue([{ name: 'New', age: 99 }]);
        });
        const input = container.querySelector('input[type="text"]') as HTMLInputElement;
        expect(input.value).toBe('New');
    });

    it('listOptions are passed through to list type fields', () => {
        const listSchema: ComponentSchema = {
            color: { type: 'list', caption: 'Color', options: ['red'] }
        };
        const { getByRole } = render(
            <PIntegTable
                schema={listSchema}
                value={[{ color: '' }]}
                listOptions={{ color: ['blue', 'green'] }}
            />
        );
        const select = getByRole('combobox') as HTMLSelectElement;
        const options = Array.from(select.options).map(o => o.value);
        expect(options).toContain('blue');
        expect(options).not.toContain('red');
    });

    it('applies style prop to the table element', () => {
        const { container } = render(
            <PIntegTable schema={schema} style={{ border: '1px solid red' }} />
        );
        const table = container.querySelector('table') as HTMLElement;
        expect(table.style.border).toBe('1px solid red');
    });
});
