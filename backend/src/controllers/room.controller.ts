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
import RoomDTO from "../dto/RoomDTO";
import UserDTO from "../dto/UserDTO";

const log = CreateLogger("RoomController")

export default class RoomController {

    private roomService: RoomService

    constructor(service: RoomService) {
        this.roomService = service
        this.createRoom = this.createRoom.bind(this);
        this.getOneRoom = this.getOneRoom.bind(this);
        this.getOwner = this.getOwner.bind(this);
        this.getList = this.getList.bind(this);
        log("RegistrationController is created",LogLevel.Debug)
    }

    async getList(req: Request, res: Response) {
        const page = parseInt(req.query.page as string) || 1;
        const offset = parseInt(req.query.offset as string) || 10;

        if(page < 1 || offset < 1) {
            res.status(400).json(
                                new APIAnswer(400).setError(ApiError.InvalidInput,"Неверные параметры пагинации")
            )
            return
        }

        let result = await this.roomService.getRooms(page,offset)

        res.status(200).json(
            new APIAnswer(200).setContent(result)
        )
    }

    async getOwner(req:Request,res:Response) {
        let user = req.session.user;
        if(!user) {
            res.status(401).json(
                                new APIAnswer(401).setError(ApiError.AuthorizationRequired,"Требуется авторизация")
            )
            return
        }
        const { id } = req.params
        let result = await this.roomService.getRoomOwner(id)
        if(!result) {
            res.status(404).json(
                new APIAnswer(404).setError(ApiError.NotFound,"Помещение не найдено")
            )
            return;
        }
        res.status(200).json(
                new APIAnswer(200).setContent(new UserDTO(result,false))
        )
        if(req.session.contactViews)
            if(!req.session.contactViews?.includes(id)) {
                await this.roomService.incrementRoomContactView(id);
                req.session.contactViews.push(id)
                req.session.save(err => {
                    if(err) {
                        log(`Error when saving session`,LogLevel.Error)
                        log(`${err}`,LogLevel.Error)
                    }
                })
            }
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

    async getOneRoom(req: Request, res: Response) {
        const { id } = req.params
        let result = await this.roomService.getRoom(id)
        if(!result) {
            res.status(404).json(
                new APIAnswer(404).setError(ApiError.NotFound,"Помещение не найдено")
            )
            return;
        }
        res.status(200).json(
                new APIAnswer(200).setContent(new RoomDTO(result))
        )
        if(req.session.views)
            if(!req.session.views.includes(id)) {
                log(`Incremented view for ${id}`,LogLevel.Debug)
                req.session.views.push(id)
                await this.roomService.incrementRoomView(id);
                req.session.save(err => {
                    if(err) {
                        log(`Error when saving session`,LogLevel.Error)
                        log(`${err}`,LogLevel.Error)
                    }
                })
            }
    }
}