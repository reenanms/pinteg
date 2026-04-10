export type DataSourceResolver<T = any> = (params?: Record<string, any>) => Promise<T>;

export const DataSourceManager = {
    _resolvers: new Map<string, DataSourceResolver>(),

    register(name: string, resolver: DataSourceResolver): void {
        if (this._resolvers.has(name)) {
            console.warn(`Data source '${name}' is already registered and will be overwritten.`);
        }
        this._resolvers.set(name, resolver);
    },

    async resolve<T = any>(name: string, params?: Record<string, any>): Promise<T> {
        const resolver = this._resolvers.get(name);
        if (!resolver) {
            throw new Error(`Data source '${name}' is not registered.`);
        }
        return resolver(params) as Promise<T>;
    }
};
