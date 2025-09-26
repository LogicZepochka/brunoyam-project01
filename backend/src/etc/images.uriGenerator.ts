import { AppConfig } from "../config/config"


export default function GenerateImageURI(imgName: string) {
    return `${AppConfig.Express.DefaultApiURL}images/${imgName}`
}