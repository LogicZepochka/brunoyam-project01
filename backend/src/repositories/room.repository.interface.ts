import { IRoom } from "../models/room.schema";
import { PaginationResult, Room, User } from "./types"

export interface Owner {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
}

export interface RoomRepository {

    createRoom(newRoom: Room,ownerId: string): Promise<Room | null>
    updateRoom(id: string, Data: Partial<Room>): Promise<void>
    deleteRoom(id: string): Promise<boolean>
    getRoom(id: string): Promise<Room | null>
    getRoomOwner(id: string): Promise<User | null>
    getRooms(page: number, offset: number,query: any): Promise<PaginationResult<IRoom>>


    incrementRoomView(id: string): Promise<void>
    incrementRoomContactView(id: string): Promise<void>
    end(): void;
}