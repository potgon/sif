import {useEffect, useState} from "react";

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Nuevo estado

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    //await validateToken(token);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.log(error);
                    localStorage.removeItem("token");
                }
            }
            setIsLoading(false);
        };
        checkAuth();
    }, []);

    return { isAuthenticated, isLoading };
};