
import z from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


const RoomCreateSchema = z.object({
    title: z.string().max(100),
    address: z.string(),
    price: z.string().transform((val) => Number(val)),
    area: z.string().transform((val) => Number(val)),
    shortDescription: z.string().max(200),
    fullDescription: z.string().max(5000)
})

export { RoomCreateSchema }