export type DataSourceHandler<TParams = Record<string, any>, TResult = any> =
    (params?: TParams) => Promise<TResult>;

export const DataSourceManager = {
    _sources: new Map<string, DataSourceHandler>(),

    register<TParams = Record<string, any>, TResult = any>(
        name: string,
        handler: DataSourceHandler<TParams, TResult>
    ): void {
        if (this._sources.has(name)) {
            console.warn(`Data source '${name}' is already registered and will be overwritten.`);
        }
        this._sources.set(name, handler as DataSourceHandler);
    },

    resolve<TParams = Record<string, any>, TResult = any>(
        name: string
    ): DataSourceHandler<TParams, TResult> {
        const handler = this._sources.get(name);
        if (!handler) {
            throw new Error(`Data source '${name}' is not registered.`);
        }
        return handler as DataSourceHandler<TParams, TResult>;
    },

    has(name: string): boolean {
        return this._sources.has(name);
    }
};
