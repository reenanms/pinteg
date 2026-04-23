/**
 * Request to create a new record
 * @template TPayload The type of the data sent to create the record
 */
export interface CreateRequest<TPayload = any> {
    data: TPayload;
}

/**
 * Response containing the created record
 * @template TResult The type of the created record returned by the server
 */
export type CreateResponse<TResult = any> = TResult;
