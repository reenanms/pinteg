import { test, expect } from 'vitest';
import { PIntegBuilder, IPIntegRenderer, PIntegState } from '../src/builder/PIntegBuilder';

test('PIntegBuilder configures state correctly', () => {
    const builder = new PIntegBuilder();
    builder
        .setDivId('testDiv')
        .registerSchema('sub', { id: 1 })
        .setMainSchema({ main: 'config' })
        .setReadOnly()
        .setViewMultiple();

    const state = builder.getState();
    expect(state.schemas['sub']).toEqual({ id: 1 });
    expect(state.mainSchema).toEqual({ main: 'config' });
    expect(state.readOnly).toBe(true);
    expect(state.viewMultiple).toBe(true);
});

test('PIntegBuilder executes rendering correctly for buildForm', () => {
    let renderCalled = false;
    let localDivId = '';
    let isListState = true;

    const mockRenderer: IPIntegRenderer = {
        render: (divId: string, state: PIntegState) => {
            renderCalled = true;
            localDivId = divId;
            isListState = state.isList;
        }
    };

    const builder = new PIntegBuilder();
    builder.setRenderer(mockRenderer).setDivId('app').buildForm();

    expect(renderCalled).toBe(true);
    expect(localDivId).toBe('app');
    expect(isListState).toBe(false);
});

test('PIntegBuilder executes rendering correctly for buildList', () => {
    let renderCalled = false;
    let localDivId = '';
    let isListState = false;

    const mockRenderer: IPIntegRenderer = {
        render: (divId: string, state: PIntegState) => {
            renderCalled = true;
            localDivId = divId;
            isListState = state.isList;
        }
    };

    const builder = new PIntegBuilder();
    builder.setRenderer(mockRenderer).setDivId('app-list').buildList();

    expect(renderCalled).toBe(true);
    expect(localDivId).toBe('app-list');
    expect(isListState).toBe(true);
});

test('PIntegBuilder executes writeObject correctly to the renderer', () => {
    let writeCalledCount = 0;
    let localDivId = '';
    let objData: any = null;

    const mockRenderer: IPIntegRenderer = {
        render: () => { },
        writeObject: (divId: string, obj: any) => {
            writeCalledCount++;
            localDivId = divId;
            objData = obj;
        }
    };

    const builder = new PIntegBuilder();
    builder.setRenderer(mockRenderer).setDivId('a').buildForm().writeObject({ data: 123 });

    expect(writeCalledCount).toBe(1);
    expect(localDivId).toBe('a');
    expect(objData).toEqual({ data: 123 });
});

test('PIntegBuilder throws if build is called without a set div ID', () => {
    const builder = new PIntegBuilder();
    expect(() => {
        builder.buildForm();
    }).toThrow(/Div ID is not set/);
});

