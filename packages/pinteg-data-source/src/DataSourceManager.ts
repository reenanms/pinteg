export interface DataSource<T = any> {
    read: (params?: Record<string, any>) => Promise<T | T[]>;
    create: (data: Partial<T>, params?: Record<string, any>) => Promise<T>;
    update: (key: string, data: Partial<T>, params?: Record<string, any>) => Promise<T>;
    delete: (key: string, params?: Record<string, any>) => Promise<void>;
}

export const DataSourceManager = {
    _sources: new Map<string, DataSource>(),

    register(name: string, source: Partial<DataSource>): void {
        if (this._sources.has(name)) {
            console.warn(`Data source '${name}' is already registered and will be overwritten.`);
        }

        const fullSource: DataSource = {
            read: source.read ?? (async () => { throw new Error(`'read' operation is not implemented for data source '${name}'`); }),
            create: source.create ?? (async () => { throw new Error(`'create' operation is not implemented for data source '${name}'`); }),
            update: source.update ?? (async () => { throw new Error(`'update' operation is not implemented for data source '${name}'`); }),
            delete: source.delete ?? (async () => { throw new Error(`'delete' operation is not implemented for data source '${name}'`); })
        };

        this._sources.set(name, fullSource);
    },

    resolve<T = any>(name: string): DataSource<T> {
        const source = this._sources.get(name);
        if (!source) {
            throw new Error(`Data source '${name}' is not registered.`);
        }
        return source as DataSource<T>;
    }
};
