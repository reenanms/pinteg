import React, { useState, useEffect } from 'react';
import {
    PIntegRoot,
    ThemeProvider,
    PIntegForm,
    PIntegTable,
    ComponentSchema,
    useTheme,
    SchemaRegistry
} from 'pinteg-react';
import { DataSourceManager } from 'pinteg-data-source';

DataSourceManager.register('demoCountrySource', async () => {
    return [
        { key: "BR", caption: "Brazil" },
        { key: "US", caption: "United States" },
        { key: "CA", caption: "Canada" },
    ];
});

DataSourceManager.register('demoStateSource', async (params) => {
    const states: Record<string, any[]> = {
        "BR": [{ key: "SP", caption: "São Paulo" }, { key: "RJ", caption: "Rio de Janeiro" }],
        "US": [{ key: "NY", caption: "New York" }, { key: "CA", caption: "California" }]
    };
    if (params?.filter && states[params.filter]) {
        return states[params.filter];
    }
    return [];
});

DataSourceManager.register('demoCitySource', async (params) => {
    const cities: Record<string, any[]> = {
        "SP": [{ key: "SAO", caption: "São Paulo (City)" }, { key: "CMP", caption: "Campinas" }],
        "RJ": [{ key: "RIO", caption: "Rio de Janeiro (City)" }, { key: "NIT", caption: "Niterói" }],
        "NY": [{ key: "NYC", caption: "New York City" }, { key: "BUF", caption: "Buffalo" }],
        "CA": [{ key: "LA", caption: "Los Angeles" }, { key: "SF", caption: "San Francisco" }]
    };
    if (params?.filter && cities[params.filter]) {
        return cities[params.filter];
    }
    return [];
});

// 1. Define Schames from legacy project
const userSchema: ComponentSchema = {
    param1: { type: "text", caption: "Sample with text:", size: "S" },
    param2: {
        type: "list",
        caption: "Sample with list:",
        size: "S",
        options: [
            { key: "keyA", caption: "caption A" },
            { key: "keyB", caption: "caption B" },
            { key: "keyC", caption: "caption C" }
        ]
    },
    param3: { type: "double", caption: "Sample with double:", size: "M" },
    param4: { type: "integer", caption: "Sample with integer:", size: "L" },
    param5: {
        type: "list",
        caption: "Sample with list:",
        size: "S",
        parent: "param2",
        options: [
            { key: "keyA_A", caption: "caption A.A", filter: "keyA" },
            { key: "keyA_B", caption: "caption A.B", filter: "keyA" },
            { key: "keyB_A", caption: "caption B.A", filter: "keyB" },
            { key: "keyB_B", caption: "caption B.B", filter: "keyB" }
        ]
    },
    param6: {
        type: "list",
        caption: "Country (Data Source):",
        size: "S",
        source: "demoCountrySource"
    },
    param7: {
        type: "list",
        caption: "State (Child of Country):",
        size: "S",
        source: "demoStateSource",
        parent: "param6"
    },
    param8: {
        type: "list",
        caption: "City (Child of State):",
        size: "S",
        source: "demoCitySource",
        parent: "param7"
    }

};

const mainSchema: ComponentSchema = {
    param0: { type: "user", caption: "User Area 0" },
    param1: { type: "user", caption: "User Area 1" },
    param2: { type: "user", caption: "User Area 2" },
};

const tableSchema = userSchema;
// const tableSchema: ComponentSchema = {
//     username: { type: "text", caption: "Username", size: Sizes.S },
//     name: { type: "text", caption: "Name",     size: Sizes.L },
//     email: { type: "text", caption: "E-mail",  size: Sizes.M }
// };

