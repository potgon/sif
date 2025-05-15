import apiClient from "./client"

export interface RegisterRequest {
    email: string
    password: string
    name: string
    surname?: string
}

export interface LoginRequest {
    email: string
    password: string
}

interface JwtResponse {
    token: string
}

export const register = async (data: RegisterRequest) => {
    return await apiClient.post("/auth/register", data)
}

export const login = async (data: LoginRequest): Promise<JwtResponse> => {
    const response = await apiClient.post("/auth/login", data)
    return response.data
}
