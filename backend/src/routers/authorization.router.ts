import { Router } from "express"
import RegistrationService from "../services/registration.service";
import MongooseUserRepository from "../repositories/user.repository";
import RegistrationController from "../controllers/registration.controller";
import AuthorizationController from "../controllers/authorization.controller";
import AuthorizationService from "../services/authorization.service";



const router = Router();
const userRepository = new MongooseUserRepository();
const authorizationService = new AuthorizationService(userRepository);
const authorizationController = new AuthorizationController(authorizationService);

export const authorizationRouter = () => {
    router.post("/login",authorizationController.SignInUser)
    router.post("/logout",authorizationController.SignOutUser)
    return router;
}