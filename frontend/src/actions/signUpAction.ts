'use server'

import GetConfig from "@/config/AppConfig"
import { redirect } from "next/navigation"
import z from "zod"

const signUpSchema = z.object({
    email: z.email("Требуется валидный почтовый ящик в формате xxx@yyy.dd"),
    name: z.string("Требуется имя"),
    password: z.string().min(8,"Минимальная длина пароля - 8 символов"),
    phone: z.string().regex(/^\+79\d{9}$/, "Телефон должен быть в формате +79XXXXXXXXX"),
})

interface StateData {
    status: number,
    error?: boolean,
    errorCode?: string
    errorMessage?: string
}

type SignUpState = {
    errors?: { name?: {errors: string[]}, email?:{errors: string[]}; password?: {errors: string[]}, phone?: {errors: string[]} }
    status?: number
    data?: StateData,
    fields?: {
        email: string;
        name: string;
        phone: string;
    }
}

export default async function signUpAction(prevState: SignUpState, formData: FormData): Promise<SignUpState> {
    const validatedFields = await signUpSchema.safeParseAsync({
        email: formData.get("email"),
        password: formData.get("password"),
        phone: formData.get("phone"),
        name: formData.get("name")
    })

    if (!validatedFields.success) {
        
        return {
            errors: z.treeifyError(validatedFields.error).properties,
            fields: {
                email: (formData.get("email")?.toString() ?? ""),
                phone: (formData.get("phone")?.toString() ?? ""),
                name: (formData.get("name")?.toString() ?? ""),
            }
        }
    }

    const response = await fetch(`${(await GetConfig()).API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(validatedFields.data)
    })

    if(response.status == 201) {
        redirect("/signin?from=reg")
    }

    let data: unknown
    try {
        data = await response.json()
        
    } catch {
        data = null
    }

    return {
        status: response.status,
        data: data as StateData | undefined,
        fields: {
            email: validatedFields.data.email,
            phone: validatedFields.data.phone,
            name: validatedFields.data.name,
        }
    }
}