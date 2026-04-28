import React from 'react';
import { useCrudContext } from './CrudContext';
import { ListingPage } from './ListingPage';

export const CrudRouter = () => {
    const { currentRoute } = useCrudContext();

    return (
        <div className="pinteg-crud-router" style={{ width: '100%' }}>
            <ListingPage />
        </div>
    );
};
