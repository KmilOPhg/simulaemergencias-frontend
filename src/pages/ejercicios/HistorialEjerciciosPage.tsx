import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, History, Search, SlidersHorizontal } from "lucide-react";
import { TIPOS_ESCENARIO } from "../../constants/escenarios.constants";
import {
  fechasDisponiblesEjemplo,
  etiquetaEscenario,
  listarEjerciciosEjemplo,
  textoGruposParticipantes,
  type FiltrosHistorial,
} from "../../data/ejemplo/ejercicios.ejemplo";
import { AvisoEjemplo } from "../../components/consulta/AvisoEjemplo";
import { Cargando } from "../../components/consulta/Cargando";
import { ConsultaShell } from "../../components/consulta/ConsultaShell";
import { EstadoVacio } from "../../components/consulta/EstadoVacio";
import { PageHeader } from "../../components/consulta/PageHeader";
import { formatearFechaCorta } from "../../utils/formato";

const selectClass =
  "mt-1 w-full rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand focus:bg-white";

export const HistorialEjerciciosPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [fecha, setFecha] = useState("");
  const [tipoEscenario, setTipoEscenario] = useState<FiltrosHistorial["tipoEscenario"]>("");

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 250);
    return () => window.clearTimeout(t);
  }, []);

  const fechas = useMemo(() => fechasDisponiblesEjemplo(), []);
  const ejercicios = useMemo(
    () => listarEjerciciosEjemplo({ fecha, tipoEscenario }),
    [fecha, tipoEscenario]
  );
  const hayFiltros = Boolean(fecha || tipoEscenario);

  const limpiarFiltros = () => {
    setFecha("");
    setTipoEscenario("");
  };

  return (
    <ConsultaShell>
      <PageHeader
        title="Historial de ejercicios"
        description="Consulta los ejercicios anteriores y sus resultados de verificación."
        actions={<span className="text-[12px] text-slate-400">Datos de ejemplo</span>}
      />

      <section className="rounded-2xl border border-slate-200 bg-white px-4 py-4 sm:px-5 mb-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[auto_1fr_1fr_auto] lg:items-end">
          <div className="flex items-center gap-2 text-sm font-semibold text-brand-dark pb-1">
            <SlidersHorizontal size={16} aria-hidden />
            Filtrar historial
          </div>
          <div>
            <label htmlFor="filtro-fecha" className="block text-[12px] text-slate-500">
              Fecha del ejercicio
            </label>
            <div className="relative">
              <CalendarDays size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
              <select
                id="filtro-fecha"
                className={`${selectClass} pl-8`}
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              >
                <option value="">Todas las fechas</option>
                {fechas.map((valor) => (
                  <option key={valor} value={valor}>
                    {formatearFechaCorta(valor)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="filtro-escenario" className="block text-[12px] text-slate-500">
              Tipo de escenario
            </label>
            <select
              id="filtro-escenario"
              className={selectClass}
              value={tipoEscenario}
              onChange={(e) => setTipoEscenario(e.target.value as FiltrosHistorial["tipoEscenario"])}
            >
              <option value="">Todos los escenarios</option>
              {TIPOS_ESCENARIO.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {etiquetaEscenario(tipo)}
                </option>
              ))}
            </select>
          </div>
          <p className="text-[12px] text-slate-400 lg:text-right pb-2">Consulta por fecha o escenario.</p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-brand-dark">Ejercicios anteriores</h2>
            <span className="inline-flex min-w-6 h-6 items-center justify-center rounded-full bg-slate-100 text-[12px] font-medium text-slate-500">
              {loading ? "…" : ejercicios.length}
            </span>
          </div>
          <p className="text-[12px] text-slate-400">Más recientes primero</p>
        </div>

        {loading ? (
          <Cargando etiqueta="Cargando el historial" />
        ) : ejercicios.length === 0 ? (
          <EstadoVacio
            icon={hayFiltros ? <Search size={24} aria-hidden /> : <History size={24} aria-hidden />}
            title={hayFiltros ? "Sin resultados" : "No hay ejercicios anteriores"}
            description={
              hayFiltros
                ? "No encontramos coincidencias. Prueba con otras palabras o cambia los filtros."
                : "Los ejercicios aparecerán aquí cuando se registren. Podrás consultar su información y los resultados de verificación."
            }
            action={
              hayFiltros ? (
                <button
                  type="button"
                  onClick={limpiarFiltros}
                  className="inline-flex items-center justify-center min-w-40 px-4 py-2.5 rounded-full bg-slate-100 text-brand font-medium text-sm hover:bg-slate-200 transition"
                >
                  Cambiar búsqueda
                </button>
              ) : undefined
            }
          />
        ) : (
          <>
          <ul className="md:hidden divide-y divide-slate-100">
            {ejercicios.map((ejercicio) => (
              <li key={ejercicio.id} className="px-4 py-4">
                <p className="font-semibold text-brand-dark">{formatearFechaCorta(ejercicio.fecha)}</p>
                <p className="text-[12px] text-slate-400 mb-2">{ejercicio.id}</p>
                <p className="text-sm text-slate-700">{etiquetaEscenario(ejercicio.tipoEscenario)}</p>
                <p className="text-sm text-slate-500">{textoGruposParticipantes(ejercicio)}</p>
                <p className="text-sm text-slate-600 mt-1">
                  <span className="font-semibold text-brand-dark tabular-nums">{ejercicio.verificados}</span> verificados
                </p>
                <Link
                  to={`/ejercicios/${ejercicio.id}`}
                  className="mt-3 inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-[13px] font-medium text-brand hover:bg-brand-soft transition"
                >
                  Ver detalle
                </Link>
              </li>
            ))}
          </ul>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[44rem] text-left">
              <caption className="sr-only">Listado de ejercicios anteriores</caption>
              <thead>
                <tr className="text-[12px] font-medium text-slate-400 border-b border-slate-100">
                  <th scope="col" className="px-4 sm:px-5 py-3 font-medium">
                    Fecha
                  </th>
                  <th scope="col" className="px-3 py-3 font-medium">
                    Tipo de escenario
                  </th>
                  <th scope="col" className="px-3 py-3 font-medium">
                    Grupos participantes
                  </th>
                  <th scope="col" className="px-3 py-3 font-medium">
                    Total de verificados
                  </th>
                  <th scope="col" className="px-4 sm:px-5 py-3 font-medium text-right">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {ejercicios.map((ejercicio) => (
                  <tr key={ejercicio.id} className="border-b border-slate-100 text-sm">
                    <th scope="row" className="px-4 sm:px-5 py-4 font-semibold text-brand-dark">
                      {formatearFechaCorta(ejercicio.fecha)}
                      <span className="block text-[12px] font-normal text-slate-400">{ejercicio.id}</span>
                    </th>
                    <td className="px-3 py-4 text-slate-700">{etiquetaEscenario(ejercicio.tipoEscenario)}</td>
                    <td className="px-3 py-4 text-slate-600">{textoGruposParticipantes(ejercicio)}</td>
                    <td className="px-3 py-4 font-semibold text-brand-dark tabular-nums">{ejercicio.verificados}</td>
                    <td className="px-4 sm:px-5 py-4 text-right">
                      <Link
                        to={`/ejercicios/${ejercicio.id}`}
                        className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-[13px] font-medium text-brand hover:bg-brand-soft transition"
                      >
                        Ver detalle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}

        <div className="flex items-center justify-between px-4 sm:px-5 py-3 text-[12px] text-slate-400">
          <span>
            {loading
              ? "Cargando…"
              : hayFiltros
                ? `Mostrando ${ejercicios.length} ${ejercicios.length === 1 ? "ejercicio" : "ejercicios"}`
                : `Mostrando ${ejercicios.length} de ${listarEjerciciosEjemplo().length} ejercicios`}
          </span>
          {!loading && ejercicios.length > 0 && <span>Todos los registros visibles</span>}
        </div>
      </section>

      <div className="mt-4">
        <AvisoEjemplo />
      </div>
    </ConsultaShell>
  );
};
