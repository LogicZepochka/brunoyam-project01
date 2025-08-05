import CreateLogger, { LogLevel } from "../etc/logger";
import { RoomRepository } from "../repositories/room.repository.interface";
import { Room, User } from "../repositories/types";



export default class RoomService {

    private repo: RoomRepository
    private logger = CreateLogger("RoomService")

    constructor(userRepository: RoomRepository) {
        this.repo = userRepository
    }

    async getRoom(_id: string) {
        try {
            let result = await this.repo.getRoom(_id);
            return result;
        }
        catch(e) {
            return null;
        }
    }

    async incrementRoomView(id: string): Promise<void> {
        await this.repo.incrementRoomView(id)
    }
    
    async incrementRoomContactView(id: string): Promise<void> {
        await this.repo.incrementRoomContactView(id)
    }

    async getRoomOwner(_id: string) {
        try {
            let result = await this.repo.getRoomOwner(_id);
            return result;
        }
        catch(e) {
            this.logger(`${e}`,LogLevel.Error)
            return null;
        }
    }

    async createRoom(user: Room,ownerId: string): Promise<Room | null> {
        try {
            console.log(user);
            let result = await this.repo.createRoom(user,ownerId);
            this.logger(`Created new room ${result?.title} with id ${result?._id} (Owner: ${ownerId})`,LogLevel.Debug)
            return result;
        }
        catch(e) {
            this.logger(`Failed to create new room:\n${e}`,LogLevel.Error)
            return null;
        }
    }


    async updateRoom(id: string,data: Partial<User>): Promise<boolean> {
        try {
            await this.repo.updateRoom(id,data);
            this.logger(`Update room with id ${id}`,LogLevel.Debug)
            return true;
        }
        catch(e) {
            this.logger(`Failed to update room:\n${e}`,LogLevel.Error)
            return false;
        }
    }
}