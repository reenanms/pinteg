import React, { useEffect, useState } from 'react';
import { PIntegForm, SaveButton, DeleteButton, CancelButton } from 'pinteg-react';
import { DataSourceManager } from 'pinteg-data-source';
import { useCrudContext } from './CrudContext';
import { CrudBreadcrumbs, CrudHeader, CrudErrorDisplay } from './components';

export const FormPage = () => {
    const { config, currentRoute, navigate } = useCrudContext();
    const isCreate = currentRoute.path === '/create';
    const [data, setData] = useState<any>({});
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isCreate && currentRoute.key !== undefined) {
            // Populate form with existing data
            const source = DataSourceManager.resolve(config.dataSourceName);
            source.read({ id: currentRoute.key })
                .then(res => setData(Array.isArray(res) ? res[0] : res))
                .catch(e => setError(e.message));
        }
    }, [isCreate, currentRoute.key, config.dataSourceName]);

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            const source = DataSourceManager.resolve(config.dataSourceName);
            if (isCreate) {
                await source.create(data);
            } else {
                if (currentRoute.key === undefined) throw new Error("Missing key for update");
                await source.update(currentRoute.key, data);
            }
            navigate({ path: '/' });
        } catch (e: any) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            const source = DataSourceManager.resolve(config.dataSourceName);
            if (currentRoute.key === undefined) throw new Error("Missing key for delete");
            await source.delete(currentRoute.key);
            navigate({ path: '/' });
        } catch (e: any) {
            setError(e.message);
        }
    };

    return (
        <div className="pinteg-crud-form">
            <CrudBreadcrumbs items={[
                { label: 'Apps', path: '/' },
                { label: config.title, path: '/' },
                { label: isCreate ? 'Add New' : `Edit: ${currentRoute.key}`, active: true }
            ]} />

            <CrudHeader
                title={`${isCreate ? 'Create' : 'Edit'} ${config.title}`}
                description={config.description}
                actionsFullWidth={true}
            >
                <CancelButton onClick={() => navigate({ path: '/' })} disabled={saving} />
                <SaveButton onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                </SaveButton>
            </CrudHeader>

            <CrudErrorDisplay error={error} />

            <main style={{
                background: 'var(--color-surface)',
                padding: '2.5rem',
                borderRadius: '12px',
                border: '1px solid var(--color-border-subtle)',
                marginBottom: '3rem'
            }}>
                <PIntegForm
                    schema={config.schema}
                    value={data}
                    onChange={setData}
                />
            </main>

            {!isCreate && (
                <section style={{
                    borderTop: '1px solid var(--color-border-subtle)',
                    paddingTop: '2rem',
                    marginTop: '2rem'
                }}>
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.05)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--color-danger, #ef4444)' }}>Danger Zone</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-subtle)' }}>
                                Once you delete this record, there is no going back. Please be certain.
                            </p>
                        </div>
                        <DeleteButton onClick={handleDelete} disabled={saving} />
                    </div>
                </section>
            )}
        </div>
    );
};
