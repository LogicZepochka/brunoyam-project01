

import { AppConfig } from "./config/config";
import CreateLogger, { LogLevel } from "./etc/logger";
import app from "./express/app";

const mainLog = CreateLogger("main");


try {
app.listen(AppConfig.Express.Port,(err) => {
    if(err) {
        mainLog("FAILED TO LAUNCH SERVER",LogLevel.Critical)
        mainLog(err.message,LogLevel.Critical)
        process.exit(1);
    } 
    else {
        mainLog(`Express server started at port ${AppConfig.Express.Port}`)
    }
})
}
catch(e) {
    mainLog(`Failed to start server:\n${e}`,LogLevel.Critical)
}