import { Router } from "express"
import { MainRoomRepository, MainUserRepository } from "../const";
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
    router.get("/list",roomController.getList)
    router.get("/get/:id",roomController.getOneRoom)
    router.get("/get/:id/owner",ProtectedRoute,roomController.getOwner)
    return router;
}