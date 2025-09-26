import { Router } from "express"
import { MainUserRepository } from "../const";
import UserService from "../services/user.service";
import UserController from "../controllers/user.controller";
import ProtectedRoute from "../middleware/ProtectedRoute";



const router = Router();
const userService = new UserService(MainUserRepository);
const userController = new UserController(userService);

export const userRouter = () => {
    
    router.get("/profile/:id",userController.GetProfileById)
    router.get("/profile",ProtectedRoute,userController.GetProfile)
    return router;
}