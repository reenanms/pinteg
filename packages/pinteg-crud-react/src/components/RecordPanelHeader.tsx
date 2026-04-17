import React from 'react';
import { RecordStatus } from './RecordStatus';

export interface RecordPanelHeaderProps {
    recordKey: string;
    status: RecordStatus;
}

export const RecordPanelHeader: React.FC<RecordPanelHeaderProps> = ({ recordKey, status }) => {
    const isActive = status !== 'viewing';
    const badgeLabel = status === 'creating' ? 'New' : status === 'editing' ? 'Editing' : 'Viewing';
    const title = status === 'creating' ? 'New Record' : `Record #${recordKey}`;

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            paddingBottom: '0.875rem',
            borderBottom: '1px solid var(--color-border-subtle)',
        }}>
            <h3 style={{
                margin: 0,
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--color-text)',
                lineHeight: 1.3,
            }}>
                {title}
            </h3>

            <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                padding: '3px 10px',
                borderRadius: '20px',
                background: isActive
                    ? 'rgba(var(--color-primary-rgb, 99, 102, 241), 0.12)'
                    : 'var(--color-surface)',
                color: isActive
                    ? 'var(--color-primary)'
                    : 'var(--color-text-subtle)',
                border: '1px solid',
                borderColor: isActive
                    ? 'rgba(var(--color-primary-rgb, 99, 102, 241), 0.3)'
                    : 'var(--color-border-subtle)',
                transition: 'all 0.2s ease',
            }}>
                {badgeLabel}
            </span>
        </div>
    );
};
