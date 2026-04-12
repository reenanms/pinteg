import React from 'react';

export interface PIntegButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'default';
}

export const PIntegButton: React.FC<PIntegButtonProps> = ({ variant = 'default', className = '', children, ...props }) => {
    const variantClass = variant !== 'default' ? `pinteg-btn--${variant}` : '';
    return (
        <button className={`pinteg-btn ${variantClass} ${className}`.trim()} {...props}>
            {children}
        </button>
    );
};
