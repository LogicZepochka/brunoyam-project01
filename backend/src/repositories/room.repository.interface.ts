import { Room } from "./types"


export interface RoomRepository {

    createRoom(newRoom: Room,ownerId: string): Promise<Room | null>
    updateRoom(id: string, Data: Partial<Room>): Promise<void>
    deleteRoom(id: string): Promise<boolean>
    getRoom(id: string): Promise<Room | null>
    end(): void;
}