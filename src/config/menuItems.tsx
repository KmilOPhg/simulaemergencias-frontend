import React from "react";
import { PERMISOS } from "../constants/permisos.constants";

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  permiso?: string;
  permisosAny?: string[];
  soloAdmin?: boolean;
}

export interface MenuCategory {
  title: string | null;
  items: MenuItem[];
}

const Icon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const menuConfig: MenuCategory[] = [
  {
    title: null,
    items: [
      {
        id: "home",
        label: "Inicio",
        path: "/home",
        icon: (
          <Icon>
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <path d="M9 22V12h6v10" />
          </Icon>
        ),
      },
    ],
  },
  {
    title: "MÓDULOS",
    items: [
      {
        id: "recursos",
        label: "Recursos",
        path: "/recursos",
        permiso: PERMISOS.RECURSOS_CONSULTAR,
        icon: (
          <Icon>
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </Icon>
        ),
      },
    ],
  },
];
