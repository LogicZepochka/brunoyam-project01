import CreateLogger, { LogLevel } from "../etc/logger";
import { User } from "../repositories/types";
import MongooseUserRepository from "../repositories/user.repository";


export default class UserService {

    async getUser(_id: string) {
        try {
            let result = await this.repo.getUser(_id);
            this.logger(`Send ${result?.email} with id ${result?._id}`,LogLevel.Debug)
            return result;
        }
        catch(e) {
            this.logger(`Failed to search user:\n${e}`,LogLevel.Error)
            return null;
        }
    }

    private repo = new MongooseUserRepository();
    private logger = CreateLogger("UserService")

    async createUser(user: User): Promise<User | null> {
        try {
            let result = await this.repo.createUser(user);
            this.logger(`Created new user ${result?.email} with id ${result?._id}`,LogLevel.Debug)
            return result;
        }
        catch(e) {
            this.logger(`Failed to create new user:\n${e}`,LogLevel.Error)
            return null;
        }
    }


    async updateUser(id: string,data: Partial<User>): Promise<boolean> {
        try {
            await this.repo.updateUser(id,data);
            this.logger(`Update user with id ${id}`,LogLevel.Debug)
            return true;
        }
        catch(e) {
            this.logger(`Failed to update user:\n${e}`,LogLevel.Error)
            return false;
        }
    }
}