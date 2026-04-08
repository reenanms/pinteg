import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { IntegerField } from '../src/components/fields/IntegerField';
import { vi } from 'vitest';

describe('IntegerField', () => {
    it('restricts input to integers', () => {
        const onChange = vi.fn();
        const { getByLabelText } = render(
            <IntegerField name="myInt" caption="My Int" value={42} size="full" readOnly={false} tableMode={false} onChange={onChange} />
        );
        const input = getByLabelText('My Int');
        fireEvent.change(input, { target: { value: '43' } });
        expect(onChange).toHaveBeenCalledWith('myInt', 43);
    });

    it('calls onChange with undefined when input is cleared', () => {
        const onChange = vi.fn();
        const { getByLabelText } = render(
            <IntegerField name="myInt" caption="My Int" value={5} readOnly={false} tableMode={false} onChange={onChange} />
        );
        fireEvent.change(getByLabelText('My Int'), { target: { value: '' } });
        expect(onChange).toHaveBeenCalledWith('myInt', undefined);
    });

    it('renders empty string when value is undefined', () => {
        const { container } = render(
            <IntegerField name="myInt" caption="My Int" value={undefined} readOnly={false} tableMode={false} onChange={() => { }} />
        );
        expect((container.querySelector('input') as HTMLInputElement).value).toBe('');
    });

    it('is readonly when readOnly=true', () => {
        const { getByLabelText } = render(
            <IntegerField name="myInt" caption="My Int" value={0} readOnly={true} tableMode={false} onChange={() => { }} />
        );
        expect((getByLabelText('My Int') as HTMLInputElement).readOnly).toBe(true);
    });

    it('hides the label in tableMode', () => {
        const { container } = render(
            <IntegerField name="myInt" caption="My Int" value={0} readOnly={false} tableMode={true} onChange={() => { }} />
        );
        expect(container.querySelector('label')).toBeNull();
    });

    it('has step="1" on the number input', () => {
        const { container } = render(
            <IntegerField name="myInt" caption="My Int" value={0} readOnly={false} tableMode={false} onChange={() => { }} />
        );
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input.step).toBe('1');
    });
});
