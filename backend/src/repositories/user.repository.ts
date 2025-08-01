import mongoose from "mongoose";
import UserModel from "../models/user.schema";
import { User } from "./types";
import { UserRepository } from "./user.reposiotory.interface";
import { AppConfig } from "../config/config";
import CreateLogger, { LogLevel } from "../etc/logger";


export default class MongooseUserRepository implements UserRepository, Disposable {

    private logger = CreateLogger("UserRepository")

    constructor() {
        mongoose.connect(AppConfig.Mongo.connectionString).then((value) => {
            this.logger("Mongoose database is connected",LogLevel.Debug)
        }).catch(() => {
            this.logger("Mongoose database is no responding",LogLevel.Critical)
            process.exit(0)
        })
    }
    async findBy(data: Partial<User>): Promise<User | null> {
        const result = await UserModel.findOne({
            data
        })
        if(!result)
            return null;

        return {
            _id: result?._id.toString(),
            name: result?.name,
            email: result?.password,
            lastLogin: result?.lastLogin,
            role: result?.role,
            phone: result?.phone
        }

    }
    
    [Symbol.dispose](): void {
        this.end();
    }

    end(): void {
        mongoose.disconnect()
    }

    async getUser(id: string): Promise<User | null> {
        let result = await UserModel.findById(
            id
        )
        if(!result)
            return null;

        return {
            _id: result?._id.toString(),
            name: result?.name,
            email: result?.password,
            lastLogin: result?.lastLogin,
            role: result?.role,
            phone: result?.phone
        };
    }

    async createUser(newUser: User): Promise<User | null> {
        let result = await UserModel.create(
            {
                name: newUser.name,
                password: newUser.password,
                email: newUser.email
            }
        )
        return {
            _id: result._id.toString(),
            name: result.name,
            email: result.password,
            lastLogin: result.lastLogin,
            role: result.role
        };
    }

    async updateUser(id: string, Data: Partial<User>): Promise<void> {
        await UserModel.updateOne({_id: id},
            {
                ...Data
            }
        )
    }

    async deleteUser(id: string): Promise<boolean> {
        await UserModel.deleteOne({_id: id})
        return true;
    }


}