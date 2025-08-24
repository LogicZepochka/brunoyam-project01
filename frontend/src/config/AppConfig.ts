'use server'

interface AppConfig {
    ENV: string,
    API_URL: string
}

const Config: AppConfig = {
    ENV: process.env.NODE_ENV || "dev",
    API_URL: process.env.API_URL || ""
}

export default async function GetConfig() {
    return Config
}