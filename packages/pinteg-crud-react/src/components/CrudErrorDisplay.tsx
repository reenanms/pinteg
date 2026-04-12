import React from 'react';

export interface CrudErrorDisplayProps {
    error: string | null;
}

export const CrudErrorDisplay: React.FC<CrudErrorDisplayProps> = ({ error }) => {
    if (!error) return null;

    return (
        <div style={{
            background: 'var(--color-danger-bg, #fee2e2)',
            color: 'var(--color-danger, #ef4444)',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            border: '1px solid var(--color-danger)'
        }}>
            <strong>Error:</strong> {error}
        </div>
    );
};
