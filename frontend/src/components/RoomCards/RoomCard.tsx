import GetConfig from "@/config/AppConfig";
import { RoomDTO } from "@/utils/dto.types";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Stack, Typography } from "@mui/material";

interface RoomCardProps {
    roomDTO: RoomDTO,
    size?: "small" | "medium" | "large"
}

const defaultSize: "small" | "medium" | "large" = "large";

export default async function RoomCard(props: RoomCardProps) {

    const size = props.size || defaultSize;

    return (
        <Card>
            {size != "small" ? <CardMedia
                sx={{ height: size == "large" ? 240 : 120 }}
                image={`${(await GetConfig()).API_URL}/images/${props.roomDTO.images[0]}`}
                title={props.roomDTO.title}
            /> : <></>}
            <CardContent>
                <Stack>
                    <Typography variant="h4">{props.roomDTO.title}</Typography>
                    <Typography variant="caption">{props.roomDTO.address}</Typography>
                </Stack>
                <Stack>
                    <Typography variant="caption">{props.roomDTO.area} м² ({(props.roomDTO.price / props.roomDTO.area).toFixed(2)} р./м²)</Typography>
                    <Typography variant="h5">{props.roomDTO.price} р.</Typography>
                </Stack>
                <Box>
                    <Typography variant="body2">{props.roomDTO.shortDescription}</Typography>
                </Box>
            </CardContent>
            <CardActions>
                <Button>Подробнее</Button>
            </CardActions>
        </Card>
    )
}