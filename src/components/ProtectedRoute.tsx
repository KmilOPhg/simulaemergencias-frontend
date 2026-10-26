import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { SinAcceso } from "./SinAcceso";

interface ProtectedRouteProps {
  element: React.ReactElement;
  /** Un solo permiso requerido. */
  permiso?: string;
  /** Basta con tener alguno de estos (OR). */
  permisosAny?: string[];
  /** Solo rol fijo `admin` (no es permiso asignable). */
  soloAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, permiso, permisosAny, soloAdmin }) => {
  const { isAuthenticated, loading, tienePermiso, tieneAlgunPermiso, esAdministrador } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const requierePermiso = Boolean(permiso) || (permisosAny?.length ?? 0) > 0;
  const autorizado =
    (soloAdmin && esAdministrador) ||
    (permiso ? tienePermiso(permiso) : false) ||
    (permisosAny?.length ? tieneAlgunPermiso(permisosAny) : false);

  if ((soloAdmin || requierePermiso) && !autorizado) {
    return React.cloneElement(element, {}, <SinAcceso />);
  }

  return element;
};
