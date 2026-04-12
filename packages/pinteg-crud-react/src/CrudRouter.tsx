import React from 'react';
import { useCrudContext } from './CrudContext';
import { ListagePage } from './ListagePage';
import { FormPage } from './FormPage';

export const CrudRouter = () => {
    const { currentRoute } = useCrudContext();

    return (
        <div className="pinteg-crud-router" style={{ width: '100%' }}>
            {currentRoute.path === '/' && <ListagePage />}
            {(currentRoute.path === '/create' || currentRoute.path === '/update') && <FormPage />}
        </div>
    );
};
