import React, { useEffect, useState, useCallback } from 'react';
import {
    PIntegTable,
    CreateButton,
    PIntegButton,
    ChevronDownIcon,
    ChevronUpIcon,
    PIntegForm,
    SaveButton,
    CancelButton,
    DeleteButton,
    EditButton
} from 'pinteg-react';
import { DataSourceManager } from 'pinteg-data-source';
import { useCrudContext } from './CrudContext';
import { CrudBreadcrumbs, CrudHeader, CrudErrorDisplay, RecordAccordionDetails } from './components';

import { RecordStatus } from './components/RecordStatus';

export const ListagePage = () => {
    const { config, navigate } = useCrudContext();
    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState<string>('');
    const [expandedRowKey, setExpandedRowKey] = useState<string | null>(null);
    const [editData, setEditData] = useState<any>({});
    const [recordStatus, setRecordStatus] = useState<RecordStatus>('viewing');

    const NEW_RECORD_KEY = '__creating__';

    const refreshData = useCallback(() => {
        DataSourceManager.resolve(config.dataSource.list)()
            .then(res => setData(Array.isArray(res) ? res : (res ? [res] : [])))
            .catch((e: any) => setError(e.message));
    }, [config.dataSource.list]);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const toggleRow = async (rowData: any) => {
        const key = String(rowData[config.primaryKeyField]);
        if (key === NEW_RECORD_KEY || recordStatus === 'creating') return;
        if (expandedRowKey === key) {
            setExpandedRowKey(null);
            setEditData({});
            setRecordStatus('viewing');
        } else {
            setExpandedRowKey(key);
            setEditData({});
            setRecordStatus('viewing');
            try {
                const detail = await DataSourceManager.resolve(config.dataSource.get)({ key, ...rowData });
                setEditData(detail);
            } catch (e: any) {
                setError(e.message);
            }
        }
    };

    const handleSave = async () => {
        if (!expandedRowKey) return;
        setError('');
        try {
            if (recordStatus === 'creating') {
                const createdRecord = await DataSourceManager.resolve(config.dataSource.create)(editData);
                setData(prev => [createdRecord, ...prev]);
            } else {
                const updatedRecord = await DataSourceManager.resolve(config.dataSource.update)({ key: expandedRowKey, ...editData });
                setData(prev => prev.map(item =>
                    String(item[config.primaryKeyField]) === expandedRowKey
                        ? { ...item, ...editData, ...(updatedRecord || {}) }
                        : item
                ));
            }
            setExpandedRowKey(null);
            setRecordStatus('viewing');
            setEditData({});
        } catch (e: any) {
            setError(e.message);
        }
    };

    const handleDelete = async () => {
        if (!expandedRowKey) return;
        try {
            await DataSourceManager.resolve(config.dataSource.delete)({ key: expandedRowKey });
            setData(prev => prev.filter(item => String(item[config.primaryKeyField]) !== expandedRowKey));
            setRecordStatus('viewing');
            setExpandedRowKey(null);
        } catch (e: any) {
            setError(e.message);
        }
    };

    const handleStartCreate = () => {
        setRecordStatus('creating');
        setExpandedRowKey(NEW_RECORD_KEY);
        setEditData({});
    };

    const handleCancelCreate = () => {
        setRecordStatus('viewing');
        setExpandedRowKey(null);
        setEditData({});
    };

    const isCreating = recordStatus === 'creating';
    const displayData = isCreating
        ? [{ [config.primaryKeyField]: NEW_RECORD_KEY }, ...data]
        : data;

    const expandedIndex = expandedRowKey
        ? displayData.findIndex((r: any) => String(r[config.primaryKeyField]) === expandedRowKey)
        : -1;

    return (
        <div className="pinteg-crud-listage">
            <CrudBreadcrumbs items={[
                { label: 'Apps' },
                { label: config.title, active: true }
            ]} />

            <CrudHeader title={config.title} description={config.description}>
                <CreateButton
                    onClick={handleStartCreate}
                    disabled={isCreating}
                    style={{ padding: '12px 24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(var(--color-primary-rgb), 0.2)' }}
                />
            </CrudHeader>

            <CrudErrorDisplay error={error} />

            <div style={{
                background: 'var(--color-surface)',
                borderRadius: '12px',
                border: '1px solid var(--color-border-subtle)',
                overflow: 'hidden'
            }}>
                <PIntegTable
                    schema={config.schema}
                    value={displayData}
                    readOnly={true}
                    onRowClick={(row: any) => toggleRow(row)}
                    expandedRowIndices={expandedIndex >= 0 ? [expandedIndex] : []}
                    expandedRow={() => (
                        <RecordAccordionDetails
                            recordKey={expandedRowKey || ''}
                            schema={config.schema}
                            editData={editData}
                            setEditData={setEditData}
                            status={recordStatus}
                            onStatusChange={setRecordStatus}
                            handleSave={handleSave}
                            handleDelete={handleDelete}
                            onCancelCreate={handleCancelCreate}
                        />
                    )}
                    actions={(row: any) => {
                        const key = String(row[config.primaryKeyField]);
                        const isNew = key === NEW_RECORD_KEY;
                        const isActive = isNew || expandedRowKey === key;
                        const handleClick = isNew ? handleCancelCreate : () => toggleRow(row);
                        const title = isNew
                            ? 'Cancel creation'
                            : isActive ? 'Close Details' : 'View/Edit Details';

                        return (
                            <div style={{ display: 'flex', justifyContent: 'center', width: '40px' }}>
                                <PIntegButton
                                    icon={isActive ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
                                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleClick(); }}
                                    style={{
                                        padding: '8px',
                                        minWidth: 'auto',
                                        borderRadius: '50%',
                                        background: isActive ? 'var(--color-primary-light, rgba(var(--color-primary-rgb), 0.1))' : 'transparent',
                                        color: isActive ? 'var(--color-primary)' : 'var(--color-text-subtle)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                    className="pinteg-btn--ghost"
                                    title={title}
                                />
                            </div>
                        );
                    }}
                    style={{ margin: 0, border: 'none' }}
                />
            </div>

            <footer style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>
                    Total: {data.length} records
                </span>
            </footer>
        </div>
    );
};
