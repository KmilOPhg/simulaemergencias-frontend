import React from "react";

type BarraProgresoProps = {
  porcentaje: number;
  etiqueta?: string;
  tono?: "brand" | "verified";
};

export const BarraProgreso: React.FC<BarraProgresoProps> = ({ porcentaje, etiqueta, tono = "brand" }) => {
  const valor = Math.min(100, Math.max(0, porcentaje));
  const color = tono === "verified" ? "bg-verified" : "bg-brand-dark";

  return (
    <div className="min-w-[8rem]">
      <div
        className="h-2 w-full rounded-full bg-slate-200 overflow-hidden"
        role="progressbar"
        aria-valuenow={valor}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={etiqueta ?? `${valor} por ciento verificado`}
      >
        <div className={`h-full rounded-full ${color}`} style={{ width: `${valor}%` }} />
      </div>
      {etiqueta && <p className="mt-1 text-[11px] text-slate-500">{etiqueta}</p>}
    </div>
  );
};
