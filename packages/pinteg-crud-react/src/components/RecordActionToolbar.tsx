import React from 'react';
import { EditButton, SaveButton, CancelButton } from 'pinteg-react';
import { RecordStatus } from './RecordStatus';

export interface RecordActionToolbarProps {
    status: RecordStatus;
    onEdit: () => void;
    onCancelEdit: () => void;
    onSave: () => void;
    onCancelCreate?: () => void;
}

export const RecordActionToolbar: React.FC<RecordActionToolbarProps> = ({
    status,
    onEdit,
    onCancelEdit,
    onSave,
    onCancelCreate,
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
                    {status === 'viewing' && <EditButton size="medium" onClick={onEdit}>Edit</EditButton>}
                    {status === 'editing' && <CancelButton size="medium" onClick={onCancelEdit}>Cancel</CancelButton>}
                    <SaveButton size="medium" onClick={onSave} disabled={status !== 'editing'}>Save Changes</SaveButton>
                </>
            )}
        </div>
    );
};
