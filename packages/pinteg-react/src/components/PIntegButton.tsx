import React from 'react';

export interface PIntegButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'default';
    size?: 'small' | 'medium' | 'large';
    icon?: React.ReactNode;
}

export const PIntegButton: React.FC<PIntegButtonProps> = ({
    variant = 'default',
    size = 'medium',
    className = '',
    children,
    icon,
    style,
    ...props
}) => {
    const variantClass = variant !== 'default' ? `pinteg-btn--${variant}` : '';
    const sizeClass = `pinteg-btn--${size}`;

    return (
        <button
            className={`pinteg-btn ${variantClass} ${sizeClass} ${className}`.trim()}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: children ? (size === 'small' ? '4px' : '8px') : '0',
                cursor: props.disabled ? 'not-allowed' : undefined,
                pointerEvents: props.disabled ? 'none' : undefined,
                ...style
            }}
            {...props}
        >
            {icon && React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, {
                size: size === 'small' ? 14 : (size === 'large' ? 24 : 18)
            } as any) : icon}
            {children}
        </button>
    );
};
