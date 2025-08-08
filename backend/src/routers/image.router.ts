import { Router } from "express"
import ImagesController from "../controllers/images.controller";



const router = Router();
const imageController = new ImagesController();


export const imageRouter = () => {
    
    router.get("/:id",imageController.sendFile)
    return router;
}