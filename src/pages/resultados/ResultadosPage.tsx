import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Users } from "lucide-react";
import { toast } from "sonner";
import { ConsultaShell } from "../../components/consulta/ConsultaShell";
import { PageHeader } from "../../components/consulta/PageHeader";
import { Cargando } from "../../components/consulta/Cargando";
import { EstadoVacio } from "../../components/consulta/EstadoVacio";
import { EstadoError } from "../../components/consulta/EstadoError";
import { CampoError } from "../../components/consulta/CampoError";
import { EjerciciosService } from "../../services/ejercicios.service";
import { EstudiantesService } from "../../services/estudiantes.service";
import { GruposService } from "../../services/grupos.service";
import { VerificacionesService } from "../../services/verificaciones.service";
import { extractErrorMessage } from "../../utils/extractErrorMessage";
import { validarCodigoUnico } from "../../utils/codigo.utils";
import { nombreEstudiante } from "../../utils/estudiante.utils";
import { etiquetaEscenario } from "../../constants/escenarios.constants";
import { formatearFechaCorta } from "../../utils/formato";
import { useAuth } from "../../hooks/useAuth";
import { PERMISOS } from "../../constants/permisos.constants";
import type { Ejercicio } from "../../types/ejercicio.types";
import type { Estudiante } from "../../types/estudiante.types";
import type { Grupo, GrupoSeleccionado } from "../../types/grupo.types";

const selectClass =
  "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-brand";

