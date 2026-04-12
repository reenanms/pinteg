import React from 'react';
import { useCrudContext } from '../CrudContext';

export interface CrudBreadcrumbItem {
    label: string;
    path?: '/' | '/create' | '/update';
    active?: boolean;
}

export interface CrudBreadcrumbsProps {
    items: CrudBreadcrumbItem[];
}

export const CrudBreadcrumbs: React.FC<CrudBreadcrumbsProps> = ({ items }) => {
    const { navigate } = useCrudContext();

    return (
        <nav style={{ marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--color-primary)', display: 'flex', gap: '8px' }}>
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <span
                        style={{
                            opacity: item.active ? 1 : 0.6,
                            cursor: item.path ? 'pointer' : 'default'
                        }}
                        onClick={() => item.path && navigate({ path: item.path })}
                    >
                        {item.label}
                    </span>
                    {index < items.length - 1 && <span style={{ opacity: 0.6 }}>/</span>}
                </React.Fragment>
            ))}
        </nav>
    );
};
