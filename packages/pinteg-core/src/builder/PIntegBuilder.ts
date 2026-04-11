/**
 * IPIntegRenderer provides a contract for any frontend framework or vanilla code
 * to execute the rendering process based on the state kept in the PIntegBuilder.
 */
export interface IPIntegRenderer {
    /**
     * Called when .buildForm() or .buildList() is executed.
     * @param divId The DOM element id where it needs to be injected.
     * @param state The builder's internal configuration state when building occurred.
     */
    render(divId: string, state: PIntegState): void;

    /**
     * Called when .writeObject() is executed to populate the form/list data.
     * @param divId The DOM element id.
     * @param obj Data object.
     */
    writeObject?(divId: string, obj: any): void;
}

export interface PIntegState {
    schemas: Record<string, any>;
    mainSchema: any;
    readOnly: boolean;
    viewMultiple: boolean;
    isList: boolean;
}

export class PIntegBuilder {
    private renderer?: IPIntegRenderer;
    private currentDivId?: string;
    private state: PIntegState = {
        schemas: {},
        mainSchema: null,
        readOnly: false,
        viewMultiple: false,
        isList: false
    };

    /**
     * Sets the rendering engine responsible for manipulating the UI layer.
     */
    setRenderer(renderer: IPIntegRenderer): this {
        this.renderer = renderer;
        return this;
    }

    setDivId(id: string): this {
        this.currentDivId = id;
        return this;
    }

    registerSchema(name: string, schema: any): this {
        this.state.schemas[name] = schema;
        return this;
    }

    setMainSchema(schema: any): this {
        this.state.mainSchema = schema;
        return this;
    }

    setReadOnly(): this {
        this.state.readOnly = true;
        return this;
    }

    setViewMultiple(): this {
        this.state.viewMultiple = true;
        return this;
    }

    buildForm(): this {
        this.state.isList = false;
        this.executeRender();
        return this;
    }

    buildList(): this {
        this.state.isList = true;
        this.executeRender();
        return this;
    }

    writeObject(obj: any): this {
        if (!this.currentDivId) {
            throw new Error("Div ID is not set. Call setDivId first.");
        }
        if (this.renderer && this.renderer.writeObject) {
            this.renderer.writeObject(this.currentDivId, obj);
        } else {
            console.warn("No renderer registered or renderer does not support writeObject in pinteg instance. Write object will be ignored.");
        }
        return this;
    }

    public getState(): Readonly<PIntegState> {
        return { ...this.state };
    }

    private executeRender() {
        if (!this.currentDivId) {
            throw new Error("Div ID is not set. Call setDivId first.");
        }
        if (this.renderer) {
            this.renderer.render(this.currentDivId, this.state);
        } else {
            console.warn("No renderer registered in pinteg instance. Form/List will not be rendered.");
        }
    }
}

// Global pinteg singleton facade to match the requested sample usage pattern
export const pinteg = new PIntegBuilder();
