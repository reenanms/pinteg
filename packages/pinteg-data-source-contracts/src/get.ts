/**
 * Request to get a single record by its primary key
 * @template TKey The type of the primary key
 */
export interface GetRequest<TKey = string | number> {
    key: TKey;
}

/**
 * Response containing a single record
 * @template TResult The type of the record returned by the server
 */
export type GetResponse<TResult = any> = TResult;
