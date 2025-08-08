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

const app = express();
const logger = CreateLogger("express");

logger("Express creation started",LogLevel.Debug)

app.set("trust proxy",1)
app.use(session({
    secret: AppConfig.Security.Sessions.Secret,
    resave: false,
    cookie: {
        secure: AppConfig.Env !== "dev",
        maxAge: 3600000
    },
    
    store: MongoStore.create({
        mongoUrl: AppConfig.Mongo.connectionString
    }),
    saveUninitialized: true
}))

app.use(cors({origin: allowedHosts}));
logger("Allowed origins: "+allowedHosts,LogLevel.Debug)
app.use(express.json());
app.disable('x-powered-by');
app.use(helmet());

// Routers
app.use("/",registrationRouter())
app.use("/",authorizationRouter())
app.use("/user",userRouter())
app.use("/room",roomRouter())
app.use("/images",imageRouter())


logger("Express creation finished",LogLevel.Debug)
export default app;
