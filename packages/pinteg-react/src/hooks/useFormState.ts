import { useState } from 'react';
import {  ComponentSchema  } from 'pinteg-core';

export function useFormState(schema: ComponentSchema, defaultValue?: Record<string, any>) {
    const [state, setState] = useState<Record<string, any>>(() => {
        if (defaultValue) return defaultValue;
        const initial: Record<string, any> = {};
        Object.keys(schema).forEach(key => {
            initial[key] = undefined;
        });
        return initial;
    });

    return [state, setState] as const;
}
