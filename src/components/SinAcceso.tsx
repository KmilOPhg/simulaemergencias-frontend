import React from "react";
import { ShieldAlert } from "lucide-react";

export const SinAcceso: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
      <ShieldAlert className="text-red-500" size={30} />
    </div>
    <h2 className="text-lg font-bold text-gray-900 mb-1">No tienes acceso a esta sección</h2>
    <p className="text-sm text-gray-500 max-w-sm">
      Tu usuario no cuenta con el permiso necesario. Si crees que esto es un error, contacta a un administrador.
    </p>
  </div>
);
