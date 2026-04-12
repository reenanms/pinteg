import React, { useEffect, useState } from 'react';
import { PIntegTable, CreateButton, EditButton } from 'pinteg-react';
import { DataSourceManager } from 'pinteg-data-source';
import { useCrudContext } from './CrudContext';
import { CrudBreadcrumbs, CrudHeader, CrudErrorDisplay } from './components';

export const ListagePage = () => {
    const { config, navigate } = useCrudContext();
    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const source = DataSourceManager.resolve(config.dataSourceName);
        source.read()
            .then(res => setData(Array.isArray(res) ? res : (res ? [res] : [])))
            .catch(e => setError(e.message));
    }, [config.dataSourceName]);

    const handleRowClick = (rowIndex: number, rowData: any) => {
        const key = rowData[config.primaryKeyField];
        if (key !== undefined) {
            navigate({ path: '/update', key: String(key) });
        } else {
            console.error("Missing primary key in row data.");
        }
    };

    return (
        <div className="pinteg-crud-listage">
            <CrudBreadcrumbs items={[
                { label: 'Apps' },
                { label: config.title, active: true }
            ]} />

            <CrudHeader title={config.title} description={config.description}>
                <CreateButton
                    onClick={() => navigate({ path: '/create' })}
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
                    value={data}
                    readOnly={true}
                    actions={(row) => (
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <EditButton
                                style={{
                                    padding: '6px 16px',
                                    fontSize: '0.85rem',
                                    borderRadius: '6px',
                                    border: '1px solid var(--color-primary)',
                                    color: 'var(--color-primary)',
                                    background: 'transparent',
                                    fontWeight: 600
                                }}
                                onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    handleRowClick(0, row);
                                }}
                            >
                                Open
                            </EditButton>
                        </div>
                    )}
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
