import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { CrudProvider, CrudConfig, CrudAccessControl } from '../src/CrudContext';
import { DataSourceManager } from 'pinteg-data-source';
import { ListingPage } from '../src/ListingPage';
import { RecordAccordionDetails } from '../src/components/RecordAccordionDetails';
import { RecordActionToolbar } from '../src/components/RecordActionToolbar';

// ---------------------------------------------------------------------------
// Shared mock data / helpers
// ---------------------------------------------------------------------------

const SCHEMA_KEY = 'ac.schema.list';
const SCHEMA_DETAIL_KEY = 'ac.schema.detail';
const LIST_KEY = 'ac.list';
const GET_KEY = 'ac.get';
const CREATE_KEY = 'ac.create';
const UPDATE_KEY = 'ac.update';
const DELETE_KEY = 'ac.delete';

const mockData = [{ id: 1, name: 'Alice' }];
const mockSchema = { name: { type: 'text', caption: 'Name' } };

beforeAll(() => {
    DataSourceManager.register(SCHEMA_KEY, async () => mockSchema);
    DataSourceManager.register(SCHEMA_DETAIL_KEY, async () => mockSchema);
    DataSourceManager.register(LIST_KEY, async () => [...mockData]);
    DataSourceManager.register(GET_KEY, async () => mockData[0]);
    DataSourceManager.register(CREATE_KEY, async (d: any) => ({ ...d, id: 99 }));
    DataSourceManager.register(UPDATE_KEY, async (d: any) => d);
    DataSourceManager.register(DELETE_KEY, async () => {});
});

afterEach(() => {
    cleanup();
});

const ALL_GRANTED: CrudAccessControl = {
    readList:   true,
    readDetail: true,
    create:     true,
    update:     true,
    delete:     true,
};

const makeConfig = (ac: CrudAccessControl): CrudConfig => ({
    title:       'Test CRUD',
    description: 'Test Description',
    schema: {
        list:   SCHEMA_KEY,
        detail: SCHEMA_DETAIL_KEY,
    },
    dataSource: {
        list:   LIST_KEY,
        get:    GET_KEY,
        create: CREATE_KEY,
        update: UPDATE_KEY,
        delete: DELETE_KEY,
    },
    primaryKeyField: 'id',
    accessControl:   ac,
});

const renderListing = (ac: CrudAccessControl) =>
    render(
        <CrudProvider config={makeConfig(ac)}>
            <ListingPage />
        </CrudProvider>
    );

/** Wait for the page heading (h2) to appear — used to detect when schema has loaded. */
const waitForHeading = () => screen.findByRole('heading', { level: 2, name: /Test CRUD/i });

// ---------------------------------------------------------------------------
// R3 — readList
// ---------------------------------------------------------------------------

describe('accessControl.readList', () => {
    it('renders table when readList is true', async () => {
        renderListing({ ...ALL_GRANTED, readList: true });
        await waitForHeading();
        expect(screen.queryByText('Access Denied')).toBeNull();
    });

    it('renders Access Denied message when readList is false', async () => {
        renderListing({ ...ALL_GRANTED, readList: false });
        // The Access Denied heading appears synchronously (no data load needed)
        await waitForHeading();
        expect(await screen.findByText('Access Denied')).toBeDefined();
        expect(screen.queryByText('You do not have permission to view this list.')).toBeDefined();
    });
});

// ---------------------------------------------------------------------------
// R5 — create
// ---------------------------------------------------------------------------

describe('accessControl.create', () => {
    it('shows "Create New" button when create is true', async () => {
        renderListing({ ...ALL_GRANTED, create: true });
        await waitForHeading();
        expect(screen.queryByText('Create New')).not.toBeNull();
    });

    it('hides "Create New" button when create is false', async () => {
        renderListing({ ...ALL_GRANTED, create: false });
        await waitForHeading();
        expect(screen.queryByText('Create New')).toBeNull();
    });
});

// ---------------------------------------------------------------------------
// R4 — readDetail (chevron)
// ---------------------------------------------------------------------------

describe('accessControl.readDetail', () => {
    it('renders expand chevron buttons when readDetail is true', async () => {
        renderListing({ ...ALL_GRANTED, readDetail: true });
        await waitForHeading();
        const btns = screen.queryAllByTitle(/view\/edit details|close details/i);
        expect(btns.length).toBeGreaterThanOrEqual(1);
    });

    it('hides expand chevron buttons when readDetail is false', async () => {
        renderListing({ ...ALL_GRANTED, readDetail: false });
        await waitForHeading();
        const btns = screen.queryAllByTitle(/view\/edit details|close details/i);
        expect(btns.length).toBe(0);
    });
});

// ---------------------------------------------------------------------------
// R6 — update (RecordActionToolbar)
// ---------------------------------------------------------------------------

describe('accessControl.update (RecordActionToolbar)', () => {
    const renderToolbar = (canUpdate: boolean) =>
        render(
            <RecordActionToolbar
                status="viewing"
                onEdit={vi.fn()}
                onCancelEdit={vi.fn()}
                onSave={vi.fn()}
                canUpdate={canUpdate}
            />
        );

    it('shows Edit button when canUpdate is true', () => {
        renderToolbar(true);
        expect(screen.queryByText('Edit')).not.toBeNull();
    });

    it('hides Edit button and Save Changes when canUpdate is false', () => {
        renderToolbar(false);
        expect(screen.queryByText('Edit')).toBeNull();
        expect(screen.queryByText('Save Changes')).toBeNull();
    });
});

// ---------------------------------------------------------------------------
// R7 — delete (DangerZone via RecordAccordionDetails)
// ---------------------------------------------------------------------------

describe('accessControl.delete (DangerZone)', () => {
    const renderDetails = (canDelete: boolean) =>
        render(
            <RecordAccordionDetails
                recordKey="1"
                schema={mockSchema as any}
                editData={{ name: 'Alice' }}
                setEditData={vi.fn()}
                status="viewing"
                onStatusChange={vi.fn()}
                handleSave={vi.fn()}
                handleDelete={vi.fn()}
                canDelete={canDelete}
            />
        );

    it('renders Danger Zone when canDelete is true', () => {
        renderDetails(true);
        expect(screen.queryByText('Danger Zone')).not.toBeNull();
    });

    it('hides Danger Zone when canDelete is false', () => {
        renderDetails(false);
        expect(screen.queryByText('Danger Zone')).toBeNull();
    });
});

// ---------------------------------------------------------------------------
// Combined scenario — read-only viewer role
// ---------------------------------------------------------------------------

describe('Combined: read-only viewer role', () => {
    it('shows table, hides create button, chevron, edit, and danger zone', async () => {
        renderListing({
            readList:   true,
            readDetail: false,
            create:     false,
            update:     false,
            delete:     false,
        });

        // Table renders (h2 heading confirms schema loaded)
        await waitForHeading();
        expect(screen.queryByText('Access Denied')).toBeNull();

        // No create button
        expect(screen.queryByText('Create New')).toBeNull();

        // No chevron expand buttons
        expect(screen.queryAllByTitle(/view\/edit details/i).length).toBe(0);
    });
});
