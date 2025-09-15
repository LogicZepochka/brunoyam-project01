import SignInForm from "@/components/signin/SignInForm";
import { Box, Container, Grid, Paper } from "@mui/material";

export const metadata = {
  title: "Dwellio - Авторизация",
  description: "Dwellio — это удобный сервис для поиска, бронирования и аренды жилья. Найдите идеальное место для проживания быстро и просто.",
};

export default function SignInPage() {
  return (
    <Container maxWidth="xl">
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid>
          <SignInForm />
        </Grid>
      </Grid>
    </Container>
  );
}
