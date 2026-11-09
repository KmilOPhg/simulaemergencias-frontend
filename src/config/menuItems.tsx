import React from "react";
import { ClipboardCheck, Home, Shield, Users } from "lucide-react";
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

export const menuConfig: MenuCategory[] = [
  {
    title: null,
    items: [
      {
        id: "home",
        label: "Inicio",
        path: "/home",
        icon: <Home size={18} aria-hidden />,
      },
      {
        id: "estudiantes",
        label: "Estudiantes",
        path: "/estudiantes",
        permiso: PERMISOS.ESTUDIANTES_CONSULTAR,
        icon: <Users size={18} aria-hidden />,
      },
      {
        id: "ejercicios",
        label: "Ejercicios",
        path: "/ejercicios",
        permiso: PERMISOS.EJERCICIOS_CONSULTAR,
        icon: <Shield size={18} aria-hidden />,
      },
      {
        id: "resultados",
        label: "Verificación",
        path: "/resultados",
        permisosAny: [PERMISOS.EJERCICIOS_CONSULTAR, PERMISOS.VERIFICACIONES_REGISTRAR],
        icon: <ClipboardCheck size={18} aria-hidden />,
      },
    ],
  },
];
