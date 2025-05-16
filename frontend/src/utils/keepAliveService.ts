const PING_INTERVAL = 10 * 60 * 1000; // 10 minutos
const BACKEND_URL = import.meta.env.VITE_API_URL + "/health"; // Endpoint de health-check

class KeepAliveService {
    constructor() {
        this.intervalId = null;
    }

    start() {
        this.intervalId = setInterval(async () => {
            try {
                await axios.get(BACKEND_URL);
                console.log("Ping exitoso - Backend activo");
            } catch (error) {
                console.error("Error en el ping:", error.message);
            }
        }, PING_INTERVAL);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}

export const keepAliveService = new KeepAliveService();