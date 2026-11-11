import React from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

export const SinAcceso: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <Lock className="text-slate-500" size={28} aria-hidden />
      </div>
      <h2 className="text-lg font-bold text-slate-900 mb-1">Acceso restringido</h2>
      <p className="text-sm text-slate-500 max-w-sm mb-6">No tienes acceso a esta sección.</p>
      <button
        type="button"
        onClick={() => navigate("/home")}
        className="inline-flex items-center justify-center min-w-40 px-4 py-2.5 rounded-full bg-slate-100 text-brand font-medium text-sm hover:bg-slate-200 transition"
      >
        Volver
      </button>
    </div>
  );
};
