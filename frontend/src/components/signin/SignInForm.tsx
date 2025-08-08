"use strict";

import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function SignInForm() {
  return (
    <Box minWidth="450px">
      <Typography align="center" variant="h4">
        Авторизация
      </Typography>
      <Box component="form" padding={2}>
        <Stack spacing={2}>
          <TextField label="Почтовый ящик" name="email" fullWidth />
          <TextField type="password" label="Пароль" name="email" fullWidth />
          <Stack>
            <Button type="submit" variant="contained">
              Авторизироваться
            </Button>
            <Button type="button" variant="text" color="inherit">
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
        <Button type="button" variant="text">
          Создайте его сейчас
        </Button>
      </Stack>
    </Box>
  );
}
