import apiClient from "./client"

export interface RegisterRequest {
    email: string
    password: string
    firstName: string
    lastName?: string
}

export const register = async (data: RegisterRequest) => {
    const response = await apiClient.post("/auth/register", data)
    return response.data
}
