import React from 'react';
import { PIntegButton, PIntegButtonProps } from './PIntegButton';
import { ConfirmActionButton } from './ConfirmActionButton';
import { PlusIcon, SaveIcon, TrashIcon, XIcon, PencilIcon, CheckIcon } from './Icons';

export const SaveButton: React.FC<PIntegButtonProps> = (props) => (
    <PIntegButton variant="primary" icon={<SaveIcon />} {...props}>
        {props.children || 'Save'}
    </PIntegButton>
);

export const CancelButton: React.FC<PIntegButtonProps> = (props) => (
    <PIntegButton variant="secondary" icon={<XIcon />} {...props}>
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
                icon={<TrashIcon />}
                confirmIcon={<CheckIcon />}
                {...props}
            >
                {props.children || 'Delete'}
            </ConfirmActionButton>
        );
    }

    return (
        <PIntegButton variant="danger" icon={<TrashIcon />} onClick={onClick} {...props}>
            {props.children || 'Delete'}
        </PIntegButton>
    );
};

export const EditButton: React.FC<PIntegButtonProps> = (props) => (
    <PIntegButton variant="secondary" icon={<PencilIcon />} {...props}>
        {props.children || 'Edit'}
    </PIntegButton>
);

export const CreateButton: React.FC<PIntegButtonProps> = (props) => (
    <PIntegButton variant="primary" icon={<PlusIcon />} {...props}>
        {props.children || 'Create New'}
    </PIntegButton>
);
