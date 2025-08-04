import { Router } from "express"
import RegistrationService from "../services/registration.service";
import MongooseUserRepository from "../repositories/user.repository";
import RegistrationController from "../controllers/registration.controller";
import { MainUserRepository } from "../const";



const router = Router();
const registrationService = new RegistrationService(MainUserRepository);
const registrationController = new RegistrationController(registrationService);

export const registrationRouter = () => {
      
    router.post("/register",registrationController.RegisterUser)
    
    return router;
}