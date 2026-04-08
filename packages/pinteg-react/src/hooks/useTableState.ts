import { useState } from 'react';

export function useTableState(defaultValue?: any[]) {
    const [data, setData] = useState<any[]>(defaultValue || []);
    return [data, setData] as const;
}
