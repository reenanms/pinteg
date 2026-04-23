/**
 * Request to delete a record
 * @template TKey The type of the primary key
 */
export interface DeleteRequest<TKey = string | number> {
    key: TKey;
}

/**
 * Response for a delete operation
 */
export interface DeleteResponse {
    success: boolean;
    /** Optional message or reason */
    message?: string;
}
