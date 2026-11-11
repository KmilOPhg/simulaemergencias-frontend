import React from "react";
import { Lock } from "lucide-react";

export const BadgeSoloConsulta: React.FC = () => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] font-medium text-slate-600">
    <Lock size={12} aria-hidden />
    Solo consulta
  </span>
);
