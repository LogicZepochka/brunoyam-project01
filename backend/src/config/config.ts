import dotenv from "dotenv";
import CreateLogger, { LogLevel } from "../etc/logger";
import mongoose from "mongoose";

dotenv.config({quiet: true});



interface AppConfig {
    Express: {
        Port: number,
        DefaultApiURL: string
    },
    Env: "production" | "dev" | string,
    Mongo: {
        connectionString: string
    },
    Security: {
        Sessions: {
            Secret: string
        }
    }
}



const AppConfig: AppConfig = {
    Express: {
        Port: Number(process.env.EXPRESS_PORT) || 3000,
        DefaultApiURL: process.env.DEFAULT_URL || "http://localhost:3000/"
    },
    Env: process.env.NODE_ENV || "dev",
    Mongo: {
        connectionString: process.env.MONGO_DB || ""
    },
    Security: {
        Sessions: {
            Secret: process.env.SESSION_SECRET || "SECRET_NOT_SET"
        }
    }
}
const log = CreateLogger("Settings");

log(`Preparing app settings...`,LogLevel.Info)
log(`MongoConnectionString: ${process.env.MONGO_DB ? "YES" : "NO"}`,process.env.MONGO_DB ? LogLevel.Debug : LogLevel.Warning)
log(`Security-Sessions-Secret: ${process.env.SESSION_SECRET ? "YES" : "NO"}`,process.env.SESSION_SECRET ? LogLevel.Debug : LogLevel.Warning)

export { AppConfig }