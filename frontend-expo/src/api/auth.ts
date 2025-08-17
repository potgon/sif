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

export interface RegisterResult {
    result: boolean
    message: string
}

export const register = async (data: RegisterRequest): Promise<RegisterResult> => {
    return await apiClient.post("/auth/register", data)
}

export const login = async (data: LoginRequest): Promise<JwtResponse> => {
    const response = await apiClient.post("/auth/login", data)
    return response.data
}
