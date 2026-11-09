import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CheckCircle2, ChevronLeft, Clock3, LayoutGrid, Search, Users } from "lucide-react";
import { obtenerEjercicioEjemplo, etiquetaEscenario } from "../../data/ejemplo/ejercicios.ejemplo";
import { AvisoEjemplo } from "../../components/consulta/AvisoEjemplo";
import { BadgeSoloConsulta } from "../../components/consulta/BadgeSoloConsulta";
import { BannerSoloConsulta } from "../../components/consulta/BannerSoloConsulta";
import { Cargando } from "../../components/consulta/Cargando";
import { ConsultaShell } from "../../components/consulta/ConsultaShell";
import { EstadoVacio } from "../../components/consulta/EstadoVacio";
import { GraficoBarrasGrupos } from "../../components/consulta/GraficoBarrasGrupos";
import { KpiCard } from "../../components/consulta/KpiCard";
import { PageHeader } from "../../components/consulta/PageHeader";
import { TablaGrupos } from "../../components/consulta/TablaGrupos";
import { formatearFechaLarga, listarEnEspanol } from "../../utils/formato";

export const DetalleEjercicioPage: React.FC = () => {
  const { id = "" } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const grupoResaltado = searchParams.get("grupo") ?? undefined;

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 250);
    return () => window.clearTimeout(t);
  }, [id]);

  const ejercicio = useMemo(() => obtenerEjercicioEjemplo(id), [id]);

  if (loading) {
    return (
      <ConsultaShell>
        <Cargando etiqueta="Cargando el detalle del ejercicio" />
      </ConsultaShell>
    );
  }

  if (!ejercicio) {
    return (
      <ConsultaShell>
        <EstadoVacio
          icon={<Search size={24} aria-hidden />}
          title="No encontramos este ejercicio"
          description="El identificador no coincide con los ejercicios de ejemplo disponibles."
          action={
            <button
              type="button"
              onClick={() => navigate("/ejercicios")}
              className="inline-flex items-center justify-center min-w-40 px-4 py-2.5 rounded-full bg-slate-100 text-brand font-medium text-sm hover:bg-slate-200 transition"
            >
              Volver al historial
            </button>
          }
        />
      </ConsultaShell>
    );
  }

  const porcentajePendiente = 100 - ejercicio.porcentajeVerificado;

  return (
    <ConsultaShell>
      <Link
        to="/ejercicios"
        className="inline-flex items-center gap-1 text-sm text-brand mb-3 hover:underline"
      >
        <ChevronLeft size={16} aria-hidden />
        Historial de ejercicios
      </Link>

      <PageHeader
        title="Detalle del ejercicio"
        description={`${ejercicio.id} · ${formatearFechaLarga(ejercicio.fecha)}`}
        actions={
          <div className="flex flex-col items-end gap-1">
            <BadgeSoloConsulta />
            <span className="text-[12px] text-slate-400">Datos de ejemplo</span>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 mb-5">
        <KpiCard
          label="Total de estudiantes"
          value={ejercicio.totalEstudiantes}
          hint="Registros en el ejercicio"
          icon={<Users size={18} />}
        />
        <KpiCard
          label="Verificados"
          value={ejercicio.verificados}
          hint={`${ejercicio.porcentajeVerificado} % del total`}
          icon={<CheckCircle2 size={18} />}
        />
        <KpiCard
          label="Pendientes de revisión"
          value={ejercicio.pendientesRevision}
          hint={`${porcentajePendiente} % del total`}
          icon={<Clock3 size={18} />}
        />
        <KpiCard
          label="Grupos participantes"
          value={ejercicio.grupos.length}
          hint="En este ejercicio"
          icon={<LayoutGrid size={18} />}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[18rem_1fr] mb-5">
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-brand-dark mb-4">Información del ejercicio</h2>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-[12px] text-slate-400">Tipo de escenario</dt>
              <dd className="font-semibold text-brand-dark">{etiquetaEscenario(ejercicio.tipoEscenario)}</dd>
            </div>
            <div>
              <dt className="text-[12px] text-slate-400">Fecha del ejercicio</dt>
              <dd className="font-semibold text-brand-dark">{formatearFechaLarga(ejercicio.fecha)}</dd>
            </div>
            <div>
              <dt className="text-[12px] text-slate-400">Responsable</dt>
              <dd className="font-semibold text-brand-dark">{ejercicio.responsable}</dd>
            </div>
            <div>
              <dt className="text-[12px] text-slate-400">Grupos participantes</dt>
              <dd className="font-semibold text-brand-dark">{listarEnEspanol(ejercicio.grupos.map((g) => g.nombre))}</dd>
            </div>
          </dl>
        </aside>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3">
            <h2 className="text-base font-semibold text-brand-dark">Estado de verificación por grupo</h2>
            <p className="text-[12px] text-slate-400">Resultados registrados. Pendiente de revisión no equivale a ausente.</p>
          </div>
          <TablaGrupos grupos={ejercicio.grupos} grupoResaltado={grupoResaltado} variante="detalle" />
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm mb-5">
        <GraficoBarrasGrupos grupos={ejercicio.grupos} />
        <p className="mt-4 text-[12px] text-slate-400">
          {ejercicio.verificados} verificados de {ejercicio.totalEstudiantes} estudiantes ({ejercicio.porcentajeVerificado} %).
          Este resumen es informativo y no sustituye la evaluación institucional.
        </p>
      </section>

      <div className="space-y-3">
        <BannerSoloConsulta>
          Este ejercicio se muestra en modo de solo lectura. La información registrada no se puede modificar desde esta
          vista.
        </BannerSoloConsulta>
        <AvisoEjemplo />
      </div>
    </ConsultaShell>
  );
};
