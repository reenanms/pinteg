/**
 * Seed Script for PInteg Demo API
 * Run this to populate the dynamic API with initial sample data.
 * Usage: node scripts/seed-data.js
 */

const API_BASE = 'http://localhost:6150/api';

const data = {
    users: [
        { id: 1, name: 'Alice Johnson', role: 'admin', email: 'alice@example.com' },
        { id: 2, name: 'Bob Smith', role: 'user', email: 'bob@example.com' },
        { id: 3, name: 'Carol White', role: 'editor', email: 'carol@example.com' },
    ],
    roles: [
        { id: 1, name: 'Administrator', level: 'full' },
        { id: 2, name: 'Editor', level: 'partial' },
        { id: 3, name: 'Viewer', level: 'read-only' },
    ],
    products: [
        { id: 1, name: 'Widget Pro', category: 'Widgets', price: '29.99' },
        { id: 2, name: 'Gadget Max', category: 'Gadgets', price: '49.99' },
        { id: 3, name: 'Tool Set', category: 'Tools', price: '99.99' },
    ],
    orders: [
        { id: 1, customer: 'Alice Johnson', product: 'Widget Pro', status: 'shipped' },
        { id: 2, customer: 'Bob Smith', product: 'Gadget Max', status: 'pending' },
        { id: 3, customer: 'Carol White', product: 'Tool Set', status: 'delivered' },
    ]
};

async function seed() {
    console.log(`Starting seed process for ${API_BASE}...`);
    
    for (const [prefix, items] of Object.entries(data)) {
        console.log(`\nSeeding [${prefix}]...`);
        for (const item of items) {
            try {
                const res = await fetch(`${API_BASE}/${prefix}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item)
                });
                
                if (res.ok) {
                    const created = await res.json();
                    console.log(`  ✅ Created ${prefix} (id: ${created.id}): ${item.name || item.customer}`);
                } else {
                    const errBody = await res.json().catch(() => ({}));
                    console.error(`  ❌ Failed to create ${prefix}: ${res.status} ${res.statusText}`, errBody);
                }
            } catch (err) {
                console.error(`  ❌ Error seeding ${prefix}:`, err.message);
            }
        }
    }
    
    console.log('\nSeed process finished.');
}

seed().catch(err => {
    console.error('Fatal error during seed:', err);
    process.exit(1);
});
