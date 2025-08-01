import z from "zod";


const RegistrationSchema = z.object({
    phone:      z.string()
                .length(12, "Телефон должен быть 12 символов")
                .regex(/^\+7\d{10}$/, "Номер должен начинаться с +7 и содержать 10 цифр после"),
    email:      z.email("Отправлена невалидная почта"),
    name:       z.string(),
    password:   z.string()
                .min(8,"Минимальная длина пароля 8 символов")
})

export default RegistrationSchema;