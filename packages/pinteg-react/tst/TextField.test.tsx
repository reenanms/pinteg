import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { TextField } from '../src/components/fields/TextField';
import { vi } from 'vitest';

describe('TextField', () => {
    it('renders label and input', () => {
        const onChange = vi.fn();
        const { getByLabelText } = render(
            <TextField name="myText" caption="My Text" value="hello" size="full" readOnly={false} tableMode={false} onChange={onChange} />
        );
        const input = getByLabelText('My Text') as HTMLInputElement;
        expect(input.value).toBe('hello');
    });

    it('calls onChange with new value', () => {
        const onChange = vi.fn();
        const { getByLabelText } = render(
            <TextField name="myText" caption="My Text" value="hello" size="full" readOnly={false} tableMode={false} onChange={onChange} />
        );
        const input = getByLabelText('My Text');
        fireEvent.change(input, { target: { value: 'world' } });
        expect(onChange).toHaveBeenCalledWith('myText', 'world');
    });

    it('is readonly when readOnly=true', () => {
        const { getByLabelText } = render(
            <TextField name="myText" caption="My Text" value="hello" size="full" readOnly={true} tableMode={false} onChange={() => { }} />
        );
        const input = getByLabelText('My Text') as HTMLInputElement;
        expect(input.readOnly).toBe(true);
    });

    it('hides the label in tableMode', () => {
        const { container } = render(
            <TextField name="myText" caption="My Text" value="hello" readOnly={false} tableMode={true} onChange={() => { }} />
        );
        expect(container.querySelector('label')).toBeNull();
    });

    it('renders empty string when value is undefined', () => {
        const { container } = render(
            <TextField name="f" caption="F" value={undefined} readOnly={false} tableMode={false} onChange={() => { }} />
        );
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input.value).toBe('');
    });

    it('applies size style when size prop is provided', () => {
        const { container } = render(
            <TextField name="f" caption="F" value="x" size="M" readOnly={false} tableMode={false} onChange={() => { }} />
        );
        const field = container.querySelector('.pinteg-field') as HTMLElement;
        expect(field.style.flex).not.toBe('');
    });
});
