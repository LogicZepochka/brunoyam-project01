"use client";

import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function SignUpForm() {
  const handleClickToLogin = () => {
    window.location.href = "/signin";
  };

  return (
    <Box minWidth="450px">
      <Typography align="center" variant="h4">
        Регистрация
      </Typography>
      <Box component="form" padding={2}>
        <Stack spacing={2}>
          <TextField
            label="Почтовый ящик"
            placeholder="email@example.ru"
            name="email"
            fullWidth
          />
          <TextField
            label="Телефон"
            placeholder="+7(999)999-99-99"
            name="phone"
            fullWidth
          />
          <Divider />
          <TextField type="password" label="Пароль" name="password" fullWidth />
          <TextField
            type="password"
            label="Повтори пароль"
            name="passwordRepeat"
            fullWidth
          />
          <Divider />
          <Stack>
            <Button type="submit" variant="contained" onSubmit={() => {}}>
              Зарегистрироваться
            </Button>
          </Stack>
        </Stack>
      </Box>
      <Divider />
      <Stack spacing={0} padding={2}>
        <Typography align="center" variant="caption">
          Уже есть аккаунт?
        </Typography>
        <Button type="button" variant="text" onClick={handleClickToLogin}>
          Авторизируйтесь
        </Button>
      </Stack>
    </Box>
  );
}
