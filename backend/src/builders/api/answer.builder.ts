import { ApiError } from "./errors.enum"


export default class APIAnswer {

    status: number
    error?: boolean
    errorCode?: ApiError
    errorMessage?: string
    content?: any

    constructor(status: number) {
        this.status = status
    }

    setError(error: ApiError,message: string) {
        this.error = true
        this.errorCode = error
        this.errorMessage = message
        return this
    }

    setContent(content: any) {
        this.content = content
        return this
    }
}