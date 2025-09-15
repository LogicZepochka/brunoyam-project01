"use client";

import signUpAction from "@/actions/signUpAction";
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
import { useActionState, useState } from "react";


export default function SignUpForm() {

  const [state, formAction, pending] = useActionState(signUpAction, {});



  const handleClickToLogin = () => {
    window.location.href = "/signin";
  };

  return (
    <Box minWidth="450px">
      <Typography align="center" variant="h4">
        Регистрация
      </Typography>
      <Box component="form" padding={2} action={formAction}>
        <Stack spacing={2}>
        <TextField
            label="Ваше имя"
            error={!!state.errors?.name}
            helperText={state.errors?.name?.errors ? state.errors.name.errors.join(", ") : ""}
            name="name"
            fullWidth
            required
            defaultValue={state.fields?.name ?? ""}
          />
          <TextField
            label="Почтовый ящик"
            error={state.errors?.email != undefined}
            helperText={state.errors?.email?.errors}
            placeholder="email@example.ru"
            name="email"
            fullWidth
            defaultValue={state.fields?.email ?? ""}
            required
          />
          <TextField
            label="Телефон"
            error={state.errors?.phone != undefined}
            helperText={state.errors?.phone?.errors}
            placeholder="+79999999999"
            name="phone"
            fullWidth
            required
          />
          <Divider />
          <TextField type="password" label="Пароль" name="password" fullWidth required/>
          <TextField
            type="password"
            label="Повтори пароль"
            name="passwordRepeat"
            fullWidth
            required
          />
          <Divider />
          <Stack spacing={1}>
            <Collapse in={state.data?.error}>
              <Alert severity="error">
                  {state.data?.errorMessage}
              </Alert>
            </Collapse>
            <Button type="submit" variant="contained" loading={pending} disabled={pending} onSubmit={() => {}}>
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
