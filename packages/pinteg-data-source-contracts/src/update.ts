/**
 * Request to update an existing record
 * @template TPayload The type of the data sent to update the record
 * @template TKey The type of the primary key
 */
export interface UpdateRequest<TPayload = any, TKey = string | number> {
    key: TKey;
    data: TPayload;
}

/**
 * Response containing the updated record
 * @template TResult The type of the updated record returned by the server
 */
export type UpdateResponse<TResult = any> = TResult;
