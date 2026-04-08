

export interface FieldRendererProps {
    name: string;
    caption?: string;
    value: any;
    size?: string;
    readOnly: boolean;
    tableMode: boolean;
    onChange: (name: string, value: any) => void;
    formValues?: Record<string, any>;
    props?: any;
}

export type RendererType = any;

class Registry {
    private map = new Map<string, RendererType>();

    register(type: string, component: RendererType) {
        this.map.set(type, component);
    }

    get(type: string): RendererType {
        return this.map.get(type);
    }

    has(type: string): boolean {
        return this.map.has(type);
    }
}

export const FieldRendererRegistry = new Registry();
