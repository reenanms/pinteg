import React from 'react';
import { ComponentSchema } from 'pinteg-core';
import { RecordEditor } from './RecordEditor';
import { DangerZone } from './DangerZone';
import { RecordPanelHeader } from './RecordPanelHeader';
import { RecordActionToolbar } from './RecordActionToolbar';
import { RecordStatus } from './RecordStatus';

export interface RecordAccordionDetailsProps {
    recordKey: string;
    schema: ComponentSchema;
    editData: any;
    setEditData: (data: any) => void;
    status: RecordStatus;
    onStatusChange: (s: RecordStatus) => void;
    handleSave: () => void;
    handleDelete: () => void;
    onCancelCreate?: () => void;
}

export const RecordAccordionDetails: React.FC<RecordAccordionDetailsProps> = ({
    recordKey,
    schema,
    editData,
    setEditData,
    status,
    onStatusChange,
    handleSave,
    handleDelete,
    onCancelCreate,
}) => {
    return (
        <div className="pinteg-accordion-details">

            <RecordPanelHeader
                recordKey={recordKey}
                status={status}
            />

            <RecordEditor
                schema={schema}
                data={editData}
                onChange={setEditData}
                isEditing={status === 'editing' || status === 'creating'}
            />

            <RecordActionToolbar
                status={status}
                onEdit={() => onStatusChange('editing')}
                onCancelEdit={() => onStatusChange('viewing')}
                onSave={handleSave}
                onCancelCreate={onCancelCreate}
            />

            {status !== 'creating' && (
                <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border-subtle)' }}>
                    <DangerZone
                        onDelete={handleDelete}
                        disabled={status === 'editing'}
                    />
                </div>
            )}

        </div>
    );
};

