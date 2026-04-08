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
    param0: { param1: "user A", param2: "keyA", param3: 1.1, param4: 1, param5: "keyA_B" },
    param1: { param1: "user B", param2: "keyB", param3: 2.2, param4: 2, param5: "keyB_B" },
    param2: { param1: "user C", param2: "keyC", param3: 3.3, param4: 3, param5: "" }
};

const initialTableRows = [
    { param1: "user A", param2: "keyA", param3: 1.1, param4: 1, param5: "keyA_B" },
    { param1: "user B", param2: "keyB", param3: 2.2, param4: 2, param5: "keyB_B" },
    { param1: "user C", param2: "keyC", param3: 3.3, param4: 3, param5: "" }
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
        <ThemeProvider theme="dark-theme">
            <AppContent />
        </ThemeProvider>
    );
}

export default App;
