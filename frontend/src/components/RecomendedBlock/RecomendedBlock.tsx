// Серверный компонент Next.js с заглушкой для получения данных

import GetConfig from "@/config/AppConfig"
import { ApiPaginatedResult } from "@/utils/api.types"
import { RoomDTO } from "@/utils/dto.types"
import { Grid, Typography } from "@mui/material"
import { GetStaticProps, InferGetStaticPropsType } from "next"
import RoomCard from "../RoomCards/RoomCard"

export const loadRecomendedBlock = async () => {
    const res = await fetch(`${(await GetConfig()).API_URL}/rooms/list?offset=5`)
    const recomendRooms:ApiPaginatedResult<RoomDTO> = await res.json()
    return recomendRooms
}

export default async function RecomendedBlock() {

    const recomendRooms = await loadRecomendedBlock();

  return (
    <div>
      <h3>Рекомендации</h3>
      <ul>
        <Grid container>
          {recomendRooms.content.data.map(item => <Grid key={item._id} ><RoomCard roomDTO={item} /></Grid>)}
        </Grid>
      </ul>
    </div>
  );
}