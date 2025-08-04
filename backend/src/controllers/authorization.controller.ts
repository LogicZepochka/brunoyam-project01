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

const log = CreateLogger("AuthController")

export default class AuthorizationController {

    private authService: AuthorizationService

    constructor(service: AuthorizationService) {
        this.authService = service
        this.SignInUser = this.SignInUser.bind(this);
        this.SignOutUser = this.SignOutUser.bind(this);
        log("AuthorizationService is created",LogLevel.Debug)
    }

    async SignInUser(req: Request, res: Response) {
    // Если пользователь уже авторизован
    if (req.session.user) {
        return res.status(400).json(
            new APIAnswer(400).setError(ApiError.WrongAction, "Вы уже авторизованы")
        );
    }

    try {
        // Валидация входных данных
        const parseResult = await AuthorizationSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json(
                new APIAnswer(400)
                    .setError(ApiError.InvalidInput, "Некорректно введенные данные")
                    .setContent(AppConfig.Env === "dev" ? parseResult.error.issues : undefined)
            );
        }

        // Авторизация пользователя
        const user = await this.authService.AuthorizeUser(parseResult.data.email, parseResult.data.password);
        if (!user._id || !user.name || !user.email) {
            log("Returned empty user object: Session is not updated!", LogLevel.Error);
            throw new ApiException("Empty user", ApiError.Unknown);
        }

        // Обновление сессии
        req.session.user = {
            id: user._id,
            username: user.name,
            email: user.email
        };

        // Успешный ответ
        return res.status(200).json(new APIAnswer(200));
    } catch (error) {
        if (error instanceof ApiException) {
            switch (error.name) {
                case ApiError.NotFound:
                    return res.status(404).json(
                        new APIAnswer(404).setError(ApiError.NotFound, "Пользователь с таким email не найден")
                    );
                case ApiError.Forbidden:
                    return res.status(401).json(
                        new APIAnswer(401).setError(ApiError.Forbidden, "Неверный пароль")
                    );
                default:
                    return res.status(500).json(
                        new APIAnswer(500).setError(ApiError.Unknown, "Неизвестная ошибка")
                    );
            }
        } else {
            log(`Error when sign in user:`, LogLevel.Error);
            log(`${error}`, LogLevel.Error);
            return res.status(500).json(
                new APIAnswer(500).setError(ApiError.Unknown, "Неизвестная ошибка")
            );
        }
    }
}

    async SignOutUser(req: Request, res: Response) {
        if(req.session.user) {
            req.session.user = undefined
            req.session.destroy((err) => {
                if(err) {
                    log(`Failed to destroy session:`,LogLevel.Error)
                    log(`${err}`,LogLevel.Error)
                }
                else {
                    log(`Session is cleared`,LogLevel.Debug)
                }
            })
            return res.status(200).json(
                new APIAnswer(200)
            )
        }
        else {
            return res.status(400).json(
                new APIAnswer(400).setError(ApiError.AuthorizationRequired,"Вы не авторизованы")
            )
        }
    }
}