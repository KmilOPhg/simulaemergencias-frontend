import React from "react";
import { Shield } from "lucide-react";
import { APP_NAME, INSTITUCION } from "../../constants/marca.constants";

type MarcaLockupProps = {
  compact?: boolean;
  align?: "left" | "center";
};

export const MarcaLockup: React.FC<MarcaLockupProps> = ({ compact = false, align = "left" }) => (
  <div className={`flex items-center gap-2.5 min-w-0 ${align === "center" ? "flex-col text-center" : ""}`}>
    <div
      className={`rounded-xl bg-brand text-white flex items-center justify-center shrink-0 ${
        align === "center" ? "w-14 h-14" : "w-9 h-9"
      }`}
    >
      <Shield size={align === "center" ? 26 : 18} aria-hidden />
    </div>
    <div className={compact ? "hidden lg:block min-w-0" : "min-w-0"}>
      <p className={`font-semibold text-brand-dark truncate ${align === "center" ? "text-lg" : "text-sm"}`}>
        {APP_NAME}
      </p>
      <p className={`text-slate-500 truncate ${align === "center" ? "text-[13px]" : "text-[11px]"}`}>{INSTITUCION}</p>
    </div>
  </div>
);
