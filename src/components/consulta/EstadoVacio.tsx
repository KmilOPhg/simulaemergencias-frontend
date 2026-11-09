import React from "react";

type EstadoVacioProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export const EstadoVacio: React.FC<EstadoVacioProps> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center text-center px-6 py-12">
    <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h2 className="text-base font-bold text-slate-900">{title}</h2>
    <p className="mt-1 text-sm text-slate-500 max-w-sm">{description}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);
