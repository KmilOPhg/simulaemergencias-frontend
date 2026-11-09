import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock3 } from "lucide-react";
import {
  consolidarEjercicioEjemplo,
  etiquetaEscenario,
  listarEjerciciosEjemplo,
} from "../../data/ejemplo/ejercicios.ejemplo";
import { AvisoEjemplo } from "../../components/consulta/AvisoEjemplo";
import { BannerSoloConsulta } from "../../components/consulta/BannerSoloConsulta";
import { Cargando } from "../../components/consulta/Cargando";
import { ConsultaShell } from "../../components/consulta/ConsultaShell";
import { EstadoVacio } from "../../components/consulta/EstadoVacio";
import { PageHeader } from "../../components/consulta/PageHeader";
import { TablaGrupos } from "../../components/consulta/TablaGrupos";
import { formatearFechaCorta } from "../../utils/formato";

const selectClass =
  "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-brand";

export const ResultadosPage: React.FC = () => {
  const navigate = useNavigate();
  const ejercicios = useMemo(() => listarEjerciciosEjemplo(), []);
  const [loading, setLoading] = useState(true);
  const [ejercicioId, setEjercicioId] = useState(ejercicios[0]?.id ?? "");
  const [grupoId, setGrupoId] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 250);
    return () => window.clearTimeout(t);
  }, []);

  const ejercicioCompleto = useMemo(
    () => (ejercicioId ? consolidarEjercicioEjemplo(ejercicioId) : undefined),
    [ejercicioId]
  );
  const consolidado = useMemo(
    () => (ejercicioId ? consolidarEjercicioEjemplo(ejercicioId, grupoId || undefined) : undefined),
    [ejercicioId, grupoId]
  );

  const irADetalle = () => {
    if (!ejercicioId) return;
    const query = grupoId ? `?grupo=${encodeURIComponent(grupoId)}` : "";
    navigate(`/ejercicios/${ejercicioId}${query}`);
  };

  return (
    <ConsultaShell>
      <PageHeader
        kicker="Resumen institucional"
        title="Resultados de verificación"
        description="Consulta el avance consolidado de cada grupo para el ejercicio seleccionado."
        actions={<span className="text-[12px] text-slate-400">Datos de ejemplo</span>}
      />

      {loading ? (
        <Cargando etiqueta="Cargando el consolidado" />
      ) : ejercicios.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <EstadoVacio
            icon={<Clock3 size={24} aria-hidden />}
            title="No hay ejercicios anteriores"
            description="Los resultados aparecerán aquí cuando se registren ejercicios y verificaciones."
          />
        </section>
      ) : (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white px-4 py-4 sm:px-5 mb-4 shadow-sm">
            <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_auto] lg:items-end">
              <div>
                <label htmlFor="filtro-ejercicio" className="block text-[12px] text-slate-500">
                  Ejercicio
                </label>
                <select
                  id="filtro-ejercicio"
                  className={selectClass}
                  value={ejercicioId}
                  onChange={(e) => {
                    setEjercicioId(e.target.value);
                    setGrupoId("");
                  }}
                >
                  {ejercicios.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nombre} · {formatearFechaCorta(item.fecha)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="filtro-grupo" className="block text-[12px] text-slate-500">
                  Grupo
                </label>
                <select
                  id="filtro-grupo"
                  className={selectClass}
                  value={grupoId}
                  onChange={(e) => setGrupoId(e.target.value)}
                >
                  <option value="">Todos los grupos</option>
                  {ejercicioCompleto?.grupos.map((grupo) => (
                    <option key={grupo.grupoId} value={grupo.grupoId}>
                      {grupo.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={irADetalle}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-brand hover:bg-brand-soft transition"
              >
                {grupoId ? "Ver detalle del grupo" : "Ver detalle del ejercicio"}
                <ArrowRight size={16} aria-hidden />
              </button>
            </div>
          </section>

          {consolidado ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm mb-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <p className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">Consolidado</p>
                  <h2 className="text-lg font-semibold text-brand-dark">
                    {grupoId
                      ? consolidado.grupos[0]?.nombre
                      : "Todos los grupos"}
                  </h2>
                  <p className="text-[12px] text-slate-400">
                    {etiquetaEscenario(consolidado.tipoEscenario)} · {consolidado.id} · {formatearFechaCorta(consolidado.fecha)}
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[12px] text-slate-500">
                  {consolidado.grupos.length} {consolidado.grupos.length === 1 ? "grupo" : "grupos"}
                </span>
              </div>

              <TablaGrupos
                grupos={consolidado.grupos}
                grupoResaltado={grupoId || undefined}
                variante="consolidado"
              />

              {consolidado.pendientesRevision > 0 && (
                <p className="mt-4 flex items-start gap-2 text-sm text-pending">
                  <Clock3 size={16} className="mt-0.5 shrink-0" aria-hidden />
                  Los registros pendientes de revisión no se clasifican como ausentes. Requieren revisión antes de
                  interpretar el cierre del ejercicio.
                </p>
              )}
            </section>
          ) : (
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm mb-4">
              <EstadoVacio
                icon={<Clock3 size={24} aria-hidden />}
                title="Sin resultados"
                description="No encontramos coincidencias. Prueba con otros parámetros o cambia los filtros."
                action={
                  <button
                    type="button"
                    onClick={() => setGrupoId("")}
                    className="inline-flex items-center justify-center min-w-40 px-4 py-2.5 rounded-full bg-slate-100 text-brand font-medium text-sm hover:bg-slate-200 transition"
                  >
                    Cambiar búsqueda
                  </button>
                }
              />
            </section>
          )}

          <div className="space-y-3">
            <BannerSoloConsulta />
            <AvisoEjemplo />
          </div>
        </>
      )}
    </ConsultaShell>
  );
};
