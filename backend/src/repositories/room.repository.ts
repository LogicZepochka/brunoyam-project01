import mongoose from "mongoose";
import { AppConfig } from "../config/config";
import CreateLogger, { LogLevel } from "../etc/logger";
import { RoomRepository } from "./room.repository.interface";
import { Room } from "./types";
import RoomModel from "../models/room.schema";
import ApiException from "../etc/ApiError";
import { ApiError } from "../builders/api/errors.enum";


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
        let result = await RoomModel.findById(id).populate('owner')
        if(!result)
            return null;
        return {
            _id: result._id.toString(),
            title: result.title,
            address: result.address,
            price: result.price,
            area: result.area,
            shortDescription: result.shortDescription,
            fullDescription: result.fullDescription
        };
    }
    
    end(): void {
        throw new Error("Method not implemented.");
    }
}