import React from 'react';
import { useCrudContext } from './CrudContext';
import { ListagePage } from './ListagePage';

export const CrudRouter = () => {
    const { currentRoute } = useCrudContext();

    return (
        <div className="pinteg-crud-router" style={{ width: '100%' }}>
            <ListagePage />
        </div>
    );
};
