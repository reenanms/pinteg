import React from 'react';
import { DeleteButton } from 'pinteg-react';

export interface DangerZoneProps {
    onDelete: () => void;
    disabled?: boolean;
    label?: string;
    description?: string;
}

export const DangerZone: React.FC<DangerZoneProps> = ({
    onDelete,
    disabled = false,
    label = "Danger Zone",
    description = "Once you delete this record, there is no going back. Please be certain."
}) => {
    return (
        <div className="pinteg-danger-zone">
            <div className="pinteg-danger-zone__content">
                <h4 className="pinteg-danger-zone__title">
                    {label}
                </h4>
                <p className="pinteg-danger-zone__description">
                    {description}
                </p>
            </div>
            <DeleteButton size="small" onClick={onDelete} disabled={disabled}>
                Delete Record
            </DeleteButton>
        </div>
    );
};
