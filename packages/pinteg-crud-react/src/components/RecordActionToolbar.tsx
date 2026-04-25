import React from 'react';
import { EditButton, SaveButton, CancelButton } from 'pinteg-react';
import { RecordStatus } from './RecordStatus';

export interface RecordActionToolbarProps {
    status: RecordStatus;
    onEdit: () => void;
    onCancelEdit: () => void;
    onSave: () => void;
    onCancelCreate?: () => void;
    canUpdate?: boolean;
}

export const RecordActionToolbar: React.FC<RecordActionToolbarProps> = ({
    status,
    onEdit,
    onCancelEdit,
    onSave,
    onCancelCreate,
    canUpdate = true,
}) => {
    return (
        <div style={{
            display: 'flex',
            gap: '8px',
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--color-border-subtle)',
        }}>
            {status === 'creating' ? (
                <>
                    <CancelButton size="medium" onClick={onCancelCreate}>Cancel</CancelButton>
                    <SaveButton size="medium" onClick={onSave}>Save New</SaveButton>
                </>
            ) : (
                <>
                    {canUpdate && status === 'viewing' && <EditButton size="medium" onClick={onEdit}>Edit</EditButton>}
                    {canUpdate && status === 'editing' && <CancelButton size="medium" onClick={onCancelEdit}>Cancel</CancelButton>}
                    {canUpdate && <SaveButton size="medium" onClick={onSave} disabled={status !== 'editing'}>Save Changes</SaveButton>}
                </>
            )}
        </div>
    );
};
