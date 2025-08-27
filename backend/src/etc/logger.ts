import { AppConfig } from "../config/config";

export enum LogLevel {
    Debug = "debug",
    Info = "info",
    Warning = "warn",
    Error = "error",
    Critical = "CRITICAL"
}

export default function CreateLogger(tag: string) {

    return (message: string, level: LogLevel = LogLevel.Info) => {
        let curTime = new Date();
        let msg = `[${curTime.toLocaleDateString()} ${curTime.toLocaleTimeString()}][${level.toUpperCase()}][${tag}]\t${message}`;
        switch(level) {
            case LogLevel.Debug: {if(AppConfig.Env === "dev") console.log(`\x1b[34m${msg}\x1b[0m`); break;}
            case LogLevel.Warning: {console.log(`\x1b[33m${msg}\x1b[0m`); break;}
            case LogLevel.Error: {console.log(`\x1b[31m${msg}\x1b[0m`); break;}
            case LogLevel.Critical: {console.log(`\x1b[41m${msg}\x1b[0m`); break;}
            default: {console.log(msg)}
        }
    }
}