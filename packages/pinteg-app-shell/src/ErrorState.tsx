import React from 'react';

export interface ErrorStateProps {
    title?: string;
    message: string;
    onHomeClick: () => void;
}

/**
 * Centralized Error State component for unauthorized or invalid paths.
 */
export const ErrorState = ({ title = 'Access Denied', message, onHomeClick }: ErrorStateProps) => {
    return (
        <div className="pinteg-shell-error" role="alert" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            textAlign: 'center', 
            padding: '4rem 2rem',
            background: 'var(--color-surface, #ffffff)',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            maxWidth: '500px',
            margin: '4rem auto',
            border: '1px solid var(--color-border-subtle, #eaeaea)'
        }}>
            <div style={{
                background: 'rgba(220, 53, 69, 0.1)',
                color: 'var(--color-danger, #dc3545)',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
            }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h3 style={{ 
                margin: '0 0 0.5rem', 
                color: 'var(--color-text, #333)', 
                fontWeight: 700, 
                fontSize: '1.5rem',
                letterSpacing: '-0.02em'
            }}>
                {title}
            </h3>
            <p style={{ 
                margin: '0 0 2rem', 
                color: 'var(--color-secondary, #666)',
                fontSize: '1rem',
                lineHeight: 1.6,
                maxWidth: '400px'
            }}>
                {message}
            </p>
            <button 
                onClick={onHomeClick}
                style={{
                    padding: '0.875rem 2rem',
                    background: 'var(--color-primary, #007bff)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(0, 123, 255, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 123, 255, 0.35)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.25)';
                }}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Go Home
            </button>
        </div>
    );
};
