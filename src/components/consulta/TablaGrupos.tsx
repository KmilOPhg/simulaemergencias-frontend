import React from "react";
import { CheckCircle2, Clock3, Users } from "lucide-react";
import type { ResultadoGrupoEjemplo } from "../../types/ejercicio.types";
import { porcentajeEntero } from "../../utils/formato";
import { BarraProgreso } from "./BarraProgreso";

type TablaGruposProps = {
  grupos: ResultadoGrupoEjemplo[];
  grupoResaltado?: string;
  mostrarTotales?: boolean;
  variante?: "detalle" | "consolidado";
};

export const TablaGrupos: React.FC<TablaGruposProps> = ({
  grupos,
  grupoResaltado,
  mostrarTotales = true,
  variante = "detalle",
}) => {
  const totalEstudiantes = grupos.reduce((acc, item) => acc + item.totalEstudiantes, 0);
  const totalVerificados = grupos.reduce((acc, item) => acc + item.verificados, 0);
  const totalPendientes = grupos.reduce((acc, item) => acc + item.pendientesRevision, 0);
  const porcentajeTotal = porcentajeEntero(totalVerificados, totalEstudiantes);

  return (
    <div>
      <ul className="md:hidden space-y-3">
        {grupos.map((grupo) => {
          const porcentaje = porcentajeEntero(grupo.verificados, grupo.totalEstudiantes);
          return (
            <li
              key={grupo.grupoId}
              className={`rounded-xl border border-slate-100 p-3 ${grupoResaltado === grupo.grupoId ? "bg-brand-soft/60" : "bg-slate-50"}`}
            >
              <p className="font-semibold text-brand-dark">{grupo.nombre}</p>
              <p className="text-[12px] text-slate-400 mb-2">{grupo.totalEstudiantes} estudiantes</p>
              <dl className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <dt className="text-[11px] text-slate-400">Verificados</dt>
                  <dd className="font-semibold text-verified tabular-nums">{grupo.verificados}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-slate-400">Pendientes de revisión</dt>
                  <dd className="font-semibold text-pending tabular-nums">{grupo.pendientesRevision}</dd>
                </div>
              </dl>
              <BarraProgreso
                porcentaje={porcentaje}
                etiqueta={`${porcentaje} % verificado`}
                tono={porcentaje === 100 ? "verified" : "brand"}
              />
            </li>
          );
        })}
        {mostrarTotales && (
          <li className="rounded-xl border border-slate-200 p-3">
            <p className="font-semibold text-brand-dark mb-2">Totales</p>
            <dl className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <dt className="text-[11px] text-slate-400">Verificados</dt>
                <dd className="font-semibold text-verified tabular-nums">{totalVerificados}</dd>
              </div>
              <div>
                <dt className="text-[11px] text-slate-400">Pendientes de revisión</dt>
                <dd className="font-semibold text-pending tabular-nums">{totalPendientes}</dd>
              </div>
            </dl>
            <BarraProgreso porcentaje={porcentajeTotal} etiqueta={`${porcentajeTotal} % verificado`} tono="verified" />
          </li>
        )}
      </ul>

      <div className="hidden md:block overflow-x-auto">
      <table className="w-full min-w-[36rem] text-left">
        <caption className="sr-only">Estado de verificación por grupo</caption>
        <thead>
          <tr className="text-[12px] font-medium text-slate-400 border-b border-slate-100">
            <th scope="col" className="py-3 pr-3 font-medium">
              Grupo
            </th>
            {variante === "consolidado" && (
              <th scope="col" className="py-3 px-3 font-medium">
                Total de estudiantes
              </th>
            )}
            <th scope="col" className="py-3 px-3 font-medium">
              Verificados
            </th>
            <th scope="col" className="py-3 px-3 font-medium">
              {variante === "consolidado" ? "Pendientes de revisión" : "Pendientes"}
            </th>
            <th scope="col" className="py-3 pl-3 font-medium">
              {variante === "consolidado" ? "Porcentaje verificado" : "Verificación"}
            </th>
          </tr>
        </thead>
        <tbody>
          {grupos.map((grupo) => {
            const porcentaje = porcentajeEntero(grupo.verificados, grupo.totalEstudiantes);
            const resaltado = grupoResaltado === grupo.grupoId;

            return (
              <tr
                key={grupo.grupoId}
                className={`border-b border-slate-100 text-sm ${resaltado ? "bg-brand-soft/60" : ""}`}
              >
                <th scope="row" className="py-4 pr-3 font-semibold text-brand-dark">
                  <span className="inline-flex items-center gap-2">
                    <span className="hidden sm:inline-flex w-8 h-8 rounded-full bg-brand-soft text-brand items-center justify-center">
                      <Users size={14} aria-hidden />
                    </span>
                    <span>
                      {grupo.nombre}
                      {variante === "detalle" && (
                        <span className="block text-[12px] font-normal text-slate-400">
                          {grupo.totalEstudiantes} estudiantes
                        </span>
                      )}
                    </span>
                  </span>
                </th>
                {variante === "consolidado" && (
                  <td className="py-4 px-3 text-slate-700 tabular-nums">{grupo.totalEstudiantes}</td>
                )}
                <td className="py-4 px-3">
                  <span className="inline-flex items-center gap-1.5 text-verified font-semibold tabular-nums">
                    <CheckCircle2 size={14} aria-hidden />
                    {grupo.verificados}
                    <span className="sr-only"> verificados</span>
                  </span>
                </td>
                <td className="py-4 px-3">
                  <span className="inline-flex items-center gap-1.5 text-pending font-semibold tabular-nums">
                    <Clock3 size={14} aria-hidden />
                    {grupo.pendientesRevision}
                    <span className="sr-only"> pendientes de revisión</span>
                  </span>
                </td>
                <td className="py-4 pl-3">
                  <BarraProgreso
                    porcentaje={porcentaje}
                    etiqueta={`${porcentaje} % verificado`}
                    tono={porcentaje === 100 ? "verified" : "brand"}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
        {mostrarTotales && (
          <tfoot>
            <tr className="text-sm font-semibold">
              <th scope="row" className="py-4 pr-3 text-brand-dark">
                Totales
              </th>
              {variante === "consolidado" && (
                <td className="py-4 px-3 text-brand-dark tabular-nums">{totalEstudiantes}</td>
              )}
              <td className="py-4 px-3 text-verified tabular-nums">{totalVerificados}</td>
              <td className="py-4 px-3 text-pending tabular-nums">{totalPendientes}</td>
              <td className="py-4 pl-3">
                <BarraProgreso
                  porcentaje={porcentajeTotal}
                  etiqueta={`${porcentajeTotal} % verificado`}
                  tono="verified"
                />
              </td>
            </tr>
          </tfoot>
        )}
      </table>
      </div>
    </div>
  );
};
