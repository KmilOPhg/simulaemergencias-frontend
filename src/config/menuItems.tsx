import React from "react";
import { BarChart3, Home, Shield, Users } from "lucide-react";

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
        icon: <Users size={18} aria-hidden />,
      },
      {
        id: "ejercicios",
        label: "Ejercicios",
        path: "/ejercicios",
        icon: <Shield size={18} aria-hidden />,
      },
      {
        id: "resultados",
        label: "Resultados",
        path: "/resultados",
        icon: <BarChart3 size={18} aria-hidden />,
      },
    ],
  },
];
