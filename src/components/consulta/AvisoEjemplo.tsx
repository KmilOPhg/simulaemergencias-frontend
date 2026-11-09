import React from "react";
import { CircleAlert } from "lucide-react";

export const AvisoEjemplo: React.FC = () => (
  <p className="flex items-start gap-2 text-[12px] text-slate-400">
    <CircleAlert size={14} className="mt-0.5 shrink-0" aria-hidden />
    Información de ejemplo para consulta. No representa registros de una institución real.
  </p>
);
