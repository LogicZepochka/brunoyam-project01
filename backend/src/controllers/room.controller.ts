import { Request, Response } from "express";
import UserService from "../services/user.service";
import RegistrationSchema from "../validators/registration.validator";
import APIAnswer from "../builders/api/answer.builder";
import { ApiError } from "../builders/api/errors.enum";
import { AppConfig } from "../config/config";
import RegistrationService from "../services/registration.service";
import CreateLogger, { LogLevel } from "../etc/logger";
import RoomService from "../services/room.service";
import { RoomCreateSchema } from "../validators/room.validators";

const log = CreateLogger("RoomController")

export default class RoomController {

    private roomService: RoomService

    constructor(service: RoomService) {
        this.roomService = service
        this.createRoom = this.createRoom.bind(this);
        log("RegistrationController is created",LogLevel.Debug)
    }

    async createRoom(req:Request,res:Response) {
        let user = req.session.user;
        if(!user) {
            res.status(401).json(
                                new APIAnswer(401).setError(ApiError.AuthorizationRequired,"Требуется авторизация")
            )
            return
        }
        if(!req.files) {
            res.status(400).json(
                                new APIAnswer(400).setError(ApiError.InvalidInput,"Фотографии помещения обязательны")
            )
            return
        }
        if(req.files.length as number < 1) {
            res.status(400).json(
                                new APIAnswer(400).setError(ApiError.InvalidInput,"Фотографии помещения обязательны")
            )
            return
        }
        let parsedBody = await RoomCreateSchema.safeParse(req.body);
        if(!parsedBody.success) {
            res.status(400).json(
                                new APIAnswer(400).setError(ApiError.InvalidInput,"Введены неверные данные").setContent(
                                    AppConfig.Env == "dev" ? parsedBody.error.issues : undefined
                                )
                            )
            return;
        }
        
        const fileNames = Object.values(req.files)
            .flat()
            .map((file: Express.Multer.File) => file.filename);
            console.log(fileNames)
        let result = await this.roomService.createRoom(
            {...parsedBody.data,
                images: fileNames
            },user.id
        )
        if(!result) {
            res.status(500).json(
                                new APIAnswer(400).setError(ApiError.InternalError,"Произошла ошибка при создании помещения")
                            )
            return;
        }

        res.status(201).json(
            new APIAnswer(201).setContent({
                id: result._id
            })
        )
    }
}