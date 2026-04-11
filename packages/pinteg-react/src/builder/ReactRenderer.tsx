import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { IPIntegRenderer, PIntegState } from 'pinteg-core';
import { PIntegForm } from '../components/PIntegForm';
import { PIntegTable } from '../components/PIntegTable';
import { PIntegRoot } from '../components/PIntegRoot';
import { SchemaRegistry } from '../registry/SchemaRegistry';

export class ReactRenderer implements IPIntegRenderer {
    private roots = new Map<string, Root>();
    private dataState = new Map<string, any>();
    private rootStates = new Map<string, PIntegState>();

    render(divId: string, state: PIntegState): void {
        const el = document.getElementById(divId);
        if (!el) {
            console.error(`[PIntegReact] Element with id ${divId} not found.`);
            return;
        }

        // Apply external schemas to the internal react SchemaRegistry ensuring 'type: "user"' logic maps
        for (const [name, schema] of Object.entries(state.schemas || {})) {
            SchemaRegistry.register(name, schema);
        }

        let root = this.roots.get(divId);
        if (!root) {
            root = createRoot(el);
            this.roots.set(divId, root);
        }

        this.rootStates.set(divId, state);
        this.executeRender(divId);
    }

    writeObject(divId: string, obj: any): void {
        this.dataState.set(divId, obj);
        this.executeRender(divId);
    }

    private executeRender(divId: string) {
        const root = this.roots.get(divId);
        const state = this.rootStates.get(divId);
        const data = this.dataState.get(divId);

        if (!root || !state) return;

        const content = state.isList ? (
            <PIntegTable
                schema={state.mainSchema}
                value={data}
                readOnly={state.readOnly}
            />
        ) : (
            <PIntegForm
                schema={state.mainSchema}
                value={data}
                readOnly={state.readOnly}
            />
        );

        root.render(
            <React.StrictMode>
                <PIntegRoot>
                    {content}
                </PIntegRoot>
            </React.StrictMode>
        );
    }
}
