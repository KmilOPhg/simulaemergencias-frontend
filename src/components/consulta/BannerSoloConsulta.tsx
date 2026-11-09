import React from "react";
import { Info } from "lucide-react";

export const BannerSoloConsulta: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div
    className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
    role="status"
  >
    <Info size={18} className="text-brand mt-0.5 shrink-0" aria-hidden />
    <p>
      {children ??
        "Puedes consultar este ejercicio. La información no se puede modificar desde esta vista."}
    </p>
  </div>
);
