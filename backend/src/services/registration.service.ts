import { ApiError } from "../builders/api/errors.enum";
import { RegistrationDataDTO } from "../dto/RegistrationDTO";
import CreateLogger, { LogLevel } from "../etc/logger";
import { UserRepository } from "../repositories/user.reposiotory.interface";
import * as argon2 from "argon2"


export default class RegistrationService {

    private repo: UserRepository
    private log = CreateLogger("RegistrationService")

    constructor(userRepository: UserRepository) {
        this.repo = userRepository
        this.log("Created RegistrationService instance",LogLevel.Debug)
    }

        async RegisterUser(data: RegistrationDataDTO): Promise<boolean> {
            try {
                let result = await this.repo.createUser({
                    name: data.name,
                    phone: data.phone,
                    email: data.email,
                    password: await argon2.hash(data.password)
                });
                this.log(`New user registered: ${result !== null}`,LogLevel.Debug)
                return result !== null;
            }
            catch(e) {
                this.log(`Failed to register user:`,LogLevel.Error)
                this.log(`${e}`,LogLevel.Error)
                return false;
            }
        }

        async IsEmailFree(email: string): Promise<boolean> {
            try {
                let result = await this.repo.findByEmail(email)
                this.log(`Search user with email result: ${result}`,LogLevel.Debug)
                return result === null;
            }
            catch(e) {
                this.log(`Failed to search user with email:`,LogLevel.Error)
                this.log(`${e}`,LogLevel.Error)
                throw Error("Failed to search user email: "+e)
            }
            
        }

        async isPhoneFree(phone: string): Promise<boolean> {
            try {
                let result = await this.repo.findByPhone(phone)
                this.log(`Search user with phone result: ${result}`,LogLevel.Debug)
                return result === null;
            }
            catch(e) {
                this.log(`Failed to search user with phone:`,LogLevel.Error)
                this.log(`${e}`,LogLevel.Error)
                throw Error("Failed to search user phone: "+e)
            }
            
        }


}