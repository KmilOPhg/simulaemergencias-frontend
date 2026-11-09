import React from "react";
import { CircleAlert } from "lucide-react";

type CampoErrorProps = {
  id: string;
  mensaje: string;
  detalle?: string;
};

export const CampoError: React.FC<CampoErrorProps> = ({ id, mensaje, detalle }) => (
  <div id={id} className="mt-1.5 flex items-start gap-1.5 text-red-600" role="alert">
    <CircleAlert size={14} className="mt-0.5 shrink-0" aria-hidden />
    <div>
      <p className="text-[13px] font-semibold">{mensaje}</p>
      {detalle && <p className="text-[12px] text-red-500">{detalle}</p>}
    </div>
  </div>
);
