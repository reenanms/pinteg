export type PaginationType = 'all' | 'paging' | 'infinite';

export interface FilterParam {
    field: string;
    operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in';
    value: any;
}

export interface SortParam {
    field: string;
    direction: 'asc' | 'desc';
}

export interface BaseListRequest {
    filters?: FilterParam[];
    sort?: SortParam[];
}

export interface AllListRequest extends BaseListRequest {
    paginationType: 'all';
}

export interface PagingListRequest extends BaseListRequest {
    paginationType: 'paging';
    page: number;
    pageSize: number;
}

export interface InfiniteListRequest extends BaseListRequest {
    paginationType: 'infinite';
    cursor?: string | number;
    limit: number;
}

export type ListRequest = AllListRequest | PagingListRequest | InfiniteListRequest;

export interface AllListResponse<T = any> {
    paginationType: 'all';
    data: T[];
}

export interface PagingListResponse<T = any> {
    paginationType: 'paging';
    data: T[];
    currentPage: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
}

export interface InfiniteListResponse<T = any> {
    paginationType: 'infinite';
    data: T[];
    hasMore: boolean;
    nextCursor?: string | number;
}

export type ListResponse<T = any> = AllListResponse<T> | PagingListResponse<T> | InfiniteListResponse<T>;
