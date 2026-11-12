import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Search, Users } from "lucide-react";
import { ConsultaShell } from "../../components/consulta/ConsultaShell";
import { PageHeader } from "../../components/consulta/PageHeader";
import { Cargando } from "../../components/consulta/Cargando";
import { EstadoVacio } from "../../components/consulta/EstadoVacio";
import { EstadoError } from "../../components/consulta/EstadoError";
import { ConsolidadoGrupos, type ResumenGrupo } from "../../components/consulta/ConsolidadoGrupos";
import { EjerciciosService } from "../../services/ejercicios.service";
import { EstudiantesService } from "../../services/estudiantes.service";
import { VerificacionesService } from "../../services/verificaciones.service";
import { extractErrorMessage } from "../../utils/extractErrorMessage";
import { formatearFechaLarga } from "../../utils/formato";
import { etiquetaEscenario } from "../../constants/escenarios.constants";
import { useAuth } from "../../hooks/useAuth";
import { PERMISOS } from "../../constants/permisos.constants";
import type { EjercicioDetalle } from "../../types/ejercicio.types";

export const DetalleEjercicioPage: React.FC = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { tienePermiso } = useAuth();
  const puedeVerificar = tienePermiso(PERMISOS.VERIFICACIONES_REGISTRAR);
  const puedeConsultarVerificaciones = tienePermiso(PERMISOS.VERIFICACIONES_CONSULTAR);
  const [ejercicio, setEjercicio] = useState<EjercicioDetalle | null>(null);
  const [resumen, setResumen] = useState<ResumenGrupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [noEncontrado, setNoEncontrado] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      const ejercicioId = Number(id);
      if (!Number.isInteger(ejercicioId) || ejercicioId < 1) {
        setNoEncontrado(true);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      setNoEncontrado(false);
      try {
        const detalle = await EjerciciosService.obtener(ejercicioId);
        setEjercicio(detalle);

        const verificaciones = puedeConsultarVerificaciones
          ? await VerificacionesService.listarTodas(ejercicioId)
          : [];
        const idsVerificados = new Set(verificaciones.map((item) => item.estudiante.id));

        const gruposResumen: ResumenGrupo[] = [];
        for (const seleccion of detalle.grupos) {
          const listado = await EstudiantesService.listarPorGrupo(seleccion.grupo.id, 1, 100);
          gruposResumen.push({
            grupo: seleccion.grupo,
            total: listado.total,
            verificados: listado.datos.filter((estudiante) => idsVerificados.has(estudiante.id)).length,
          });
        }
        setResumen(gruposResumen);
      } catch (err) {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 404) {
          setNoEncontrado(true);
        } else {
          setError(extractErrorMessage(err, "No se pudo cargar el detalle del ejercicio."));
        }
      } finally {
        setLoading(false);
      }
    };
    void cargar();
  }, [id, puedeConsultarVerificaciones]);

  if (loading) {
    return (
      <ConsultaShell>
        <Cargando etiqueta="Cargando el detalle del ejercicio" />
      </ConsultaShell>
    );
  }

  if (error) {
    return (
      <ConsultaShell>
        <EstadoError description={error} onReintentar={() => window.location.reload()} />
      </ConsultaShell>
    );
  }

  if (noEncontrado || !ejercicio) {
    return (
      <ConsultaShell>
        <EstadoVacio
          icon={<Search size={24} aria-hidden />}
          title="No encontramos este ejercicio"
          description="El identificador no coincide con los ejercicios registrados."
          action={
            <button
              type="button"
              onClick={() => navigate("/ejercicios")}
              className="inline-flex items-center justify-center min-w-40 px-4 py-2.5 rounded-full bg-slate-100 text-brand font-medium text-sm hover:bg-slate-200"
            >
              Volver al historial
            </button>
          }
        />
      </ConsultaShell>
    );
  }

  return (
    <ConsultaShell>
      <Link to="/ejercicios" className="inline-flex items-center gap-1 text-sm text-brand mb-3 hover:underline">
        <ChevronLeft size={16} aria-hidden />
        Historial de ejercicios
      </Link>
      <PageHeader
        title={ejercicio.nombre}
        description={`${etiquetaEscenario(ejercicio.tipoEscenario)} · ${formatearFechaLarga(ejercicio.fecha)}`}
        actions={
          puedeVerificar ? (
            <Link
              to={`/resultados?ejercicioId=${ejercicio.id}`}
              className="inline-flex items-center rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              Registrar verificaciones
            </Link>
          ) : undefined
        }
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm mb-4">
        <h2 className="text-base font-semibold text-brand-dark mb-4">Información del ejercicio</h2>
        <dl className="grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <dt className="text-[12px] text-slate-400">Tipo de escenario</dt>
            <dd className="font-semibold text-brand-dark">{etiquetaEscenario(ejercicio.tipoEscenario)}</dd>
          </div>
          <div>
            <dt className="text-[12px] text-slate-400">Fecha</dt>
            <dd className="font-semibold text-brand-dark">{formatearFechaLarga(ejercicio.fecha)}</dd>
          </div>
          {ejercicio.horaInicio && (
            <div>
              <dt className="text-[12px] text-slate-400">Hora de inicio</dt>
              <dd className="font-semibold text-brand-dark">{ejercicio.horaInicio}</dd>
            </div>
          )}
          {ejercicio.lugar && (
            <div>
              <dt className="text-[12px] text-slate-400">Lugar</dt>
              <dd className="font-semibold text-brand-dark">{ejercicio.lugar}</dd>
            </div>
          )}
          <div>
            <dt className="text-[12px] text-slate-400">Registrado por</dt>
            <dd className="font-semibold text-brand-dark">{ejercicio.registradoPor.nombre}</dd>
          </div>
          {ejercicio.descripcion && (
            <div className="sm:col-span-2">
              <dt className="text-[12px] text-slate-400">Descripción</dt>
              <dd className="text-slate-700">{ejercicio.descripcion}</dd>
            </div>
          )}
        </dl>
      </section>

      {ejercicio.grupos.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <EstadoVacio
            icon={<Users size={24} aria-hidden />}
            title="Todavía no hay un grupo seleccionado"
            description="Selecciona el grupo que estás verificando para asociar las verificaciones a este ejercicio."
            action={
              puedeVerificar ? (
                <Link
                  to={`/resultados?ejercicioId=${ejercicio.id}`}
                  className="inline-flex items-center justify-center min-w-40 px-4 py-2.5 rounded-full bg-slate-100 text-brand font-medium text-sm hover:bg-slate-200"
                >
                  Seleccionar grupo
                </Link>
              ) : undefined
            }
          />
        </section>
      ) : puedeConsultarVerificaciones ? (
        <ConsolidadoGrupos grupos={resumen} />
      ) : (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-brand-dark mb-3">Grupos seleccionados</h2>
          <ul className="space-y-2 text-sm">
            {ejercicio.grupos.map((seleccion) => (
              <li key={seleccion.id} className="text-slate-700">
                {seleccion.grupo.codigo} · {seleccion.grupo.nombre}
              </li>
            ))}
          </ul>
        </section>
      )}
    </ConsultaShell>
  );
};
