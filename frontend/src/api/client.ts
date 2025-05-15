import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api"

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.response?.data ?? error.message)
        return Promise.reject(error)
    },
)

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token") ?? sessionStorage.getItem("token")
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`
        }
        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default apiClient
