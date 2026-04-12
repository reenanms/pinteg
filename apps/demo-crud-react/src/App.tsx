import React, { useState } from 'react';
import { ThemeProvider, PIntegRoot, useTheme } from 'pinteg-react';
import { DataSourceManager } from 'pinteg-data-source';
import { CrudProvider, CrudRouter, CrudConfig } from 'pinteg-crud-react';

// Setup Mock Data
let mockData = [
    { id: 1, name: 'John Doe', role: 'admin' },
    { id: 2, name: 'Jane Smith', role: 'user' }
];

DataSourceManager.register('userManager', {
    read: async () => [...mockData],
    create: async (data: any) => {
        const newUser: { id: number, name: string, role: string } = { name: '', role: '', ...data, id: Date.now() };
        mockData.push(newUser);
        return newUser;
    },
    update: async (id: string, data: any) => {
        const index = mockData.findIndex(u => String(u.id) === id);
        if (index > -1) {
            mockData[index] = { ...mockData[index], ...data };
            return mockData[index];
        }
        throw new Error("User not found");
    },
    delete: async (id: string) => {
        mockData = mockData.filter(u => String(u.id) !== id);
    }
});

const config: CrudConfig = {
    title: 'User Management',
    description: 'Manage the users in your system using this CRUD interface.',
    schema: {
        name: { type: 'text', caption: 'Full Name', size: 'L' },
        role: {
            type: 'list',
            caption: 'System Role',
            size: 'M',
            options: [
                { key: 'admin', caption: 'Administrator' },
                { key: 'user', caption: 'Regular User' }
            ]
        }
    },
    dataSourceName: 'userManager',
    primaryKeyField: 'id'
};

function ThemeSelector() {
    const { themeId, setTheme, availableThemes } = useTheme();
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-subtle)' }}>Theme:</span>
            <select
                value={themeId}
                onChange={(e) => setTheme(e.target.value)}
                style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: 'var(--color-surface)',
                    color: 'var(--color-text)',
                    border: '1px solid var(--color-border)'
                }}
            >
                {availableThemes.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                ))}
            </select>
        </div>
    );
}

function App() {
    return (
        <ThemeProvider>
            <PIntegRoot>
                <div style={{ minHeight: '100vh', background: 'var(--color-background)', transition: 'background 0.3s' }}>
                    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>PInteg CRUD Demo</h1>
                            <ThemeSelector />
                        </header>

                        <main style={{ background: 'var(--color-surface)', borderRadius: '12px', padding: '2rem', border: '1px solid var(--color-border-subtle)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <CrudProvider
                                config={config}
                                onRouteChanged={(route) => {
                                    const hash = route.path === '/' ? '' : (route.key ? `${route.path}/${route.key}` : route.path);
                                    window.location.hash = hash;
                                }}
                            >
                                <CrudRouter />
                            </CrudProvider>
                        </main>
                    </div>
                </div>
            </PIntegRoot>
        </ThemeProvider>
    );
}

export default App;
