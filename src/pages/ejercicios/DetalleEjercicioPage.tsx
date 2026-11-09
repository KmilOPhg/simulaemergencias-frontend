import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Search } from "lucide-react";
import { ConsultaShell } from "../../components/consulta/ConsultaShell";
import { PageHeader } from "../../components/consulta/PageHeader";
import { Cargando } from "../../components/consulta/Cargando";
import { EstadoVacio } from "../../components/consulta/EstadoVacio";
import { EstadoError } from "../../components/consulta/EstadoError";
import { BannerSoloConsulta } from "../../components/consulta/BannerSoloConsulta";
import { EjerciciosService } from "../../services/ejercicios.service";
import { extractErrorMessage } from "../../utils/extractErrorMessage";
import { formatearFechaLarga } from "../../utils/formato";
import { etiquetaEscenario } from "../../constants/escenarios.constants";
import { useAuth } from "../../hooks/useAuth";
import { PERMISOS } from "../../constants/permisos.constants";
import type { Ejercicio } from "../../types/ejercicio.types";

export const DetalleEjercicioPage: React.FC = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { tienePermiso } = useAuth();
  const puedeVerificar = tienePermiso(PERMISOS.VERIFICACIONES_REGISTRAR);
  const [ejercicio, setEjercicio] = useState<Ejercicio | null>(null);
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
        let encontrado: Ejercicio | null = null;
        let pagina = 1;
        let totalPaginas = 1;
        do {
          const resultado = await EjerciciosService.listar(pagina, 100);
          encontrado = resultado.datos.find((item) => item.id === ejercicioId) ?? null;
          totalPaginas = resultado.totalPaginas;
          pagina += 1;
        } while (!encontrado && pagina <= totalPaginas);
        setEjercicio(encontrado);
        setNoEncontrado(!encontrado);
      } catch (err) {
        setError(extractErrorMessage(err, "No se pudo cargar el detalle del ejercicio."));
      } finally {
        setLoading(false);
      }
    };
    void cargar();
  }, [id]);

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

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm mb-4 max-w-2xl">
        <h2 className="text-base font-semibold text-brand-dark mb-4">Información del ejercicio</h2>
        <dl className="space-y-4 text-sm">
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
            <div>
              <dt className="text-[12px] text-slate-400">Descripción</dt>
              <dd className="text-slate-700">{ejercicio.descripcion}</dd>
            </div>
          )}
        </dl>
      </section>

      <BannerSoloConsulta>
        Esta vista consulta la información del ejercicio. El registro de verificación se hace por grupo y código único.
      </BannerSoloConsulta>
    </ConsultaShell>
  );
};