// 2. Initial Data
const initialObject0 = {
    param0: { param1: "user A", param2: "keyA", param3: 1.1, param4: 1, param5: "keyA_B", param6: "BR", param7: "SP", param8: "SAO" },
    param1: { param1: "user B", param2: "keyB", param3: 2.2, param4: 2, param5: "keyB_B", param6: "US", param7: "NY", param8: "NYC" },
    param2: { param1: "user C", param2: "keyC", param3: 3.3, param4: 3, param5: "", param6: "", param7: "", param8: "" }
};

const initialTableRows = [
    { param1: "user A", param2: "keyA", param3: 1.1, param4: 1, param5: "keyA_B", param6: "BR", param7: "SP", param8: "SAO" },
    { param1: "user B", param2: "keyB", param3: 2.2, param4: 2, param5: "keyB_B", param6: "US", param7: "NY", param8: "NYC" },
    { param1: "user C", param2: "keyC", param3: 3.3, param4: 3, param5: "", param6: "", param7: "", param8: "" }
];
// const initialTableRows = [
//     { username: "username0", name: "User name 0", email: "username0@user.com" },
//     { username: "username1", name: "User name 1", email: "username1@user.com" },
//     { username: "username2", name: "User name 2", email: "username2@user.com" }
// ];

// Register the "user" schema globally so PIntegForm can use it as a type
// Registering at module level ensures it's available before first render
SchemaRegistry.register("user", userSchema);

// 3. Components
function ThemeSelector() {
    const { themeId, setTheme, availableThemes } = useTheme();
    return (
        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label>Select Theme:</label>
            <select
                value={themeId}
                onChange={(e) => setTheme(e.target.value)}
                style={{ padding: '4px 8px', borderRadius: '4px' }}
            >
                {availableThemes.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                ))}
            </select>
        </div>
    );
}

function AppContent() {
    const [formData, setFormData] = useState<any>(initialObject0);
    const [tableData, setTableData] = useState<any[]>(initialTableRows);
    const [isReadOnly, setIsReadOnly] = useState(false);

    const handlePrint = () => {
        console.log("Current Form Data:", formData);
        alert("Check console for object data!");
    };

    return (
        <PIntegRoot>
            <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h1 style={{ margin: 0 }}>PInteg Complex Schema Demo</h1>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <button
                            onClick={() => setIsReadOnly(!isReadOnly)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '4px',
                                background: isReadOnly ? 'var(--color-primary)' : 'transparent',
                                color: isReadOnly ? 'white' : 'var(--color-text)',
                                border: '1px solid var(--color-border)',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            {isReadOnly ? 'Mode: Read-Only' : 'Mode: Editable'}
                        </button>
                        <ThemeSelector />
                    </div>
                </header>

                <section style={{ marginBottom: '3rem' }}>
                    <h2>1. Nested Schema Form (app0)</h2>
                    <div style={{ border: '1px solid var(--color-border)', padding: '2rem', borderRadius: '8px', background: 'var(--color-surface)' }}>
                        <PIntegForm
                            schema={mainSchema}
                            value={formData}
                            onChange={setFormData}
                            readOnly={isReadOnly}
                        />
                        <div style={{ marginTop: '2rem' }}>
                            <button onClick={handlePrint}>Read Object</button>
                        </div>
                    </div>
                </section>

                <hr style={{ margin: '3rem 0', opacity: 0.2 }} />

                <section style={{ marginBottom: '3rem' }}>
                    <h2>2. Table View (app1)</h2>
                    <div style={{ border: '1px solid var(--color-border)', padding: '1rem', borderRadius: '8px' }}>
                        <PIntegTable
                            schema={tableSchema}
                            value={tableData}
                            onChange={setTableData}
                            readOnly={isReadOnly}
                        />
                    </div>
                </section>

                <div style={{ background: 'var(--color-surface-alt)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                    <h3>Data State Preview</h3>
                    <pre style={{ color: 'var(--color-primary)', fontSize: '12px' }}>
                        {JSON.stringify({ form: formData, table: tableData }, null, 2)}
                    </pre>
                </div>
            </div>
        </PIntegRoot>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
}

export default App;
