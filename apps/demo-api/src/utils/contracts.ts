import { Request } from 'express';
import { ListRequest, ListResponse } from 'pinteg-data-source-contracts';

export function parseListRequest(req: Request): ListRequest {
    const paginationType = (req.query.paginationType as any) || 'all';

    let filters: any[] = [];
    if (req.query.filters) {
        try { filters = JSON.parse(req.query.filters as string); } catch (e) { }
    }

    let sort: any[] = [];
    if (req.query.sort) {
        try { sort = JSON.parse(req.query.sort as string); } catch (e) { }
    }

    return {
        paginationType,
        filters,
        sort,
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        cursor: req.query.cursor as string
    } as any;
}

export function applyListRequest<T>(data: T[], req: ListRequest): ListResponse<T> {
    let result = [...data];

    // Basic filter support (simplified for demo)
    if (req.filters && req.filters.length > 0) {
        result = result.filter(item => {
            return req.filters!.every(f => {
                const itemVal = (item as any)[f.field];
                if (f.operator === 'eq') return itemVal == f.value;
                if (f.operator === 'like') return String(itemVal).toLowerCase().includes(String(f.value).toLowerCase());
                return true;
            });
        });
    }

    // Basic sort support
    if (req.sort && req.sort.length > 0) {
        const s = req.sort[0];
        result.sort((a: any, b: any) => {
            const valA = a[s.field];
            const valB = b[s.field];
            if (valA < valB) return s.direction === 'asc' ? -1 : 1;
            if (valA > valB) return s.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    if (req.paginationType === 'paging') {
        const page = req.page || 1;
        const pageSize = req.pageSize || 10;
        const totalRecords = result.length;
        const totalPages = Math.ceil(totalRecords / pageSize);
        const start = (page - 1) * pageSize;
        const paginatedData = result.slice(start, start + pageSize);

        return {
            paginationType: 'paging',
            data: paginatedData,
            currentPage: page,
            pageSize,
            totalRecords,
            totalPages
        };
    }

    if (req.paginationType === 'infinite') {
        const limit = req.limit || 10;
        let start = 0;
        if (req.cursor) {
            const cursorIndex = result.findIndex((item: any) => String(item.id) === String(req.cursor));
            if (cursorIndex >= 0) start = cursorIndex; // inclusive cursor for demo
        }

        const infiniteData = result.slice(start, start + limit);
        const hasMore = start + limit < result.length;
        const nextCursor = hasMore ? (result[start + limit] as any).id : undefined;

        return {
            paginationType: 'infinite',
            data: infiniteData,
            hasMore,
            nextCursor
        };
    }

    return {
        paginationType: 'all',
        data: result
    };
}
