import { Router } from "express"
import RegistrationService from "../services/registration.service";
import MongooseUserRepository from "../repositories/user.repository";
import RegistrationController from "../controllers/registration.controller";



const router = Router();
const userRepository = new MongooseUserRepository();
const registrationService = new RegistrationService(userRepository);
const registrationController = new RegistrationController(registrationService);

export const registrationRouter = () => {
      
    router.post("/register",registrationController.RegisterUser)
    
    return router;
}