import React, { useCallback, useEffect, useState } from "react";
import { Search, Users } from "lucide-react";
import { ConsultaShell } from "../../components/consulta/ConsultaShell";
import { PageHeader } from "../../components/consulta/PageHeader";
import { Cargando } from "../../components/consulta/Cargando";
import { EstadoVacio } from "../../components/consulta/EstadoVacio";
import { EstadoError } from "../../components/consulta/EstadoError";
import { CampoError } from "../../components/consulta/CampoError";
import { PaginacionSimple } from "../../components/PaginacionSimple";
import { EstudiantesService } from "../../services/estudiantes.service";
import { GruposService } from "../../services/grupos.service";
import { extractErrorMessage } from "../../utils/extractErrorMessage";
import { nombreEstudiante } from "../../utils/estudiante.utils";
import type { Estudiante } from "../../types/estudiante.types";
import type { Grupo } from "../../types/grupo.types";

const LIMITE = 20;
const selectClass =
  "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-brand";

export const EstudiantesPage: React.FC = () => {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total, setTotal] = useState(0);
  const [grupoId, setGrupoId] = useState("");
  const [codigo, setCodigo] = useState("");
  const [codigoError, setCodigoError] = useState("");
  const [resultadoBusqueda, setResultadoBusqueda] = useState<Estudiante | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [busquedaActiva, setBusquedaActiva] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");

  const cargarListado = useCallback(async (paginaCargar: number, grupoSeleccionado: string) => {
    setLoading(true);
    setErrorCarga("");
    try {
      const grupoFiltro = grupoSeleccionado ? Number(grupoSeleccionado) : undefined;
      const resultado = await EstudiantesService.listar(paginaCargar, LIMITE, grupoFiltro);
      setEstudiantes(resultado.datos);
      setPagina(resultado.pagina);
      setTotalPaginas(resultado.totalPaginas);
      setTotal(resultado.total);
    } catch (err) {
      setErrorCarga(extractErrorMessage(err, "No se pudo cargar el listado de estudiantes."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const iniciar = async () => {
      try {
        const listaGrupos = await GruposService.listar();
        setGrupos(listaGrupos);
      } catch (err) {
        setErrorCarga(extractErrorMessage(err, "No se pudieron cargar los grupos."));
        setLoading(false);
        return;
      }
      await cargarListado(1, "");
    };
    void iniciar();
  }, [cargarListado]);

  const validarCodigo = (valor: string): string => {
    const limpio = valor.trim();
    if (!limpio) return "Completa este campo";
    if (!/^[A-Za-z0-9-]+$/.test(limpio)) return "Revisa el código";
    return "";
  };

  const buscarPorCodigo = async (event: React.FormEvent) => {
    event.preventDefault();
    const error = validarCodigo(codigo);
    setCodigoError(error);
    if (error) {
      if (error === "Revisa el código") {
        setCodigoError("Revisa el código");
      }
      return;
    }

    setBuscando(true);
    setErrorCarga("");
    try {
      const estudiante = await EstudiantesService.buscarPorCodigo(codigo.trim());
      setResultadoBusqueda(estudiante);
      setBusquedaActiva(true);
    } catch (err) {
      setResultadoBusqueda(null);
      setCodigoError("");
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 404) {
        setBusquedaActiva(true);
        setErrorCarga("");
      } else {
        setBusquedaActiva(false);
        setErrorCarga(extractErrorMessage(err, "No se pudo completar la búsqueda."));
      }
    } finally {
      setBuscando(false);
    }
  };

  const limpiarBusqueda = () => {
    setCodigo("");
    setCodigoError("");
    setResultadoBusqueda(null);
    setBusquedaActiva(false);
    void cargarListado(1, grupoId);
  };

  const cambiarGrupo = (valor: string) => {
    setGrupoId(valor);
    setBusquedaActiva(false);
    setResultadoBusqueda(null);
    void cargarListado(1, valor);
  };

  const filas = busquedaActiva && resultadoBusqueda ? [resultadoBusqueda] : estudiantes;
  const sinCoincidencias = busquedaActiva && !resultadoBusqueda && !errorCarga;
  const grupoSinEstudiantes = !busquedaActiva && !loading && total === 0 && Boolean(grupoId);

  return (
    <ConsultaShell>
      <PageHeader
        title="Estudiantes"
        description="Consulta el listado institucional y busca un participante por su código único."
      />

      <section className="rounded-2xl border border-slate-200 bg-white px-4 py-4 sm:px-5 mb-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label htmlFor="filtro-grupo" className="block text-[12px] text-slate-500">
              Grupo
            </label>
            <select id="filtro-grupo" className={selectClass} value={grupoId} onChange={(e) => cambiarGrupo(e.target.value)}>
              <option value="">Todos los grupos</option>
              {grupos.map((grupo) => (
                <option key={grupo.id} value={grupo.id}>
                  {grupo.codigo} · {grupo.nombre}
                </option>
              ))}
            </select>
          </div>
          <form onSubmit={buscarPorCodigo} noValidate>
            <label htmlFor="busqueda-codigo" className="block text-[12px] text-slate-500">
              Código único
            </label>
            <div className="mt-1 flex gap-2">
              <input
                id="busqueda-codigo"
                value={codigo}
                onChange={(e) => {
                  setCodigo(e.target.value);
                  if (codigoError) setCodigoError(validarCodigo(e.target.value));
                }}
                onBlur={() => {
                  if (codigo.trim()) setCodigoError(validarCodigo(codigo));
                }}
                placeholder="Ejemplo: AGP-1001"
                autoComplete="off"
                aria-invalid={Boolean(codigoError)}
                aria-describedby={codigoError ? "error-codigo" : undefined}
                className={`min-w-0 flex-1 rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-brand ${
                  codigoError ? "border-red-400" : "border-slate-200"
                }`}
              />
              <button
                type="submit"
                disabled={buscando}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:bg-slate-400"
              >
                <Search size={16} aria-hidden />
                {buscando ? "Buscando…" : "Buscar"}
              </button>
            </div>
            {codigoError === "Completa este campo" && (
              <CampoError
                id="error-codigo"
                mensaje="Completa este campo"
                detalle="Escribe el código del estudiante para continuar."
              />
            )}
            {codigoError === "Revisa el código" && (
              <CampoError
                id="error-codigo"
                mensaje="Revisa el código"
                detalle="El formato no es válido. Revisa el código e introdúcelo de nuevo."
              />
            )}
          </form>
        </div>
      </section>

      {errorCarga && !busquedaActiva ? (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <EstadoError description={errorCarga} onReintentar={() => void cargarListado(pagina, grupoId)} />
        </section>
      ) : loading ? (
        <Cargando etiqueta="Cargando estudiantes" />
      ) : sinCoincidencias ? (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <EstadoVacio
            icon={<Search size={24} aria-hidden />}
            title="Sin resultados"
            description="No encontramos coincidencias. Prueba con otras palabras o cambia los filtros."
            action={
              <button
                type="button"
                onClick={limpiarBusqueda}
                className="inline-flex items-center justify-center min-w-40 px-4 py-2.5 rounded-full bg-slate-100 text-brand font-medium text-sm hover:bg-slate-200"
              >
                Cambiar búsqueda
              </button>
            }
          />
        </section>
      ) : grupoSinEstudiantes ? (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <EstadoVacio
            icon={<Users size={24} aria-hidden />}
            title="El grupo no tiene estudiantes"
            description="No hay participantes asociados al grupo seleccionado."
            action={
              <button
                type="button"
                onClick={() => cambiarGrupo("")}
                className="inline-flex items-center justify-center min-w-40 px-4 py-2.5 rounded-full bg-slate-100 text-brand font-medium text-sm hover:bg-slate-200"
              >
                Ver todos los grupos
              </button>
            }
          />
        </section>
      ) : filas.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <EstadoVacio
            icon={<Users size={24} aria-hidden />}
            title="No hay estudiantes"
            description="Cuando se registren participantes, aparecerán en este listado."
          />
        </section>
      ) : (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <ul className="md:hidden divide-y divide-slate-100">
            {filas.map((estudiante) => (
              <li key={estudiante.id} className="px-4 py-4">
                <p className="font-semibold text-brand-dark">{nombreEstudiante(estudiante)}</p>
                <p className="text-sm text-slate-500">{estudiante.codigoUnico}</p>
                <p className="text-sm text-slate-600">
                  {estudiante.grupo.codigo} · {estudiante.grupo.nombre}
                </p>
              </li>
            ))}
          </ul>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <caption className="sr-only">Listado de estudiantes</caption>
              <thead>
                <tr className="text-[12px] font-medium text-slate-400 border-b border-slate-100">
                  <th scope="col" className="px-5 py-3 font-medium">
                    Código
                  </th>
                  <th scope="col" className="px-3 py-3 font-medium">
                    Nombre
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Grupo
                  </th>
                </tr>
              </thead>
              <tbody>
                {filas.map((estudiante) => (
                  <tr key={estudiante.id} className="border-b border-slate-100 text-sm">
                    <td className="px-5 py-3 font-semibold text-brand-dark">{estudiante.codigoUnico}</td>
                    <td className="px-3 py-3 text-slate-700">{nombreEstudiante(estudiante)}</td>
                    <td className="px-5 py-3 text-slate-600">
                      {estudiante.grupo.codigo} · {estudiante.grupo.nombre}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!busquedaActiva && (
            <PaginacionSimple
              pagina={pagina}
              totalPaginas={totalPaginas}
              total={total}
              onCambiarPagina={(siguiente) => void cargarListado(siguiente, grupoId)}
            />
          )}
        </section>
      )}
    </ConsultaShell>
  );
};
