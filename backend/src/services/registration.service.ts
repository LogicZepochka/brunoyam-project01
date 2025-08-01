import { ApiError } from "../builders/api/errors.enum";
import { RegistrationDataDTO } from "../dto/RegistrationDTO";
import CreateLogger, { LogLevel } from "../etc/logger";
import { UserRepository } from "../repositories/user.reposiotory.interface";
import * as argon2 from "argon2"


export default class RegistrationService implements Disposable {

    private repo: UserRepository
    private log = CreateLogger("RegistrationService")

    constructor(userRepository: UserRepository) {
        this.repo = userRepository
        this.log("Created RegistrationService instance",LogLevel.Debug)
    }

    [Symbol.dispose](): void {
        this.repo.end();
        this.log("Destroyed RegistrationService instance",LogLevel.Debug)
    }

        async RegisterUser(data: RegistrationDataDTO): Promise<boolean> {
            try {
                let result = this.repo.createUser({
                    ...data,
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
                let result = await this.repo.findBy({email: email})
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
                let result = await this.repo.findBy({phone: phone})
            return result === null;
            }
            catch(e) {
                this.log(`Failed to search user with phone:`,LogLevel.Error)
                this.log(`${e}`,LogLevel.Error)
                throw Error("Failed to search user phone: "+e)
            }
            
        }


}