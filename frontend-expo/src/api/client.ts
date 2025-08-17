import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { getApiBaseURL } from "../config/api"

const API_URL = getApiBaseURL()

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.error("API Error:", {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url,
            method: error.config?.method
        })
        
        // Handle 401 Unauthorized responses (expired/invalid token)
        if (error.response?.status === 401) {
            try {
                // Clear the invalid token
                await AsyncStorage.removeItem("token")
                // You could also redirect to sign-in here if needed
                console.log("Token expired or invalid, cleared from storage")
            } catch (storageError) {
                console.error("Error clearing token:", storageError)
            }
        }
        
        return Promise.reject(error)
    },
)

apiClient.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem("token")
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`
                console.log('Sending request with token:', token.substring(0, 20) + '...')
            } else {
                console.log('No token found in storage')
            }
        } catch (error) {
            console.error("Error getting token from storage:", error)
        }
        console.log('Request config:', {
            method: config.method,
            url: config.url,
            hasAuth: !!config.headers["Authorization"]
        })
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default apiClient
