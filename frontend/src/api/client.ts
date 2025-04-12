import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "/api"

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle errors globally
        console.error("API Error:", error.response?.data || error.message)
        return Promise.reject(error)
    },
)

export default apiClient
