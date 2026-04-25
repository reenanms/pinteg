import React, { createContext, useContext, useState } from 'react';
import { ComponentSchema } from 'pinteg-core';

export interface CrudRoute {
    path: '/' | '/create' | '/update' | '/delete';
    key?: string;
}

export interface CrudDataSource {
    list:   string;
    get:    string;
    create: string;
    update: string;
    delete: string;
}

export interface CrudSchemas {
    list:   string;
    detail: string;
}

export interface CrudAccessControl {
    readList:   boolean;
    readDetail: boolean;
    create:     boolean;
    update:     boolean;
    delete:     boolean;
}

export interface CrudConfig {
    title: string;
    description?: string;
    schema: CrudSchemas;
    dataSource: CrudDataSource;
    primaryKeyField: string;
    accessControl: CrudAccessControl;
}

export interface CrudContextType {
    config: CrudConfig;
    currentRoute: CrudRoute;
    navigate: (route: CrudRoute) => void;
}

export const CrudContext = createContext<CrudContextType | null>(null);

export const useCrudContext = () => {
    const ctx = useContext(CrudContext);
    if (!ctx) throw new Error("useCrudContext must be used within CrudProvider");
    return ctx;
};

export const CrudProvider = ({ config, children, onRouteChanged }: { config: CrudConfig, children: React.ReactNode, onRouteChanged?: (route: CrudRoute) => void }) => {
    const [currentRoute, setCurrentRoute] = useState<CrudRoute>({ path: '/' });

    const navigate = (nextRoute: CrudRoute) => {
        setCurrentRoute(nextRoute);
        onRouteChanged?.(nextRoute);
    };

    return (
        <CrudContext.Provider value={{ config, currentRoute, navigate }}>
            {children}
        </CrudContext.Provider>
    );
};
