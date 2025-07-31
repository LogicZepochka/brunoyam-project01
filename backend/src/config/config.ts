import dotenv from "dotenv";
import CreateLogger, { LogLevel } from "../etc/logger";
import mongoose from "mongoose";

dotenv.config({quiet: true});

interface AppConfig {
    Express: {
        Port: number
    },
    Env: "production" | "dev" | string,
    Mongo: {
        connectionString: string
    }
}



const AppConfig: AppConfig = {
    Express: {
        Port: Number(process.env.EXPRESS_PORT) || 3000
    },
    Env: process.env.NODE_ENV || "dev",
    Mongo: {
        connectionString: process.env.MONGO_DB || ""
    }
}


CreateLogger("-------")(`Application loaded in '${AppConfig.Env}' enviroment`,LogLevel.Warning)





export { AppConfig }