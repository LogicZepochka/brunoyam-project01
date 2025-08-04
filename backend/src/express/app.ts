import express, { Request, Response } from "express";
import CreateLogger, { LogLevel } from "../etc/logger";
import cors from "cors";
import { allowedHosts } from "../const";
import helmet from "helmet";
import RegistrationController from "../controllers/registration.controller";
import { registrationRouter } from "../routers/registration.router";
import session from "express-session";
import { AppConfig } from "../config/config";

const app = express();
const logger = CreateLogger("express");

logger("Express creation started",LogLevel.Debug)

app.set("trust proxy",1)
app.use(session({
    secret: AppConfig.Security.Sessions.Secret,
    resave: false,
    cookie: {
        secure: true,
        maxAge: 3600000
    }
}))

app.use(cors({origin: allowedHosts}));
logger("Allowed origins: "+allowedHosts,LogLevel.Debug)
app.use(express.json());
app.disable('x-powered-by');
app.use(helmet());

// Routers
app.use("/",registrationRouter())

logger("Express creation finished",LogLevel.Debug)
export default app;
