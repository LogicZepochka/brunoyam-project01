import SignInForm from "@/components/signin/SignInForm";
import { Box, Container, Grid, Paper } from "@mui/material";

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
          <SignInForm />
        </Grid>
      </Grid>
    </Container>
  );
}
