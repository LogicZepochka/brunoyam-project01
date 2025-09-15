"use client";

import signInAction from "@/actions/signInAction";
import {
  Alert,
  Box,
  Button,
  Collapse,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useActionState, useEffect } from "react";

export default function SignInForm() {

  const [state, formAction, pending] = useActionState(signInAction, {});


  const handleClickToRegister = () => {
    window.location.href = "/register";
  };

  const handleClickToForgotPassword = () => {
    window.location.href = "/forgot-password";
  };

  return (
    <Box minWidth="450px">
      <Typography align="center" variant="h4">
        Авторизация
      </Typography>
      <form action={formAction}>
        <Box padding={2}>
          <Stack spacing={2}>
            <TextField
              label="Почтовый ящик"
              placeholder="email@example.ru"
              name="email"
              error={state.errors?.email != undefined}
              helperText={state.errors?.email}
              fullWidth
            />
            <TextField
              type="password"
              label="Пароль"
              name="password"
              fullWidth
            />
            <Stack spacing={1}>
              <Collapse in={state.data?.error}>
                <Alert severity="error">
                  {state.data?.errorMessage}
                </Alert>
              </Collapse>
              <Button
                type="submit"
                variant="contained"
                disabled={pending}
                loading={pending}
                onSubmit={() => {}}
              >
                Авторизироваться
              </Button>
              <Button
                type="button"
                variant="text"
                color="inherit"
                onClick={handleClickToForgotPassword}
              >
                Забыл пароль
              </Button>
            </Stack>
          </Stack>
        </Box>
      </form>
      <Divider />
      <Stack spacing={0} padding={2}>
        <Typography align="center" variant="caption">
          Еще нет аккаунта?
        </Typography>
        <Button type="button" variant="text" onClick={handleClickToRegister}>
          Создайте его сейчас
        </Button>
      </Stack>
    </Box>
  );
}
