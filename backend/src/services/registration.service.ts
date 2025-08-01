import { ApiError } from "../builders/api/errors.enum";
import { RegistrationDataDTO } from "../dto/RegistrationDTO";
import { UserRepository } from "../repositories/user.reposiotory.interface";
import * as argon2 from "argon2"


export default class RegistrationService {

    private repo: UserRepository

    constructor(userRepository: UserRepository) {
        this.repo = userRepository
    }

    async RegisterUser(data: RegistrationDataDTO): Promise<boolean> {
        let result = this.repo.createUser({
            ...data,
            password: await argon2.hash(data.password)
        });
        return result !== null;
    }

    async IsEmailFree(email: string): Promise<boolean> {
        let result = await this.repo.findBy({email: email})
        return result === null;
    }

    async isPhoneFree(phone: string): Promise<boolean> {
        let result = await this.repo.findBy({phone: phone})
        return result === null;
    }


}