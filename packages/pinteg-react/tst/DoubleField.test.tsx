import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { DoubleField } from '../src/components/fields/DoubleField';
import { vi } from 'vitest';

describe('DoubleField', () => {
    it('allows decimals', () => {
        const onChange = vi.fn();
        const { getByLabelText } = render(
            <DoubleField name="myDouble" caption="My Double" value={42.5} size="full" readOnly={false} tableMode={false} onChange={onChange} />
        );
        const input = getByLabelText('My Double');
        fireEvent.change(input, { target: { value: '43.5' } });
        expect(onChange).toHaveBeenCalledWith('myDouble', 43.5);
    });

    it('calls onChange with undefined when input is cleared', () => {
        const onChange = vi.fn();
        const { getByLabelText } = render(
            <DoubleField name="myDouble" caption="My Double" value={1.5} readOnly={false} tableMode={false} onChange={onChange} />
        );
        fireEvent.change(getByLabelText('My Double'), { target: { value: '' } });
        expect(onChange).toHaveBeenCalledWith('myDouble', undefined);
    });

    it('renders empty string when value is undefined', () => {
        const { container } = render(
            <DoubleField name="myDouble" caption="My Double" value={undefined} readOnly={false} tableMode={false} onChange={() => { }} />
        );
        expect((container.querySelector('input') as HTMLInputElement).value).toBe('');
    });

    it('is readonly when readOnly=true', () => {
        const { getByLabelText } = render(
            <DoubleField name="myDouble" caption="My Double" value={0} readOnly={true} tableMode={false} onChange={() => { }} />
        );
        expect((getByLabelText('My Double') as HTMLInputElement).readOnly).toBe(true);
    });

    it('hides the label in tableMode', () => {
        const { container } = render(
            <DoubleField name="myDouble" caption="My Double" value={0} readOnly={false} tableMode={true} onChange={() => { }} />
        );
        expect(container.querySelector('label')).toBeNull();
    });

    it('has step="any" on the number input', () => {
        const { container } = render(
            <DoubleField name="myDouble" caption="My Double" value={0} readOnly={false} tableMode={false} onChange={() => { }} />
        );
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input.step).toBe('any');
    });
});
