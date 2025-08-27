"use client";

import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function SignInForm() {
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
      <Box component="form" padding={2}>
        <Stack spacing={2}>
          <TextField
            label="Почтовый ящик"
            placeholder="email@example.ru"
            name="email"
            fullWidth
          />
          <TextField type="password" label="Пароль" name="email" fullWidth />
          <Stack>
            <Button type="submit" variant="contained" onSubmit={() => {}}>
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
