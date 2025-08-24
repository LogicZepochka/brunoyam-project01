'use server'

import GetConfig from "@/config/AppConfig"
import z, { email } from "zod"

const signInSchema = z.object({
    email: z.email("Требуется валидный почтовый ящик в формате xxx@yyy.dd"),
    password: z.string()
})

export default async function signInAction(formData: FormData) {
    
    
    console.log("signInAction")
    const validatedFields = await signInSchema.safeParseAsync({
        email: formData.get("email"),
        password: formData.get("password")
    })

    if (!validatedFields.success) {
        return {
            errors: z.flattenError(validatedFields.error).fieldErrors,
        }
    }

    let result = await fetch(`${(await GetConfig()).API_URL}/login`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(validatedFields.data)
    })

    console.log(result)
    return await {
        status: result.status,
        data: result.json()
    }
}