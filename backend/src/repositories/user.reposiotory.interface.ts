import { User } from "./types";


export interface UserRepository {

    createUser(newUser: User): Promise<User | null>
    updateUser(id: string, Data: Partial<User>): Promise<void>
    deleteUser(id: string): Promise<boolean>
    getUser(id: string): Promise<User | null>
    findByEmail(email:string): Promise<User | null>
    findByPhone(phone:string): Promise<User | null>
    end(): void;
}