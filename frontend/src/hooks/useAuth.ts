export const useAuth = () => {
    const token = localStorage.getItem("token") ?? sessionStorage.getItem("token")
    const isAuthenticated = !!token
    return { token, isAuthenticated }
}