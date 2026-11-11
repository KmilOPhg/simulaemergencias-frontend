import React from "react";

export const Cargando: React.FC<{ etiqueta?: string }> = ({ etiqueta = "Cargando información" }) => (
  <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3" role="status" aria-live="polite">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand" />
    <p className="text-sm text-slate-500">{etiqueta}</p>
  </div>
);
