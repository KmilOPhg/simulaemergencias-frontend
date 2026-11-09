import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { History, Plus } from "lucide-react";
import { ConsultaShell } from "../../components/consulta/ConsultaShell";
import { PageHeader } from "../../components/consulta/PageHeader";
import { Cargando } from "../../components/consulta/Cargando";
import { EstadoVacio } from "../../components/consulta/EstadoVacio";
import { EstadoError } from "../../components/consulta/EstadoError";
import { PaginacionSimple } from "../../components/PaginacionSimple";
import { EjerciciosService } from "../../services/ejercicios.service";
import { extractErrorMessage } from "../../utils/extractErrorMessage";
import { formatearFechaCorta } from "../../utils/formato";
import { etiquetaEscenario } from "../../constants/escenarios.constants";
import { useAuth } from "../../hooks/useAuth";
import { PERMISOS } from "../../constants/permisos.constants";
import type { Ejercicio } from "../../types/ejercicio.types";

const LIMITE = 20;

export const HistorialEjerciciosPage: React.FC = () => {
  const { tienePermiso } = useAuth();
  const puedeCrear = tienePermiso(PERMISOS.EJERCICIOS_CREAR);
  const puedeVerificar = tienePermiso(PERMISOS.VERIFICACIONES_REGISTRAR);
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargar = useCallback(async (paginaCargar: number) => {
    setLoading(true);
    setError("");
    try {
      const resultado = await EjerciciosService.listar(paginaCargar, LIMITE);
      setEjercicios(resultado.datos);
      setPagina(resultado.pagina);
      setTotalPaginas(resultado.totalPaginas);
      setTotal(resultado.total);
    } catch (err) {
      setError(extractErrorMessage(err, "No se pudieron cargar los ejercicios."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void cargar(1);
  }, [cargar]);

  return (
    <ConsultaShell>
      <PageHeader
        title="Historial de ejercicios"
        description="Consulta los ejercicios registrados y abre el detalle de cada uno."
        actions={
          puedeCrear ? (
            <Link
              to="/ejercicios/nuevo"
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              <Plus size={16} aria-hidden />
              Registrar ejercicio
            </Link>
          ) : undefined
        }
      />

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-brand-dark">Ejercicios registrados</h2>
            <span className="inline-flex min-w-6 h-6 items-center justify-center rounded-full bg-slate-100 text-[12px] font-medium text-slate-500">
              {loading ? "…" : total}
            </span>
          </div>
          <p className="text-[12px] text-slate-400">Más recientes primero</p>
        </div>

        {loading ? (
          <Cargando etiqueta="Cargando el historial" />
        ) : error ? (
          <EstadoError description={error} onReintentar={() => void cargar(pagina)} />
        ) : ejercicios.length === 0 ? (
          <EstadoVacio
            icon={<History size={24} aria-hidden />}
            title="No hay ejercicios anteriores"
            description="Los ejercicios aparecerán aquí cuando se registren. Podrás consultar su información y registrar verificaciones."
            action={
              puedeCrear ? (
                <Link
                  to="/ejercicios/nuevo"
                  className="inline-flex items-center justify-center min-w-40 px-4 py-2.5 rounded-full bg-slate-100 text-brand font-medium text-sm hover:bg-slate-200"
                >
                  Registrar ejercicio
                </Link>
              ) : undefined
            }
          />
        ) : (
          <>
            <ul className="md:hidden divide-y divide-slate-100">
              {ejercicios.map((ejercicio) => (
                <li key={ejercicio.id} className="px-4 py-4">
                  <p className="font-semibold text-brand-dark">{ejercicio.nombre}</p>
                  <p className="text-[12px] text-slate-400 mb-1">
                    {formatearFechaCorta(ejercicio.fecha)} · {etiquetaEscenario(ejercicio.tipoEscenario)}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link to={`/ejercicios/${ejercicio.id}`} className="text-sm font-medium text-brand">
                      Ver detalle
                    </Link>
                    {puedeVerificar && (
                      <Link to={`/resultados?ejercicioId=${ejercicio.id}`} className="text-sm font-medium text-brand">
                        Verificar
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[40rem] text-left">
                <caption className="sr-only">Listado de ejercicios registrados</caption>
                <thead>
                  <tr className="text-[12px] font-medium text-slate-400 border-b border-slate-100">
                    <th scope="col" className="px-5 py-3 font-medium">
                      Fecha
                    </th>
                    <th scope="col" className="px-3 py-3 font-medium">
                      Ejercicio
                    </th>
                    <th scope="col" className="px-3 py-3 font-medium">
                      Tipo de escenario
                    </th>
                    <th scope="col" className="px-3 py-3 font-medium">
                      Registrado por
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium text-right">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ejercicios.map((ejercicio) => (
                    <tr key={ejercicio.id} className="border-b border-slate-100 text-sm">
                      <th scope="row" className="px-5 py-4 font-semibold text-brand-dark">
                        {formatearFechaCorta(ejercicio.fecha)}
                        {ejercicio.horaInicio && (
                          <span className="block text-[12px] font-normal text-slate-400">{ejercicio.horaInicio}</span>
                        )}
                      </th>
                      <td className="px-3 py-4 text-slate-700">{ejercicio.nombre}</td>
                      <td className="px-3 py-4 text-slate-700">{etiquetaEscenario(ejercicio.tipoEscenario)}</td>
                      <td className="px-3 py-4 text-slate-600">{ejercicio.registradoPor.nombre}</td>
                      <td className="px-5 py-4 text-right space-x-2">
                        <Link
                          to={`/ejercicios/${ejercicio.id}`}
                          className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-[13px] font-medium text-brand hover:bg-brand-soft"
                        >
                          Ver detalle
                        </Link>
                        {puedeVerificar && (
                          <Link
                            to={`/resultados?ejercicioId=${ejercicio.id}`}
                            className="inline-flex items-center rounded-full bg-brand-soft px-3 py-1.5 text-[13px] font-medium text-brand hover:bg-brand-soft/80"
                          >
                            Verificar
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <PaginacionSimple
              pagina={pagina}
              totalPaginas={totalPaginas}
              total={total}
              onCambiarPagina={(siguiente) => void cargar(siguiente)}
            />
          </>
        )}
      </section>
    </ConsultaShell>
  );
};
