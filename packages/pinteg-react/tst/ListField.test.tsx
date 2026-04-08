import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ListField } from '../src/components/fields/ListField';
import { vi } from 'vitest';

describe('ListField', () => {
    it('renders all string options', () => {
        const { getByLabelText, getByText } = render(
            <ListField name="myList" caption="My List" value="A" size="full" readOnly={false} tableMode={false} onChange={() => { }} props={{ options: ['A', 'B'] }} />
        );
        expect(getByLabelText('My List')).toBeDefined();
        expect(getByText('A')).toBeDefined();
        expect(getByText('B')).toBeDefined();
    });

    it('renders object options with caption as label', () => {
        const options = [{ key: '1', caption: 'Option One' }, { key: '2', caption: 'Option Two' }];
        const { getByText } = render(
            <ListField name="myList" caption="My List" value="" readOnly={false} tableMode={false} onChange={() => { }} props={{ options }} />
        );
        expect(getByText('Option One')).toBeDefined();
        expect(getByText('Option Two')).toBeDefined();
    });

    it('filters options by parent value', () => {
        const options = [
            { key: 'a', caption: 'A', filter: 'parent1' },
            { key: 'b', caption: 'B', filter: 'parent2' },
            { key: 'c', caption: 'C' }, // no filter → always shown
        ];
        const formValues = { parentField: 'parent1' };
        const { queryByText } = render(
            <ListField
                name="child"
                caption="Child"
                value=""
                readOnly={false}
                tableMode={false}
                onChange={() => { }}
                formValues={formValues}
                props={{ options, parent: 'parentField' }}
            />
        );
        expect(queryByText('A')).not.toBeNull(); // matches filter
        expect(queryByText('C')).not.toBeNull(); // no filter, always shown
        expect(queryByText('B')).toBeNull();     // filtered out
    });

    it('calls onChange with the selected value', () => {
        const onChange = vi.fn();
        const { getByLabelText } = render(
            <ListField name="myList" caption="My List" value="" readOnly={false} tableMode={false} onChange={onChange} props={{ options: ['X', 'Y'] }} />
        );
        fireEvent.change(getByLabelText('My List'), { target: { value: 'X' } });
        expect(onChange).toHaveBeenCalledWith('myList', 'X');
    });

    it('is disabled when readOnly=true', () => {
        const { getByLabelText } = render(
            <ListField name="myList" caption="My List" value="" readOnly={true} tableMode={false} onChange={() => { }} props={{ options: ['A'] }} />
        );
        expect((getByLabelText('My List') as HTMLSelectElement).disabled).toBe(true);
    });

    it('hides the label in tableMode', () => {
        const { container } = render(
            <ListField name="myList" caption="My List" value="" readOnly={false} tableMode={true} onChange={() => { }} props={{ options: ['A'] }} />
        );
        expect(container.querySelector('label')).toBeNull();
    });

    it('renders with no crash when props is undefined', () => {
        const { container } = render(
            <ListField name="myList" caption="My List" value="" readOnly={false} tableMode={false} onChange={() => { }} />
        );
        expect(container.querySelector('select')).not.toBeNull();
    });

    it('includes the default "Select..." option', () => {
        const { getByText } = render(
            <ListField name="myList" caption="My List" value="" readOnly={false} tableMode={false} onChange={() => { }} props={{ options: ['A'] }} />
        );
        expect(getByText('Select...')).toBeDefined();
    });
});