export const ResultadosPage: React.FC = () => {
  const { tienePermiso } = useAuth();
  const puedeRegistrar = tienePermiso(PERMISOS.VERIFICACIONES_REGISTRAR);
  const puedeSeleccionarGrupo = tienePermiso(PERMISOS.EJERCICIOS_SELECCIONAR_GRUPO);
  const puedeConsultarVerificaciones = tienePermiso(PERMISOS.VERIFICACIONES_CONSULTAR);
  const [searchParams, setSearchParams] = useSearchParams();
  const ejercicioInicial = searchParams.get("ejercicioId") ?? "";

  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [gruposSeleccionados, setGruposSeleccionados] = useState<GrupoSeleccionado[]>([]);
  const [ejercicioId, setEjercicioId] = useState(ejercicioInicial);
  const [grupoId, setGrupoId] = useState("");
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [codigo, setCodigo] = useState("");
  const [codigoError, setCodigoError] = useState("");
  const [encontrado, setEncontrado] = useState<Estudiante | null>(null);
  const [verificados, setVerificados] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [cargandoGrupo, setCargandoGrupo] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [registrandoId, setRegistrandoId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const ejercicio = useMemo(
    () => ejercicios.find((item) => String(item.id) === ejercicioId),
    [ejercicios, ejercicioId]
  );

  const gruposDisponibles = puedeSeleccionarGrupo
    ? grupos
    : grupos.filter((grupo) => gruposSeleccionados.some((item) => item.grupo.id === grupo.id));

  const cargarVerificaciones = useCallback(
    async (idEjercicio: number) => {
      if (!puedeConsultarVerificaciones) {
        setVerificados(new Set());
        return;
      }
      const lista = await VerificacionesService.listarTodas(idEjercicio);
      setVerificados(new Set(lista.map((item) => item.estudiante.id)));
    },
    [puedeConsultarVerificaciones]
  );

  const cargarGruposDelEjercicio = useCallback(async (idEjercicio: number) => {
    const resultado = await EjerciciosService.listarGrupos(idEjercicio);
    setGruposSeleccionados(resultado.grupos);
    return resultado.grupos;
  }, []);

  useEffect(() => {
    const iniciar = async () => {
      setLoading(true);
      setError("");
      try {
        const [listaEjercicios, listaGrupos] = await Promise.all([
          EjerciciosService.listar(1, 100),
          GruposService.listar(),
        ]);
        setEjercicios(listaEjercicios.datos);
        setGrupos(listaGrupos);
        const idInicial = ejercicioInicial || (listaEjercicios.datos[0] ? String(listaEjercicios.datos[0].id) : "");
        if (!ejercicioInicial && idInicial) {
          setEjercicioId(idInicial);
        }
        if (idInicial) {
          const seleccionados = await cargarGruposDelEjercicio(Number(idInicial));
          await cargarVerificaciones(Number(idInicial));
          if (seleccionados[0] && !grupoId) {
            setGrupoId(String(seleccionados[0].grupo.id));
          }
        }
      } catch (err) {
        setError(extractErrorMessage(err, "No se pudo cargar la información del ejercicio."));
      } finally {
        setLoading(false);
      }
    };
    void iniciar();
    // grupoId se lee solo para no pisar una selección ya hecha en el primer render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ejercicioInicial, cargarGruposDelEjercicio, cargarVerificaciones]);

  const cargarEstudiantes = useCallback(async (grupoSeleccionado: string) => {
    if (!grupoSeleccionado) {
      setEstudiantes([]);
      return;
    }
    setCargandoGrupo(true);
    try {
      const resultado = await EstudiantesService.listarPorGrupo(Number(grupoSeleccionado), 1, 100);
      setEstudiantes(resultado.datos);
    } catch (err) {
      toast.error(extractErrorMessage(err, "No se pudieron cargar los estudiantes del grupo."));
      setEstudiantes([]);
    } finally {
      setCargandoGrupo(false);
    }
  }, []);

  useEffect(() => {
    if (grupoId) void cargarEstudiantes(grupoId);
  }, [grupoId, cargarEstudiantes]);

  const asociarGrupo = async (idEjercicio: number, idGrupo: number) => {
    const yaEsta = gruposSeleccionados.some((item) => item.grupo.id === idGrupo);
    if (yaEsta) return;
    if (!puedeSeleccionarGrupo) {
      toast.error("Este grupo no está seleccionado para el ejercicio.");
      return;
    }
    try {
      await EjerciciosService.seleccionarGrupo(idEjercicio, idGrupo);
      await cargarGruposDelEjercicio(idEjercicio);
      toast.success("Grupo seleccionado para el ejercicio");
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 409) {
        await cargarGruposDelEjercicio(idEjercicio);
        return;
      }
      throw err;
    }
  };

  const cambiarEjercicio = (valor: string) => {
    setEjercicioId(valor);
    setEncontrado(null);
    setCodigo("");
    setGrupoId("");
    setEstudiantes([]);
    setGruposSeleccionados([]);
    setVerificados(new Set());
    if (valor) setSearchParams({ ejercicioId: valor });
    else setSearchParams({});
    if (valor) {
      void (async () => {
        try {
          const seleccionados = await cargarGruposDelEjercicio(Number(valor));
          await cargarVerificaciones(Number(valor));
          if (seleccionados[0]) setGrupoId(String(seleccionados[0].grupo.id));
        } catch (err) {
          toast.error(extractErrorMessage(err, "No se pudo cargar el ejercicio."));
        }
      })();
    }
  };

  const cambiarGrupo = (valor: string) => {
    setGrupoId(valor);
    setEncontrado(null);
    setCodigo("");
    setCodigoError("");
    if (!valor || !ejercicioId) return;
    void (async () => {
      try {
        await asociarGrupo(Number(ejercicioId), Number(valor));
      } catch (err) {
        toast.error(extractErrorMessage(err, "No se pudo seleccionar el grupo."));
      }
    })();
  };

  const buscar = async (event: React.FormEvent) => {
    event.preventDefault();
    const errorCampo = validarCodigoUnico(codigo);
    setCodigoError(errorCampo);
    if (errorCampo) return;
    if (!grupoId) {
      toast.error("Selecciona el grupo que estás verificando.");
      return;
    }

    setBuscando(true);
    try {
      const estudiante = await EstudiantesService.buscarPorCodigo(codigo);
      if (estudiante.grupo.id !== Number(grupoId)) {
        setEncontrado(null);
        toast.error("El estudiante no pertenece al grupo indicado.");
        return;
      }
      setEncontrado(estudiante);
    } catch (err) {
      setEncontrado(null);
      toast.error(extractErrorMessage(err, "No se encontraron resultados para el código ingresado."));
    } finally {
      setBuscando(false);
    }
  };

  const registrar = async (estudiante: Estudiante) => {
    if (!ejercicioId) {
      toast.error("Selecciona un ejercicio.");
      return;
    }
    if (!grupoId) {
      toast.error("Selecciona el grupo que estás verificando.");
      return;
    }
    if (estudiante.grupo.id !== Number(grupoId)) {
      toast.error("El estudiante no pertenece al grupo indicado.");
      return;
    }

    setRegistrandoId(estudiante.id);
    try {
      await asociarGrupo(Number(ejercicioId), Number(grupoId));
      await VerificacionesService.registrar(Number(ejercicioId), {
        estudianteId: estudiante.id,
        grupoId: Number(grupoId),
      });
      setVerificados((prev) => new Set(prev).add(estudiante.id));
      toast.success("Verificación del estudiante registrada correctamente.");
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 409) {
        setVerificados((prev) => new Set(prev).add(estudiante.id));
      }
      toast.error(extractErrorMessage(err, "No se pudo registrar la verificación."));
    } finally {
      setRegistrandoId(null);
    }
  };

  if (loading) {
    return (
      <ConsultaShell>
        <Cargando etiqueta="Cargando ejercicios y grupos" />
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

  return (
    <ConsultaShell>
      <PageHeader
        kicker="Operación del ejercicio"
        title="Verificación por grupo"
        description="Selecciona el ejercicio y el grupo, busca al estudiante por su código y registra la verificación. Pendiente no equivale a ausente."
      />

      {ejercicios.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <EstadoVacio
            icon={<Users size={24} aria-hidden />}
            title="No hay ejercicios registrados"
            description="Registra un ejercicio antes de asociar un grupo y las verificaciones."
          />
        </section>
      ) : (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white px-4 py-4 sm:px-5 mb-4 shadow-sm">
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label htmlFor="ejercicio-verificacion" className="block text-[12px] text-slate-500">
                  Ejercicio
                </label>
                <select
                  id="ejercicio-verificacion"
                  className={selectClass}
                  value={ejercicioId}
                  onChange={(e) => cambiarEjercicio(e.target.value)}
                >
                  <option value="">Selecciona un ejercicio</option>
                  {ejercicios.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nombre} · {formatearFechaCorta(item.fecha)} · {etiquetaEscenario(item.tipoEscenario)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="grupo-verificacion" className="block text-[12px] text-slate-500">
                  Grupo que estás verificando
                </label>
                <select
                  id="grupo-verificacion"
                  className={selectClass}
                  value={grupoId}
                  onChange={(e) => cambiarGrupo(e.target.value)}
                >
                  <option value="">Selecciona un grupo</option>
                  {gruposDisponibles.map((grupo) => (
                    <option key={grupo.id} value={grupo.id}>
                      {grupo.codigo} · {grupo.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {ejercicio && (
              <p className="mt-3 text-[12px] text-slate-400">
                {ejercicio.nombre} · {etiquetaEscenario(ejercicio.tipoEscenario)} · {formatearFechaCorta(ejercicio.fecha)}
                {gruposSeleccionados.length > 0 &&
                  ` · Grupos: ${gruposSeleccionados.map((item) => item.grupo.codigo).join(", ")}`}
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white px-4 py-4 sm:px-5 mb-4 shadow-sm">
            <form onSubmit={buscar} noValidate className="flex flex-col sm:flex-row gap-2 sm:items-end">
              <div className="flex-1">
                <label htmlFor="codigo-verificacion" className="block text-[12px] text-slate-500">
                  Código único
                </label>
                <input
                  id="codigo-verificacion"
                  value={codigo}
                  onChange={(e) => {
                    setCodigo(e.target.value);
                    if (codigoError) setCodigoError(validarCodigoUnico(e.target.value));
                  }}
                  placeholder="Ejemplo: AGAPE-001"
                  autoComplete="off"
                  aria-invalid={Boolean(codigoError)}
                  className={`mt-1 w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-brand ${
                    codigoError ? "border-red-400" : "border-slate-200"
                  }`}
                />
                {codigoError === "Completa este campo" && (
                  <CampoError id="error-codigo-verificacion" mensaje="Completa este campo" detalle="Escribe el código para continuar." />
                )}
                {codigoError === "Revisa el código" && (
                  <CampoError
                    id="error-codigo-verificacion"
                    mensaje="Revisa el código"
                    detalle="Usa el formato AGAPE-001. También se acepta el código anterior AGP-1001."
                  />
                )}
              </div>
              <button
                type="submit"
                disabled={buscando}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:bg-slate-400"
              >
                <Search size={16} aria-hidden />
                {buscando ? "Buscando…" : "Buscar"}
              </button>
            </form>

            {encontrado && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-semibold text-brand-dark">{nombreEstudiante(encontrado)}</p>
                  <p className="text-sm text-slate-500">
                    {encontrado.codigoUnico} · {encontrado.grupo.codigo} · {encontrado.grupo.nombre}
                  </p>
                </div>
                {puedeRegistrar && (
                  <button
                    type="button"
                    disabled={registrandoId === encontrado.id || verificados.has(encontrado.id)}
                    onClick={() => void registrar(encontrado)}
                    className="inline-flex items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:bg-slate-400"
                  >
                    {verificados.has(encontrado.id)
                      ? "Ya registrada"
                      : registrandoId === encontrado.id
                        ? "Registrando…"
                        : "Registrar verificación"}
                  </button>
                )}
              </div>
            )}
          </section>

          {!grupoId ? (
            <p className="text-sm text-slate-500 mb-4">Selecciona un grupo para asociarlo al ejercicio y ver a sus estudiantes.</p>
          ) : cargandoGrupo ? (
            <Cargando etiqueta="Cargando el grupo" />
          ) : estudiantes.length === 0 ? (
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm mb-4">
              <EstadoVacio
                icon={<Users size={24} aria-hidden />}
                title="El grupo no tiene estudiantes"
                description="No hay participantes asociados al grupo seleccionado."
              />
            </section>
          ) : (
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-4">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="text-base font-semibold text-brand-dark">Estudiantes del grupo</h2>
                <p className="text-[12px] text-slate-400">
                  {estudiantes.filter((item) => verificados.has(item.id)).length} verificados ·{" "}
                  {estudiantes.filter((item) => !verificados.has(item.id)).length} pendientes. Un pendiente no se marca como
                  ausente.
                </p>
              </div>
              <ul className="divide-y divide-slate-100">
                {estudiantes.map((estudiante) => {
                  const registrada = verificados.has(estudiante.id);
                  return (
                    <li key={estudiante.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-5 py-3">
                      <div>
                        <p className="font-medium text-brand-dark">{nombreEstudiante(estudiante)}</p>
                        <p className="text-sm text-slate-500">{estudiante.codigoUnico}</p>
                      </div>
                      {puedeRegistrar ? (
                        <button
                          type="button"
                          disabled={registrada || registrandoId === estudiante.id || !ejercicioId}
                          onClick={() => void registrar(estudiante)}
                          className="self-start rounded-full bg-slate-100 px-3 py-1.5 text-[13px] font-medium text-brand hover:bg-brand-soft disabled:text-slate-400 disabled:hover:bg-slate-100"
                        >
                          {registrada ? "Verificado" : registrandoId === estudiante.id ? "Registrando…" : "Registrar"}
                        </button>
                      ) : (
                        <span className="text-[12px] text-slate-400">{registrada ? "Verificado" : "Pendiente"}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </>
      )}
    </ConsultaShell>
  );
};
