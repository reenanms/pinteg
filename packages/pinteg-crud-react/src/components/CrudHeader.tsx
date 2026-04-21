import React from 'react';

export interface CrudHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
    actionsAlign?: 'start' | 'end' | 'center';
}

export const CrudHeader: React.FC<CrudHeaderProps> = ({
    title,
    description,
    children,
    actionsAlign = 'start'
}) => {
    return (
        <header style={{ marginBottom: '2.5rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '2.2rem', fontWeight: 700 }}>{title}</h2>
                {description && <p style={{ margin: 0, color: 'var(--color-text-subtle)', fontSize: '1.1rem' }}>{description}</p>}
            </div>

            {children && (
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                    borderTop: '1px solid var(--color-border-subtle)',
                    paddingTop: '1.5rem',
                    alignItems: 'center',
                    justifyContent: actionsAlign === 'end' ? 'flex-end' : (actionsAlign === 'center' ? 'center' : 'flex-start')
                }}>
                    {React.Children.map(children, child => (
                        <div className="pinteg-crud-header-action-item"
                            style={{
                                flex: 'none',
                                display: 'flex',
                            }}>
                            {child}
                        </div>
                    ))}
                </div>
            )}
        </header>
    );
};
