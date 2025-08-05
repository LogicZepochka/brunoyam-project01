import MongooseRoomRepository from "./repositories/room.repository";
import { RoomRepository } from "./repositories/room.repository.interface";
import { UserRepository } from "./repositories/user.reposiotory.interface";
import MongooseUserRepository from "./repositories/user.repository";

 
export const allowedHosts = [
    "http://localhost:80",
    "http://localhost:2440"
]

declare module 'express-session' {
  interface SessionData {
    user: { id: string; username: string; email: string };
    views: string[];
    contactViews: string[];
  }
}

const MainUserRepository: UserRepository = new MongooseUserRepository();
const MainRoomRepository: RoomRepository = new MongooseRoomRepository();

export { MainUserRepository, MainRoomRepository }