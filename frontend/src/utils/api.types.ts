
export interface ApiResult<T> {
    status: number
    content: {
        data: T[]
    }
}

export interface ApiPaginatedResult<T> extends ApiResult<T> {
    content: {
        data: T[],
        total: number,
        page: number,
        limit: number,
        totalPages: number
    }
}