import RecomendedBlock from "@/components/RecomendedBlock/RecomendedBlock";
import GetConfig from "@/config/AppConfig";
import { ApiPaginatedResult } from "@/utils/api.types";
import { RoomDTO } from "@/utils/dto.types";
import { Container } from "@mui/material";
import { GetStaticProps } from "next";
import Image from "next/image";

export default function Home() {
  return (
  <Container>
      <RecomendedBlock />
  </Container>);
}
