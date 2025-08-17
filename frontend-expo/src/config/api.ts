// API Configuration
// Update these values according to your environment

export const API_CONFIG = {
    // Development
    development: {
        baseURL: "http://localhost:8080/api",
    },
    // Production
    production: {
        baseURL: "https://your-backend-domain.com/api", // Update this with your actual backend URL
    },
    // Staging
    staging: {
        baseURL: "https://staging.your-backend-domain.com/api", // Update this if you have a staging environment
    }
}

// Get current environment
const getEnvironment = () => {
    if (__DEV__) return 'development'
    // You can add logic here to detect staging vs production
    return 'production'
}

export const getApiBaseURL = () => {
    //const env = getEnvironment()
    //return API_CONFIG[env].baseURL
    return "http://localhost:8080/api"
}
