import React from "react";
import type { ResultadoGrupoEjemplo } from "../../types/ejercicio.types";

type GraficoBarrasGruposProps = {
  grupos: ResultadoGrupoEjemplo[];
};

export const GraficoBarrasGrupos: React.FC<GraficoBarrasGruposProps> = ({ grupos }) => {
  const maximo = Math.max(
    10,
    ...grupos.flatMap((grupo) => [grupo.verificados, grupo.pendientesRevision, grupo.totalEstudiantes])
  );
  const techo = Math.ceil(maximo / 10) * 10;
  const marcas = Array.from({ length: techo / 10 + 1 }, (_, i) => i * 10);

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-brand-dark">Estado de verificación por grupo</h2>
          <p className="text-[12px] text-slate-400">Número de estudiantes. Cada barra indica el valor exacto.</p>
        </div>
        <ul className="flex flex-wrap gap-4 text-[12px] text-slate-500">
          <li className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-brand" aria-hidden />
            Verificados
          </li>
          <li className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm barra-pendiente" aria-hidden />
            Pendientes de revisión
          </li>
        </ul>
      </div>

      <div className="space-y-5" role="img" aria-label="Gráfico de barras de verificados y pendientes por grupo">
        {grupos.map((grupo) => (
          <div key={grupo.grupoId} className="grid grid-cols-1 sm:grid-cols-[7rem_1fr] gap-2 sm:gap-3 sm:items-center">
            <div>
              <p className="text-sm font-semibold text-brand-dark">{grupo.nombre}</p>
              <p className="text-[11px] text-slate-400">{grupo.totalEstudiantes} estudiantes</p>
            </div>
            <div className="space-y-1.5">
              <BarraValor valor={grupo.verificados} maximo={techo} tono="verificado" />
              <BarraValor valor={grupo.pendientesRevision} maximo={techo} tono="pendiente" />
            </div>
          </div>
        ))}

        <div className="hidden sm:grid grid-cols-[7rem_1fr] gap-3">
          <div />
          <div className="relative h-6">
            {marcas.map((marca) => (
              <span
                key={marca}
                className="absolute top-0 text-[11px] text-slate-400 -translate-x-1/2"
                style={{ left: `${(marca / techo) * 100}%` }}
              >
                {marca}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const BarraValor: React.FC<{ valor: number; maximo: number; tono: "verificado" | "pendiente" }> = ({
  valor,
  maximo,
  tono,
}) => {
  const ancho = maximo <= 0 ? 0 : (valor / maximo) * 100;
  const clase = tono === "verificado" ? "bg-brand" : "barra-pendiente";
  const etiqueta = tono === "verificado" ? "verificados" : "pendientes de revisión";

  return (
    <div className="flex items-center gap-2">
      <div className="relative h-4 flex-1">
        <div className="absolute inset-0 rounded-sm bg-slate-100" />
        <div
          className={`absolute inset-y-0 left-0 rounded-sm ${clase}`}
          style={{ width: `${ancho}%` }}
        />
      </div>
      <span className="w-6 text-[12px] font-medium text-slate-600 tabular-nums">
        {valor}
        <span className="sr-only"> {etiqueta}</span>
      </span>
    </div>
  );
};
