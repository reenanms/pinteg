import React, { createRef } from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import { PIntegForm, PIntegFormRef } from '../src/components/PIntegForm';
import { ComponentSchema } from 'pinteg-core';
import { SchemaRegistry } from '../src/registry/SchemaRegistry';

const schema: ComponentSchema = {
    name: { type: 'text', caption: 'Name' },
    age: { type: 'integer', caption: 'Age' }
};

describe('PIntegForm', () => {
    it('renders all schema fields', () => {
        const { getByLabelText } = render(<PIntegForm schema={schema} />);
        expect(getByLabelText('Name')).toBeDefined();
        expect(getByLabelText('Age')).toBeDefined();
    });

    it('calls onChange when a field changes', () => {
        const onChange = vi.fn();
        const { getByLabelText } = render(<PIntegForm schema={schema} onChange={onChange} />);
        fireEvent.change(getByLabelText('Name'), { target: { value: 'John' } });
        expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ name: 'John' }));
    });

    it('respects readOnly prop', () => {
        const { getByLabelText } = render(<PIntegForm schema={schema} readOnly={true} />);
        expect((getByLabelText('Name') as HTMLInputElement).readOnly).toBe(true);
        expect((getByLabelText('Age') as HTMLInputElement).readOnly).toBe(true);
    });

    it('uncontrolled: internal state updates on field change', () => {
        const { getByLabelText } = render(<PIntegForm schema={schema} />);
        const input = getByLabelText('Name') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'Alice' } });
        expect(input.value).toBe('Alice');
    });

    it('controlled: value prop drives rendered values', () => {
        const { getByLabelText } = render(
            <PIntegForm schema={schema} value={{ name: 'Bob', age: 25 }} onChange={() => { }} />
        );
        expect((getByLabelText('Name') as HTMLInputElement).value).toBe('Bob');
    });

    it('controlled: onChange receives merged object', () => {
        const onChange = vi.fn();
        const { getByLabelText } = render(
            <PIntegForm schema={schema} value={{ name: 'Bob', age: 25 }} onChange={onChange} />
        );
        fireEvent.change(getByLabelText('Name'), { target: { value: 'Carol' } });
        expect(onChange).toHaveBeenCalledWith({ name: 'Carol', age: 25 });
    });

    it('defaultValue pre-fills the form', () => {
        const { getByLabelText } = render(
            <PIntegForm schema={schema} defaultValue={{ name: 'Pre', age: 5 }} />
        );
        expect((getByLabelText('Name') as HTMLInputElement).value).toBe('Pre');
    });

    it('ref.readValue() returns current values', () => {
        const ref = createRef<PIntegFormRef>();
        render(<PIntegForm schema={schema} value={{ name: 'Alice', age: 30 }} onChange={() => { }} ref={ref} />);
        expect(ref.current?.readValue()).toEqual({ name: 'Alice', age: 30 });
    });

    it('ref.writeValue() updates uncontrolled state', () => {
        const ref = createRef<PIntegFormRef>();
        const { getByLabelText } = render(<PIntegForm schema={schema} ref={ref} />);
        act(() => {
            ref.current?.writeValue({ name: 'Updated', age: 99 });
        });
        // After writeValue the input should show the updated name
        expect((getByLabelText('Name') as HTMLInputElement).value).toBe('Updated');
    });

    it('orientation="horizontal" adds pinteg-area-horizontal class', () => {
        const { container } = render(<PIntegForm schema={schema} orientation="horizontal" />);
        expect(container.querySelector('.pinteg-area-horizontal')).not.toBeNull();
    });

    it('orientation="vertical" adds pinteg-area-vertical class', () => {
        const { container } = render(<PIntegForm schema={schema} orientation="vertical" />);
        expect(container.querySelector('.pinteg-area-vertical')).not.toBeNull();
    });

    it('defaults to pinteg-area-vertical when orientation is not set', () => {
        const { container } = render(<PIntegForm schema={schema} />);
        expect(container.querySelector('.pinteg-area-vertical')).not.toBeNull();
    });

    it('passes style prop to the root div', () => {
        const { container } = render(
            <PIntegForm schema={schema} style={{ backgroundColor: 'red' }} />
        );
        const form = container.querySelector('.pinteg-form') as HTMLElement;
        expect(form.style.backgroundColor).toBe('red');
    });

    it('renders a nested schema field when type matches SchemaRegistry', () => {
        const nestedSchemaName = `address-${Date.now()}`;
        SchemaRegistry.register(nestedSchemaName, {
            street: { type: 'text', caption: 'Street' }
        });
        const nestedSchema: ComponentSchema = {
            address: { type: nestedSchemaName, caption: 'Address' }
        };
        const { getByLabelText } = render(<PIntegForm schema={nestedSchema} value={{ address: { street: '1 Main' } }} onChange={() => { }} />);
        expect(getByLabelText('Street')).toBeDefined();
    });

    it('listOptions are passed through to list fields', () => {
        const listSchema: ComponentSchema = {
            color: { type: 'list', caption: 'Color', options: ['red'] }
        };
        const { getByRole } = render(
            <PIntegForm schema={listSchema} listOptions={{ color: ['blue', 'green'] }} />
        );
        const select = getByRole('combobox') as HTMLSelectElement;
        const options = Array.from(select.options).map(o => o.value);
        expect(options).toContain('blue');
        expect(options).not.toContain('red');
    });
});
