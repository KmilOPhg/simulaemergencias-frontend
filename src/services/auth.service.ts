import api from "./api";
import type { RolSesion, UsuarioSesion } from "../types/auth.types";

export interface LoginResult {
  token: string;
  refreshToken?: string;
  user: UsuarioSesion;
  permisos: string[];
}

export interface SesionAuth {
  permisos: string[];
  roles: RolSesion[];
}

export const AuthService = {
  login: async (email: string, password: string): Promise<LoginResult> => {
    const { data } = await api.post("/auth/login", { email, password });
    const payload = data?.data ?? {};
    return {
      token: payload.token ?? payload.accessToken,
      refreshToken: payload.refreshToken,
      user: payload.user,
      permisos: Array.isArray(payload.permisos) ? (payload.permisos as string[]) : [],
    };
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout").catch(() => {
      // Si el token ya expiró o la red falla, igual limpiamos la sesión local.
    });
  },

  obtenerMisPermisos: async (): Promise<SesionAuth> => {
    const { data } = await api.get("/auth/me/permisos");
    const payload = data?.data;
    return {
      permisos: payload && Array.isArray(payload.permisos) ? (payload.permisos as string[]) : [],
      roles: payload && Array.isArray(payload.roles) ? (payload.roles as RolSesion[]) : [],
    };
  },

  cambiarContrasena: async (payload: {
    passwordActual: string;
    passwordNueva: string;
    confirmPassword: string;
  }): Promise<void> => {
    await api.patch("/auth/me/contrasena", payload);
  },
};
