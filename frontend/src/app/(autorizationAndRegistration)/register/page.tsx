import SignInForm from "@/components/signin/SignInForm";
import SignUpForm from "@/components/signin/SignUpForm";
import { Box, Container, Grid, Paper } from "@mui/material";

export const metadata = {
  title: "Dwellio - Регистрация",
  description: "Dwellio — это удобный сервис для поиска, бронирования и аренды жилья. Найдите идеальное место для проживания быстро и просто.",
};

export default function Home() {
  return (
    <Container maxWidth="xl">
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid>
          <SignUpForm />
        </Grid>
      </Grid>
    </Container>
  );
}
