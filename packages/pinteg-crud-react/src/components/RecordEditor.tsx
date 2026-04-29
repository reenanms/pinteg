import React from 'react';
import { ComponentSchema } from 'pinteg-core';
import { PIntegForm } from 'pinteg-react';

export interface RecordEditorProps {
    schema: ComponentSchema;
    data: any;
    onChange: (data: any) => void;
    isEditing: boolean;
    forceValidate?: boolean;
}

export const RecordEditor: React.FC<RecordEditorProps> = ({
    schema,
    data,
    onChange,
    isEditing,
    forceValidate
}) => {
    return (
        <>
            <PIntegForm
                schema={schema}
                value={data}
                onChange={onChange}
                readOnly={!isEditing}
                forceValidate={forceValidate}
            />
        </>
    );
};
