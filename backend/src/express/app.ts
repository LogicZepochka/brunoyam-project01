import express, { Request, Response } from "express";
import CreateLogger, { LogLevel } from "../etc/logger";
import cors from "cors";
import { allowedHosts } from "../const";
import helmet from "helmet";
import RegistrationController from "../controllers/registration.controller";
import { registrationRouter } from "../routers/registration.router";
import session from "express-session";
import { AppConfig } from "../config/config";
import MongoStore from "connect-mongo";
import { authorizationRouter } from "../routers/authorization.router";
import { userRouter } from "../routers/user.router";
import { roomRouter } from "../routers/room.router";
import { imageRouter } from "../routers/image.router";
import {rateLimit} from "express-rate-limit"
import APIAnswer from "../builders/api/answer.builder";
import { ApiError } from "../builders/api/errors.enum";

const app = express();
const logger = CreateLogger("express");

logger("Express creation started",LogLevel.Debug)

app.set("trust proxy",1)
app.use(rateLimit({
    windowMs: 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: JSON.stringify(
        new APIAnswer(429).setError(ApiError.ToManyRequests,"Получено слишком много запросов за короткое время")
    )
}))

app.use(session({
    secret: AppConfig.Security.Sessions.Secret,
    resave: false,
    cookie: {
        secure: AppConfig.Env !== "dev",
        maxAge: 3600000,
        httpOnly: true,
        sameSite: "lax"        
    },
    
    store: MongoStore.create({
        mongoUrl: AppConfig.Mongo.connectionString
    }),
    saveUninitialized: false
}))

app.use(cors({origin: allowedHosts}));
logger("Allowed origins: "+allowedHosts,LogLevel.Debug)
app.use(express.json());
app.disable('x-powered-by');
app.use(helmet());

// Routers
app.use("/",registrationRouter())
app.use("/",authorizationRouter())
app.use("/users",userRouter())
app.use("/rooms",roomRouter())
app.use("/images",imageRouter())


logger("Express creation finished",LogLevel.Debug)
export default app;
