import React from "react";
import { Unplug } from "lucide-react";

type EstadoErrorProps = {
  title?: string;
  description?: string;
  onReintentar?: () => void;
};

export const EstadoError: React.FC<EstadoErrorProps> = ({
  title = "Sin conexión",
  description = "No se pudo cargar la información. Inténtalo de nuevo.",
  onReintentar,
}) => (
  <div className="flex flex-col items-center justify-center text-center px-6 py-12">
    <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
      <Unplug size={26} aria-hidden />
    </div>
    <h2 className="text-base font-bold text-slate-900">{title}</h2>
    <p className="mt-1 text-sm text-slate-500 max-w-sm">{description}</p>
    {onReintentar && (
      <button
        type="button"
        onClick={onReintentar}
        className="mt-5 inline-flex items-center justify-center min-w-40 px-4 py-2.5 rounded-full bg-slate-100 text-brand font-medium text-sm hover:bg-slate-200 transition"
      >
        Reintentar
      </button>
    )}
  </div>
);
