import { Router } from "express"
import RegistrationService from "../services/registration.service";
import MongooseUserRepository from "../repositories/user.repository";
import RegistrationController from "../controllers/registration.controller";
import AuthorizationController from "../controllers/authorization.controller";
import AuthorizationService from "../services/authorization.service";
import { MainRoomRepository, MainUserRepository } from "../const";
import UserService from "../services/user.service";
import UserController from "../controllers/user.controller";
import ProtectedRoute from "../middleware/ProtectedRoute";
import RoomService from "../services/room.service";
import RoomController from "../controllers/room.controller";
import multer from "multer"
const { v4: uuidv4 } = require('uuid');
const path = require('path');


const router = Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Папка для загрузки
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4(); // Генерация UUID
    const fileExt = path.extname(file.originalname); // Получение расширения файла
    cb(null, `${uniqueName}${fileExt}`); // Сохранение с UUID именем
  }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('Only image files are allowed!');
      return cb(error);
    }
    cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
})
const roomService = new RoomService(MainRoomRepository);
const roomController = new RoomController(roomService);

export const roomRouter = () => {
    
    router.post("/create",ProtectedRoute,upload.array("photos",10),roomController.createRoom)
    return router;
}