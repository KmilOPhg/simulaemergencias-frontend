import React from "react";
import { Link } from "react-router-dom";
import { Boxes } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { PERMISOS } from "../constants/permisos.constants";

export const Home: React.FC = () => {
  const { user, tienePermiso } = useAuth();

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-1">Hola, {user?.nombre} 👋</h1>
      <p className="text-sm text-gray-500 mb-8">Este es el módulo de ejemplo generado por create-app-fullstack.</p>

      {tienePermiso(PERMISOS.RECURSOS_CONSULTAR) && (
        <Link
          to="/recursos"
          className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-5 max-w-sm shadow-sm hover:shadow-md hover:border-blue-300 transition"
        >
          <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Boxes size={22} />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-[14px]">Recursos</p>
            <p className="text-[12px] text-gray-500">Módulo de ejemplo (CRUD)</p>
          </div>
        </Link>
      )}
    </div>
  );
};
