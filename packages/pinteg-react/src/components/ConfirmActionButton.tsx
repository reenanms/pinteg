import React, { useState, useEffect } from 'react';
import { PIntegButton, PIntegButtonProps } from './PIntegButton';

export interface ConfirmActionButtonProps extends PIntegButtonProps {
    /** Callback triggered when the button is clicked in the confirmed state */
    onConfirm: () => void;
    /** Label to display during the confirmation state */
    confirmLabel?: string;
    /** Time in milliseconds to wait before reverting from confirmation state back to idle. Defaults to 3000ms. */
    timeout?: number;
}

/**
 * A specialized button that requires a second click to confirm an action.
 * This eliminates the need for browser popups (confirm()) and provides a smoother UX.
 */
export const ConfirmActionButton: React.FC<ConfirmActionButtonProps> = ({
    onConfirm,
    confirmLabel = 'Are you sure?',
    timeout = 3000,
    children,
    ...props
}) => {
    const [isConfirming, setIsConfirming] = useState(false);

    useEffect(() => {
        if (isConfirming) {
            const timer = setTimeout(() => setIsConfirming(false), timeout);
            return () => clearTimeout(timer);
        }
    }, [isConfirming, timeout]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isConfirming) {
            onConfirm();
            setIsConfirming(false);
        } else {
            setIsConfirming(true);
        }
    };

    // If we're confirming, we might want to slightly emphasize the state change (e.g. bold or different style)
    // For now we just swap the children.
    return (
        <PIntegButton
            {...props}
            onClick={handleClick}
            className={`${props.className || ''} ${isConfirming ? 'pinteg-btn--confirming' : ''}`.trim()}
        >
            {isConfirming ? confirmLabel : children}
        </PIntegButton>
    );
};
