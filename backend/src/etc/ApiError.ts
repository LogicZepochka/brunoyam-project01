import { ApiError } from "../builders/api/errors.enum";



export default class ApiException extends Error {

    constructor(message: string, ApiError: ApiError) {
        super(message)
        this.name = ApiError;
    }

}