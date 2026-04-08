import { renderHook, act } from '@testing-library/react';
import { useTableState } from '../src/hooks/useTableState';

describe('useTableState', () => {
    it('initialises to empty array when no defaultValue given', () => {
        const { result } = renderHook(() => useTableState());
        const [data] = result.current;
        expect(data).toEqual([]);
    });

    it('initialises state from defaultValue when provided', () => {
        const rows = [{ name: 'Alice' }, { name: 'Bob' }];
        const { result } = renderHook(() => useTableState(rows));
        const [data] = result.current;
        expect(data).toEqual(rows);
    });

    it('state can be updated via setter', () => {
        const { result } = renderHook(() => useTableState());
        act(() => {
            const [, setData] = result.current;
            setData([{ name: 'Charlie' }]);
        });
        const [data] = result.current;
        expect(data).toEqual([{ name: 'Charlie' }]);
    });

    it('returns exactly two elements: data and setter', () => {
        const { result } = renderHook(() => useTableState());
        expect(result.current).toHaveLength(2);
        expect(typeof result.current[1]).toBe('function');
    });
});
