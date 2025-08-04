import z from "zod";


const AuthorizationSchema = z.object({
    email:      z.email("Отправлена невалидная почта"),
    password:   z.string()
})

export default AuthorizationSchema;