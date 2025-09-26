import GetConfig from "@/config/AppConfig"
import Image from "next/image"

interface RoomImageProps {
    imageId: string,
    width: number,
    height: number
}

export default async function RoomImage(props: RoomImageProps) {

    

    return (
        <Image 
            src={`${(await GetConfig()).API_URL}/images/${props.imageId}`}
            width={props.width}
            height={props.height}
            alt=""
        />
    )
}