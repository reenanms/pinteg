import React from 'react';
import { PIntegButton, PIntegButtonProps } from './PIntegButton';
import { ConfirmActionButton } from './ConfirmActionButton';

export const SaveButton: React.FC<PIntegButtonProps> = (props) => (
    <PIntegButton variant="primary" {...props}>
        {props.children || 'Save'}
    </PIntegButton>
);

export const CancelButton: React.FC<PIntegButtonProps> = (props) => (
    <PIntegButton variant="secondary" {...props}>
        {props.children || 'Cancel'}
    </PIntegButton>
);

export interface DeleteButtonProps extends PIntegButtonProps {
    requireConfirm?: boolean;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick, requireConfirm = true, ...props }) => {
    if (requireConfirm && onClick) {
        return (
            <ConfirmActionButton
                variant="danger"
                onConfirm={() => onClick({} as any)}
                confirmLabel="Click to confirm delete!"
                {...props}
            >
                {props.children || 'Delete'}
            </ConfirmActionButton>
        );
    }

    return (
        <PIntegButton variant="danger" onClick={onClick} {...props}>
            {props.children || 'Delete'}
        </PIntegButton>
    );
};

export const EditButton: React.FC<PIntegButtonProps> = (props) => (
    <PIntegButton variant="primary" {...props}>
        {props.children || 'Edit'}
    </PIntegButton>
);

export const CreateButton: React.FC<PIntegButtonProps> = (props) => (
    <PIntegButton variant="primary" {...props}>
        {props.children || 'Create New'}
    </PIntegButton>
);
