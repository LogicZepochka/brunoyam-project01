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
import { roomStatus, userRoles } from "../repositories/types";

const log = CreateLogger("RoomController")

export default class RoomController {

    private roomService: RoomService

    constructor(service: RoomService) {
        this.roomService = service
        this.createRoom = this.createRoom.bind(this);
        this.getOneRoom = this.getOneRoom.bind(this);
        this.getOwner = this.getOwner.bind(this);
        this.getList = this.getList.bind(this);
        this.hideRoom = this.hideRoom.bind(this);
        this.deleteRoom = this.deleteRoom.bind(this);
        this.aproveRoom = this.aproveRoom.bind(this);
        log("RegistrationController is created",LogLevel.Debug)
    }

    async hideRoom(req: Request, res: Response) {
        let user = req.session.user;
        if(!user) {
            res.status(401).json(
                                new APIAnswer(401).setError(ApiError.AuthorizationRequired,"Требуется авторизация")
            )
            return
        }
        const { id } = req.params
        let [owner,room] = await Promise.all([
            this.roomService.getRoomOwner(id),
            this.roomService.getRoom(id),
        ])
        if(!owner || !room) {
            res.status(404).json(
                new APIAnswer(404).setError(ApiError.NotFound,"Помещение не найдено")
            )
            return;
        }
        if(owner._id?.toString() !== user.id) {
            if(user.role !== userRoles.ADMIN) {
                res.status(401).json(
                    new APIAnswer(401).setError(ApiError.Forbidden,"Прятать можно только свою карточку помещения")
                )
                return;
            }
        }
        if(room.status === roomStatus.PENDING) {
            res.status(401).json(
                new APIAnswer(401).setError(ApiError.Forbidden,"Карточка в данный момент на модерации")
            )
            return;
        }

        await this.roomService.changeRoomStatus(id,roomStatus.HIDDEN)
        res.status(200).json(
            new APIAnswer(200)
        )
    }

    async deleteRoom(req: Request, res: Response) {
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
        if(user.role !== userRoles.ADMIN && result._id?.toString() !== user.id) {
            res.status(401).json(
                new APIAnswer(401).setError(ApiError.Forbidden,"Недостаточно прав")
            )
            return;
        }
        await this.roomService.changeRoomStatus(id,roomStatus.DELETED)
        res.status(200).json(
            new APIAnswer(200)
        )
    }

    async aproveRoom(req: Request, res: Response) {
        let user = req.session.user;
        if(!user) {
            res.status(401).json(
                                new APIAnswer(401).setError(ApiError.AuthorizationRequired,"Требуется авторизация")
            )
            return
        }
        if(user.role !== userRoles.ADMIN) {
            res.status(401).json(
                new APIAnswer(401).setError(ApiError.Forbidden,"Недостаточно прав")
            )
            return;
        }
        const { id } = req.params
        let [owner,room] = await Promise.all([
            this.roomService.getRoomOwner(id),
            this.roomService.getRoom(id),
        ])
        if(!owner || !room) {
            res.status(404).json(
                new APIAnswer(404).setError(ApiError.NotFound,"Помещение не найдено")
            )
            return;
        }
        if(room.status !== roomStatus.PENDING) {
            res.status(400).json(
                new APIAnswer(400).setError(ApiError.WrongAction,"Комната уже подтверждена")
            )
            return;
        }
        await this.roomService.changeRoomStatus(id,roomStatus.ACTIVE)
        res.status(200).json(
            new APIAnswer(200)
        )
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