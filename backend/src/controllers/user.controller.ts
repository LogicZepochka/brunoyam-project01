import { Request, Response } from "express";
import UserService from "../services/user.service";
import RegistrationSchema from "../validators/registration.validator";
import APIAnswer from "../builders/api/answer.builder";
import { ApiError } from "../builders/api/errors.enum";
import { AppConfig } from "../config/config";
import RegistrationService from "../services/registration.service";
import CreateLogger, { LogLevel } from "../etc/logger";
import AuthorizationService from "../services/authorization.service";
import ApiException from "../etc/ApiError";
import AuthorizationSchema from "../validators/authorization.validator";
import UserDTO from "../dto/UserDTO";

const log = CreateLogger("UserController")

export default class UserController {

    private userService: UserService

    constructor(service: UserService) {
        this.userService = service
        this.GetProfile = this.GetProfile.bind(this);
        this.GetProfileById = this.GetProfileById.bind(this);
        log("UserController is created",LogLevel.Debug)
    }

    async GetProfile(req: Request, res: Response) {
        if(req.session.user) {
            let user = await this.userService.getUser(req.session.user.id);
            if(!user) {
                res.status(404).json(
                    new APIAnswer(404).setError(ApiError.NotFound,"Пользователь не найден")
                )
            }
            else {
                res.status(200).json(
                    new APIAnswer(200).setContent(new UserDTO(user,false))
                )
            }
        }
        else {
            res.status(401).json(
                    new APIAnswer(401).setError(ApiError.AuthorizationRequired,"Требуется авторизация")
            )
        }
    }

    async GetProfileById(req: Request, res: Response) {
        let id = req.params.id;
        let user = await this.userService.getUser(id);
        if(!user) {
                res.status(404).json(
                    new APIAnswer(404).setError(ApiError.NotFound,"Пользователь не найден")
                )
            }
            else {
                res.status(200).json(
                    new APIAnswer(200).setContent(new UserDTO(user,(req.session.user ? false : true)))
                )
            }
    }
}