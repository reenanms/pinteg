import React from 'react';

export interface RecordDetailsHeaderProps {
    recordKey: string;
}

export const RecordDetailsHeader: React.FC<RecordDetailsHeaderProps> = ({ recordKey }) => {
    return (
        <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Record Details #{recordKey}
            </h4>
        </div>
    );
};
