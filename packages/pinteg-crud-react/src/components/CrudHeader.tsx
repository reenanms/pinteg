import React from 'react';

export interface CrudHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
    /** Horizontal alignment of the actions row. Defaults to 'start'. */
    actionsAlign?: 'start' | 'end' | 'center';
    /** If true, actions will expand to fill all available horizontal space. */
    actionsFullWidth?: boolean;
}

export const CrudHeader: React.FC<CrudHeaderProps> = ({
    title,
    description,
    children,
    actionsAlign = 'start',
    actionsFullWidth = false
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
                        <div style={{
                            flex: actionsFullWidth ? '1 1 200px' : 'none',
                            display: 'flex',
                            minWidth: actionsFullWidth ? '200px' : 'auto'
                        }}>
                            {React.isValidElement(child) ? React.cloneElement(child, {
                                ...child.props,
                                style: {
                                    width: '100%',
                                    ...child.props.style
                                }
                            } as any) : child}
                        </div>
                    ))}
                </div>
            )}
        </header>
    );
};
