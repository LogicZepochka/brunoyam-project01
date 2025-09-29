import session from "express-session";
import { ApiError } from "../builders/api/errors.enum";
import { RegistrationDataDTO } from "../dto/RegistrationDTO";
import ApiException from "../etc/ApiError";
import CreateLogger, { LogLevel } from "../etc/logger";
import { UserRepository } from "../repositories/user.reposiotory.interface";
import * as argon2 from "argon2"


export default class AuthorizationService {

    private repo: UserRepository
    private log = CreateLogger("AuthService")

    constructor(userRepository: UserRepository) {
        this.repo = userRepository
        this.log("Created AuthService instance",LogLevel.Debug)
    }

    async AuthorizeUser(email: string, password: string) {

        let user = await this.repo.findByEmail(email);
        if(!user) 
            throw new ApiException("Password or user is wrong",ApiError.Forbidden)
        if(!user.password)
            throw new Error("User password is null")
        if(await argon2.verify(user.password,password) === false) 
            throw new ApiException("Password or user is wrong",ApiError.Forbidden)

        return user;
    }

}