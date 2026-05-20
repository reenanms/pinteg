import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { IComponentAdapter, CoreFieldProps } from 'pinteg-core';
import { IValidationDef } from '@pinteg/validation';

/**
 * Wraps a standard React functional component into an IComponentAdapter factory.
 * Each call to the returned factory produces a new adapter instance with
 * its own React root, ensuring independent lifecycle management.
 *
 * @param Component A React functional component accepting CoreFieldProps.
 * @param defaultValidations Optional default validations for this field type.
 * @returns A factory function that produces IComponentAdapter instances.
 */
export function createReactAdapter(
    Component: React.FC<CoreFieldProps>,
    defaultValidations?: IValidationDef[]
): () => IComponentAdapter {
    return () => {
        let root: Root | null = null;
        let activeContainer: HTMLElement | null = null;
        return {
            mount(container: HTMLElement, props: CoreFieldProps) {
                activeContainer = container;
                root = createRoot(container);
                (container as any).__pinteg_active_root__ = root;
                root.render(<Component {...props} />);
            },
            update(props: CoreFieldProps) {
                root?.render(<Component {...props} />);
            },
            unmount() {
                if (root && activeContainer) {
                    const r = root;
                    const container = activeContainer;
                    setTimeout(() => {
                        try {
                            if ((container as any).__pinteg_active_root__ === r) {
                                r.unmount();
                                delete (container as any).__pinteg_active_root__;
                            }
                        } catch (e) {
                            // ignore error if the DOM container was already disposed
                        }
                    }, 0);
                    root = null;
                    activeContainer = null;
                }
            },
            defaultValidations
        };
    };
}
