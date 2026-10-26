import axios from "axios";
import { toast } from "sonner";
import { leerToken, limpiarSesion } from "../utils/sesion.storage";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1206/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = leerToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const RUTAS_PUBLICAS = ["/login", "/recuperar-contrasena", "/restablecer-contrasena", "/reset-password"];

const esRutaPublica = () => RUTAS_PUBLICAS.some((ruta) => window.location.pathname.startsWith(ruta));

let redirigiendoPorSesionExpirada = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error.config?.url?.includes("/auth/");
    if (error.response?.status === 401 && !isAuthEndpoint) {
      limpiarSesion();
      if (!esRutaPublica() && !redirigiendoPorSesionExpirada) {
        redirigiendoPorSesionExpirada = true;
        toast.error("Tu sesión ha expirado. Por favor inicia sesión de nuevo.");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
