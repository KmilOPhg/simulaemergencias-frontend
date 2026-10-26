import React from "react";
import { NavLink } from "react-router-dom";
import type { MenuItem } from "../../config/menuItems";
import { useAuth } from "../../hooks/useAuth";

export const SidebarItem: React.FC<{ item: MenuItem }> = ({ item }) => {
  const { tienePermiso, tieneAlgunPermiso, esAdministrador } = useAuth();

  const requierePermiso = Boolean(item.permiso) || (item.permisosAny?.length ?? 0) > 0;
  const autorizado =
    (item.soloAdmin && esAdministrador) ||
    (item.permiso ? tienePermiso(item.permiso) : false) ||
    (item.permisosAny?.length ? tieneAlgunPermiso(item.permisosAny) : false);

  if ((item.soloAdmin || requierePermiso) && !autorizado) return null;

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
          isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`
      }
      title={item.label}
    >
      <span className="shrink-0">{item.icon}</span>
      <span className="truncate hidden lg:inline">{item.label}</span>
    </NavLink>
  );
};
