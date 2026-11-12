import React from "react";
import { CheckCircle2, Clock3, Users } from "lucide-react";
import { BarraProgreso } from "./BarraProgreso";
import { KpiCard } from "./KpiCard";
import { porcentajeEntero } from "../../utils/formato";
import type { Grupo } from "../../types/grupo.types";

export type ResumenGrupo = {
  grupo: Grupo;
  total: number;
  verificados: number;
};

type ConsolidadoGruposProps = {
  grupos: ResumenGrupo[];
};

export const ConsolidadoGrupos: React.FC<ConsolidadoGruposProps> = ({ grupos }) => {
  const totalEstudiantes = grupos.reduce((acc, item) => acc + item.total, 0);
  const totalVerificados = grupos.reduce((acc, item) => acc + item.verificados, 0);
  const totalPendientes = Math.max(0, totalEstudiantes - totalVerificados);
  const porcentaje = porcentajeEntero(totalVerificados, totalEstudiantes);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <KpiCard label="Estudiantes" value={totalEstudiantes} icon={<Users size={18} />} />
        <KpiCard label="Verificados" value={totalVerificados} hint="Chequeo registrado" icon={<CheckCircle2 size={18} />} />
        <KpiCard
          label="Pendientes"
          value={totalPendientes}
          hint="Pendiente no equivale a ausente"
          icon={<Clock3 size={18} />}
        />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-brand-dark">Estado por grupo</h2>
          <BarraProgreso porcentaje={porcentaje} etiqueta={`${porcentaje} % verificado`} tono="verified" />
        </div>
        <ul className="divide-y divide-slate-100">
          {grupos.map((item) => {
            const pendientes = Math.max(0, item.total - item.verificados);
            const pct = porcentajeEntero(item.verificados, item.total);
            return (
              <li key={item.grupo.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-semibold text-brand-dark">
                    {item.grupo.codigo} · {item.grupo.nombre}
                  </p>
                  <p className="text-sm text-slate-500">
                    {item.verificados} verificados · {pendientes} pendientes · {item.total} estudiantes
                  </p>
                </div>
                <BarraProgreso porcentaje={pct} etiqueta={`${pct} %`} tono="verified" />
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};
