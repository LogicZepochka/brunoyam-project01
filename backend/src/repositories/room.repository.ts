import mongoose from "mongoose";
import { AppConfig } from "../config/config";
import CreateLogger, { LogLevel } from "../etc/logger";
import { RoomRepository } from "./room.repository.interface";
import { paginate, PaginationResult, Room, User } from "./types";
import RoomModel, { IRoom } from "../models/room.schema";
import ApiException from "../etc/ApiError";
import { ApiError } from "../builders/api/errors.enum";
import UserDTO from "../dto/UserDTO";


export default class MongooseRoomRepository implements RoomRepository {

    private logger = CreateLogger("RoomRepository")

    constructor() {
        mongoose.connect(AppConfig.Mongo.connectionString).then((value) => {
            this.logger("Mongoose database is connected",LogLevel.Debug)
        }).catch(() => {
            this.logger("Mongoose database is no responding",LogLevel.Critical)
            process.exit(0)
        })
    }

    async getRooms(page: number, offset: number, query: any = {}): Promise<PaginationResult<IRoom>> {
        
        let result = await paginate(RoomModel,query,{page: page, limit: offset})
        return result;
    }

    async incrementRoomView(id: string): Promise<void> {
        let target = await RoomModel.findById(id)
        if(!target)
            return
        target.views += 1
        target.save();
    }

    async incrementRoomContactView(id: string): Promise<void> {
        let target = await RoomModel.findById(id)
        if(!target)
            return
        target.contactViews += 1
        target.save();
    }

    async getRoomOwner(id: string): Promise<User | null> {
        let room = await RoomModel.findById(id).select('owner').populate('owner','name phone email')
        if(!room)
            return null;
        let owner = room.owner as unknown as User
        return owner
    }

    async createRoom(newRoom: Room,ownerId: string): Promise<Room | null> {
        if(!newRoom.images || newRoom.images.length <= 0) {
            throw new ApiException("Empty images",ApiError.InvalidInput)
        }
        let result = await RoomModel.create(
            {
                title: newRoom.title,
                address: newRoom.address,
                price: newRoom.price,
                images: newRoom.images,
                area: newRoom.area,
                shortDescription: newRoom.shortDescription,
                fullDescription: newRoom.fullDescription,
                owner: ownerId
            }
        )
        return {
            _id: result._id.toString(),
            title: result.title,
            address: result.address,
            price: result.price,
            area: result.area,
            shortDescription: newRoom.shortDescription,
            fullDescription: newRoom.fullDescription
        };
    }

    async updateRoom(id: string, Data: Partial<Room>): Promise<void> {
        await RoomModel.updateOne({_id: id},
            {
                ...Data
            }
        )
    }

    async deleteRoom(id: string): Promise<boolean> {
        await RoomModel.deleteOne({_id: id})
        return true;
    }

    async getRoom(id: string): Promise<Room | null> {
        let result = await RoomModel.findById(id).populate('owner',"name phone email")
        this.logger(`Fetched room: ${result ? result._id.toString() : 'null'}` , LogLevel.Debug)
        if(!result)
            return null;
        return {
            _id: result._id.toString(),
            title: result.title,
            address: result.address,
            price: result.price,
            area: result.area,
            shortDescription: result.shortDescription,
            fullDescription: result.fullDescription,
            images: result.images,
            status: result.status
        };
    }

    
    
    end(): void {
        throw new Error("Method not implemented.");
    }
}