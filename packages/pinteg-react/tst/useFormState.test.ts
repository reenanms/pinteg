import { renderHook, act } from '@testing-library/react';
import { useFormState } from '../src/hooks/useFormState';

const schema = {
    name: { type: 'text', caption: 'Name' },
    age: { type: 'integer', caption: 'Age' },
};

describe('useFormState', () => {
    it('initialises all schema keys to undefined when no defaultValue given', () => {
        const { result } = renderHook(() => useFormState(schema));
        const [state] = result.current;
        expect(state).toHaveProperty('name', undefined);
        expect(state).toHaveProperty('age', undefined);
    });

    it('initialises state from defaultValue when provided', () => {
        const defaultValue = { name: 'Alice', age: 30 };
        const { result } = renderHook(() => useFormState(schema, defaultValue));
        const [state] = result.current;
        expect(state.name).toBe('Alice');
        expect(state.age).toBe(30);
    });

    it('state can be updated via setState', () => {
        const { result } = renderHook(() => useFormState(schema));
        act(() => {
            const [, setState] = result.current;
            setState({ name: 'Bob', age: 25 });
        });
        const [state] = result.current;
        expect(state.name).toBe('Bob');
        expect(state.age).toBe(25);
    });

    it('returns exactly two elements: state and setter', () => {
        const { result } = renderHook(() => useFormState(schema));
        expect(result.current).toHaveLength(2);
        expect(typeof result.current[1]).toBe('function');
    });
});
