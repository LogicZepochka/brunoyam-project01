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

    async findByEmail(email: string): Promise<User | null> {
        const result = await UserModel.findOne({
            email: email
        })
        if(!result)
            return null;

        return {
            _id: result?._id.toString(),
            name: result?.name,
            email: result?.email,
            password: result?.password,
            lastLogin: result?.lastLogin,
            role: result?.role,
            phone: result?.phone
        }

    }
    async findByPhone(phone: string): Promise<User | null> {
        const result = await UserModel.findOne({
            phone: phone
        })
        if(!result)
            return null;

        return {
            _id: result?._id.toString(),
            name: result?.name,
            email: result?.email,
            lastLogin: result?.lastLogin,
            password: result?.password,
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
            email: result?.email,
            lastLogin: result?.lastLogin,
            role: result?.role,
            phone: result?.phone
        };
    }

    async findById(id: string): Promise<User | null> {
        try {
        let result = await UserModel.findById(
            id
        )
        if(!result)
            return null;

        return {
            _id: result?._id.toString(),
            name: result?.name,
            email: result?.email,
            lastLogin: result?.lastLogin,
            role: result?.role,
            phone: result?.phone
        };
        }
        catch(e) {
            return null;
        }
    }

    async createUser(newUser: User): Promise<User | null> {
        let result = await UserModel.create(
            {
                name: newUser.name,
                password: newUser.password,
                email: newUser.email,
                phone: newUser.phone
            }
        )
        return {
            _id: result._id.toString(),
            name: result.name,
            email: result.email,
            lastLogin: result.lastLogin,
            role: result.role
        };
    }

    async updateUser(id: string, Data: Partial<User>): Promise<any> {
        try {
            const result = await UserModel.updateOne({ _id: id }, { ...Data });
            if (result.matchedCount === 0) {
                return null;
            }
            return await UserModel.findById(id);
        } catch (e) {
            return null;
        }
    }

    async deleteUser(id: string): Promise<boolean> {
        try {
            const result = await UserModel.deleteOne({ _id: id });
            if (result.deletedCount === 0) {
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    }


}