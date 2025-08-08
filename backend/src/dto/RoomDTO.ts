import GenerateImageURI from "../etc/images.uriGenerator";
import { Owner } from "../repositories/room.repository.interface";
import { Room } from "../repositories/types";
import UserDTO from "./UserDTO";


export default class RoomDTO {

    title?: string
    address?: string
    price?: number
    images?: string[]
    area?: number
    shortDescription?: string
    fullDescription?: string
    owner?: Owner
    createdAt?: Date

    constructor(room: Room) {
        this.title = room.title
        this.address = room.address
        this.price = room.price
        this.images = room.images?.map(img => GenerateImageURI(img))
        this.area = room.area
        this.shortDescription = room.shortDescription
        this.fullDescription = room.fullDescription
        this.owner = room.owner as Owner
        this.createdAt = room.createdAt
    }

}