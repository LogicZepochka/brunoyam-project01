import { Router } from "express"
import AuthorizationController from "../controllers/authorization.controller";
import AuthorizationService from "../services/authorization.service";
import { MainUserRepository } from "../const";



const router = Router();
const authorizationService = new AuthorizationService(MainUserRepository);
const authorizationController = new AuthorizationController(authorizationService);

export const authorizationRouter = () => {
    router.post("/login",authorizationController.SignInUser)
    router.post("/logout",authorizationController.SignOutUser)
    return router;
}