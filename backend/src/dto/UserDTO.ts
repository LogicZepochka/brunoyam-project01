import { User, userRoles } from "../repositories/types";


export default class UserDTO {

    name?: string
    phone?: string
    email?: string
    lastLogin?: Date
    role?: userRoles

    constructor(user: User, PDsecured: boolean = true) {
        this.name = user.name
        this.phone = PDsecured ? "+7XXXXXXXXXX" : user.phone
        this.email = PDsecured ? "xxxxxx@yyy.ru" : user.email
        this.lastLogin = user.lastLogin
        this.role = user.role
    }
}