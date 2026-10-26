import type { RolSesion, UsuarioSesion } from "../types/auth.types";

const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const USUARIO_KEY = "usuario";
const PERMISOS_KEY = "permisos";
const ROLES_KEY = "roles";

export interface DatosLogin {
  token: string;
  refreshToken?: string;
  user: UsuarioSesion;
  permisos: string[];
}

/** Persiste toda la sesión tras un login exitoso. */
export const guardarSesion = (data: DatosLogin) => {
  localStorage.setItem(TOKEN_KEY, data.token);
  if (data.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  }
  localStorage.setItem(USUARIO_KEY, JSON.stringify(data.user));
  localStorage.setItem(PERMISOS_KEY, JSON.stringify(data.permisos ?? []));
  localStorage.setItem(ROLES_KEY, JSON.stringify(data.user.roles ?? []));
};

/** Actualiza solo los tokens (usado tras un refresh de sesión). */
export const actualizarTokens = (tokens: { token: string; refreshToken?: string }) => {
  localStorage.setItem(TOKEN_KEY, tokens.token);
  if (tokens.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }
};

export const guardarPermisosSesion = (permisos: string[], roles: RolSesion[]) => {
  localStorage.setItem(PERMISOS_KEY, JSON.stringify(permisos));
  localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
};

export const leerToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const leerRefreshToken = (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY);

export const leerUsuario = (): UsuarioSesion | null => {
  try {
    const raw = localStorage.getItem(USUARIO_KEY);
    return raw ? (JSON.parse(raw) as UsuarioSesion) : null;
  } catch {
    return null;
  }
};

export const leerPermisos = (): string[] => {
  try {
    const raw = localStorage.getItem(PERMISOS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((p): p is string => typeof p === "string") : [];
  } catch {
    return [];
  }
};

export const leerRoles = (): RolSesion[] => {
  try {
    const raw = localStorage.getItem(ROLES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (r): r is RolSesion => r != null && typeof r === "object" && typeof r.id === "number" && typeof r.nombre === "string"
    );
  } catch {
    return [];
  }
};

export const limpiarSesion = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USUARIO_KEY);
  localStorage.removeItem(PERMISOS_KEY);
  localStorage.removeItem(ROLES_KEY);
};
