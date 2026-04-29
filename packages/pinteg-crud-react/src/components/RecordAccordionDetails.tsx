import React, { useRef, useState } from 'react';
import { ComponentSchema } from 'pinteg-core';
import { RecordEditor } from './RecordEditor';
import { DangerZone } from './DangerZone';
import { RecordPanelHeader } from './RecordPanelHeader';
import { RecordActionToolbar } from './RecordActionToolbar';
import { RecordStatus } from './RecordStatus';
import { SchemaValidationSummary } from 'pinteg-react';

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
    canUpdate?: boolean;
    canDelete?: boolean;
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
    canUpdate,
    canDelete
}) => {
    // Snapshot of data captured when entering edit mode — used to revert on cancel
    const originalDataRef = useRef<any>(null);

    // Local validation state
    const [validationSummary, setValidationSummary] = useState<SchemaValidationSummary | null>(null);
    const [forceValidate, setForceValidate] = useState(false);

    const handleStartEdit = () => {
        originalDataRef.current = { ...editData };
        setValidationSummary(null);
        setForceValidate(false);
        onStatusChange('editing');
    };

    const onCancelEdit = () => {
        if (originalDataRef.current !== null) {
            setEditData(originalDataRef.current);
            originalDataRef.current = null;
        }
        setValidationSummary(null);
        setForceValidate(false);
        onStatusChange('viewing');
    };

    const checkWarnings = async () => {
        const { SchemaValidator } = await import('pinteg-react');
        const summary = await SchemaValidator.validateSchema(schema, editData);

        setForceValidate(true);
        setValidationSummary(summary);

        if (summary.errors.length > 0) {
            throw new Error('Validation failed'); // Abort save
        }
        if (summary.warnings.length > 0) {
            return true; // Require confirmation
        }

        return !summary.isValid; // Valid, proceed to onSave immediately
    };

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
                forceValidate={forceValidate}
            />

            {validationSummary && (validationSummary.errors.length > 0 || validationSummary.warnings.length > 0) && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '8px', border: '1px solid', backgroundColor: validationSummary.errors.length > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)', borderColor: validationSummary.errors.length > 0 ? 'var(--color-danger)' : 'var(--color-warning)' }}>
                    {validationSummary.errors.length > 0 && (
                        <div style={{ color: 'var(--color-danger)' }}>
                            <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Please fix the following errors before saving:</strong>
                            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                                {validationSummary.errors.map((e, idx) => <li key={`err-${idx}`}><strong>{e.caption}:</strong> {e.message}</li>)}
                            </ul>
                        </div>
                    )}
                    {validationSummary.errors.length === 0 && validationSummary.warnings.length > 0 && (
                        <div style={{ color: 'var(--color-warning)' }}>
                            <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Are you sure you want to save with the following warnings?</strong>
                            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                                {validationSummary.warnings.map((w, idx) => <li key={`warn-${idx}`}><strong>{w.caption}:</strong> {w.message}</li>)}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            <RecordActionToolbar
                status={status}
                onEdit={handleStartEdit}
                onCancelEdit={onCancelEdit}
                onSave={handleSave}
                shouldConfirmSave={checkWarnings}
                onCancelCreate={onCancelCreate}
                canUpdate={canUpdate}
            />

            {status !== 'creating' && canDelete && (
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

