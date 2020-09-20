type APIInvocation<ResponseType> = (abortSignal?: AbortSignal) => Promise<ResponseType>;
type APIRequestState<ResponseType> = {
    data: ResponseType | null;
    hasData: boolean;
    loading: boolean;
    error: Error | null;
};
type UseAPIResponseOptions<ResponseType> = {
    invocation?: APIInvocation<ResponseType> | null;
    discardPreviousData?: boolean;
    discardDataOnError?: boolean;
    abortPreviousRequest?: boolean;
};
declare function useApiResponse<ResponseType>(makeInvocation: () => APIInvocation<ResponseType> | UseAPIResponseOptions<ResponseType> | undefined | void | null, dependencies: unknown[]): APIRequestState<ResponseType>;
type JSONFetchOptions<BodyType = unknown, QueryParamsType extends Record<string, any> = any> = {
    body?: BodyType;
    query?: QueryParamsType;
    headers?: Record<string, string>;
    fetchOptions?: RequestInit;
};
type JSONFetch = <ResponseType = unknown, BodyType extends Record<string, any> = any, QueryParamsType = unknown>(method: string, endpoint: string, options?: JSONFetchOptions<BodyType, QueryParamsType>) => APIInvocation<ResponseType>;
declare function makeJsonFetch(urlPrefix?: string, defaultHeaders?: Record<string, string>, handleHttpError?: (res: Response) => Promise<any> | never, handleData?: (data: any) => any): JSONFetch;
declare const jsonFetch: JSONFetch;
type APIMockHandler<ResponseType = unknown, BodyType = unknown, QueryParamsType extends Record<string, any> = any> = (request: {
    endpoint: string;
    match: RegExpMatchArray | null;
    body: BodyType;
    query: QueryParamsType;
}) => ResponseType | Promise<ResponseType>;
type APIMockEntry<ResponseType = unknown, BodyType = unknown, QueryParamsType extends Record<string, any> = any> = [string, RegExp | string, APIMockHandler<ResponseType, BodyType, QueryParamsType>];
declare function mockFetch(entries: APIMockEntry<any, any, any>[]): JSONFetch;
declare const transformApiInvocation: <TFrom, TTo>(invocation: APIInvocation<TFrom>, transform: (data: TFrom) => TTo) => APIInvocation<TTo>;
export { APIInvocation, APIRequestState, UseAPIResponseOptions, useApiResponse, JSONFetchOptions, JSONFetch, makeJsonFetch, jsonFetch, APIMockHandler, APIMockEntry, mockFetch, transformApiInvocation };
