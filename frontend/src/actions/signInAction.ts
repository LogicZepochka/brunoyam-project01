'use server'

import GetConfig from "@/config/AppConfig"
import z from "zod"

const signInSchema = z.object({
    email: z.email("Требуется валидный почтовый ящик в формате xxx@yyy.dd"),
    password: z.string()
})

interface StateData {
    status: number,
    error?: boolean,
    errorCode?: string
    errorMessage?: string
}

type SignInState = {
    errors?: { email?: string[]; password?: string[] }
    status?: number
    data?: StateData
}

export default async function signInAction(prevState: SignInState, formData: FormData): Promise<SignInState> {
    console.log("signInAction")
    const validatedFields = await signInSchema.safeParseAsync({
        email: formData.get("email"),
        password: formData.get("password")
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const response = await fetch(`${(await GetConfig()).API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(validatedFields.data)
    })

    let data: unknown
    try {
        data = await response.json()
    } catch {
        data = null
    }

    return {
        status: response.status,
        data: data as StateData | undefined
    }
}