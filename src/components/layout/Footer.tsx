import React from "react";
import { APP_NAME, INSTITUCION } from "../../constants/marca.constants";

export const Footer: React.FC = () => (
  <footer className="px-4 lg:px-6 py-3 text-center text-[11px] text-slate-400 border-t border-slate-100">
    © {new Date().getFullYear()} {APP_NAME} · {INSTITUCION}. Apoyo a la gestión de información; no sustituye los
    protocolos institucionales.
  </footer>
);
