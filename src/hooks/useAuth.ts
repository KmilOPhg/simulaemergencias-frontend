import { useEffect, useState } from "react";
import { AuthService } from "../services/auth.service";
import {
  guardarPermisosSesion,
  leerPermisos,
  leerRoles,
  leerToken,
  leerUsuario,
  limpiarSesion,
} from "../utils/sesion.storage";
import type { RolSesion, UsuarioSesion } from "../types/auth.types";
import { ROL_ADMIN } from "../constants/roles.constants";

/**
 * La validez del token la decide siempre el backend (GET /auth/me/permisos), no se
 * decodifica el JWT en el cliente. Esto funciona igual sin importar si el token lo
 * emitió este backend (JWT propio) o Supabase Auth (GoTrue).
 */
export const useAuth = () => {
  const [user, setUser] = useState<UsuarioSesion | null>(null);
  const [permisos, setPermisos] = useState<string[]>([]);
  const [roles, setRoles] = useState<RolSesion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const init = async () => {
      const token = leerToken();
      const usuarioLocal = leerUsuario();

      if (!token || !usuarioLocal) {
        limpiarSesion();
        setLoading(false);
        return;
      }

      setUser(usuarioLocal);
      setPermisos(leerPermisos());
      setRoles(leerRoles());
      setIsAuthenticated(true);

      try {
        const sesion = await AuthService.obtenerMisPermisos();
        setPermisos(sesion.permisos);
        setRoles(sesion.roles);
        guardarPermisosSesion(sesion.permisos, sesion.roles);
      } catch (err) {
        console.error("No se pudo validar la sesión con el backend:", err);
        limpiarSesion();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const tienePermiso = (codigo: string): boolean => permisos.includes(codigo);

  const tieneAlgunPermiso = (codigos: string[]): boolean => codigos.some((codigo) => permisos.includes(codigo));

  const esAdministrador = roles.some((rol) => rol.nombre === ROL_ADMIN);

  const recargarPermisos = async () => {
    try {
      const sesion = await AuthService.obtenerMisPermisos();
      setPermisos(sesion.permisos);
      setRoles(sesion.roles);
      guardarPermisosSesion(sesion.permisos, sesion.roles);
    } catch (err) {
      console.error("No se pudieron recargar permisos:", err);
    }
  };

  const logout = async () => {
    await AuthService.logout();
    limpiarSesion();
    setUser(null);
    setPermisos([]);
    setRoles([]);
    setIsAuthenticated(false);
  };

  return {
    user,
    permisos,
    roles,
    tienePermiso,
    tieneAlgunPermiso,
    esAdministrador,
    recargarPermisos,
    loading,
    isAuthenticated,
    logout,
  };
};
