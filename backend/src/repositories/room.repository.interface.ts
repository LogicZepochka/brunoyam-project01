import { Room, User } from "./types"

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

    incrementRoomView(id: string): Promise<void>
    incrementRoomContactView(id: string): Promise<void>
    end(): void;
}