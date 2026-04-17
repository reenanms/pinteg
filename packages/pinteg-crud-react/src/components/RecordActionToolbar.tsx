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
                    <SaveButton size="small" onClick={onSave}>Save New Record</SaveButton>
                    <CancelButton size="small" onClick={onCancelCreate}>Cancel</CancelButton>
                </>
            ) : (
                <>
                    {status === 'viewing' && <EditButton size="small" onClick={onEdit}>Edit Record</EditButton>}
                    {status === 'editing' && <CancelButton size="small" onClick={onCancelEdit}>Cancel</CancelButton>}
                    <SaveButton size="small" onClick={onSave} disabled={status !== 'editing'}>Save Changes</SaveButton>
                </>
            )}
        </div>
    );
};
