import { Request, Response } from "express";
import UserService from "../services/user.service";
import RegistrationSchema from "../validators/registration.validator";
import APIAnswer from "../builders/api/answer.builder";
import { ApiError } from "../builders/api/errors.enum";
import { AppConfig } from "../config/config";
import RegistrationService from "../services/registration.service";
import CreateLogger, { LogLevel } from "../etc/logger";

const log = CreateLogger("RegistrationController")

export default class RegistrationController {

    private regService: RegistrationService

    constructor(service: RegistrationService) {
        this.regService = service
        this.RegisterUser = this.RegisterUser.bind(this);
        log("RegistrationController is created",LogLevel.Debug)
    }

    async RegisterUser(req: Request, res: Response) {
        if(req.session.user) {
            return res.status(400).json(
                new APIAnswer(400).setError(ApiError.WrongAction,"Вы уже авторизированы. Выйдите из учетной записи, чтобы зарегистрироваться")
            )
        }
        log(`Service is ${this.regService}`,LogLevel.Debug)
        try {
            let parseResult = await RegistrationSchema.safeParseAsync(req.body);
            if(!parseResult.success) {
                log("Data parsing is failed: "+parseResult.error,LogLevel.Debug)
                return res.status(400).json(
                    new APIAnswer(400).setError(ApiError.InvalidInput,"Введены неверные данные").setContent(
                        AppConfig.Env == "dev" ? parseResult.error.issues : undefined
                    )
                )
            }
            let [phoneIsFree,emailIsFree] = await Promise.all([
                this.regService.isPhoneFree(parseResult.data.phone),
                this.regService.IsEmailFree(parseResult.data.email)
            ])
            if(!phoneIsFree) {
                log(`Phone ${parseResult.data.phone} is already used`,LogLevel.Debug)
                return res.status(409).json(
                    new APIAnswer(409).setError(ApiError.AlreadyCreated,"Телефон уже зарегистрирован")
                )
            }
            if(!emailIsFree) {
                log(`Email ${parseResult.data.email} is already used`,LogLevel.Debug)
                return res.status(409).json(
                    new APIAnswer(409).setError(ApiError.AlreadyCreated,"Почтовый ящик уже зарегистрирован")
                )
            }

            let result = await this.regService.RegisterUser(parseResult.data);
            if(result) {
                log(`Successful user registration: ${parseResult.data.email}`,LogLevel.Debug)
                return res.status(201).json(
                    new APIAnswer(201)
                )
            }
            else {
                log(`Registration is failed by unknown reason (?)`,LogLevel.Debug)
                return res.status(500).json(
                    new APIAnswer(500).setError(ApiError.Unknown,"Произошла неизвестная ошибка")
                )
            }
        }
        catch(e) {
            log(`User registration error:`,LogLevel.Error)
            log(`${e}`,LogLevel.Error)
            return res.status(500).json(
                    new APIAnswer(500).setError(ApiError.InternalError,"Произошла ошибка на стороне сервера")
            )
        }
    }
}