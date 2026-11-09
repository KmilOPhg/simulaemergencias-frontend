/**
 * Datos de ejemplo para construir las vistas de consulta.
 * No representan registros de Ágape School ni de estudiantes reales.
 *
 * Cuando el Backend exponga endpoints de ejercicios, grupos y verificaciones,
 * sustituir esta capa por servicios Axios. No llamar rutas que aún no existen.
 */

import { ETIQUETAS_ESCENARIO, type TipoEscenario } from "../../constants/escenarios.constants";
import type { EjercicioEjemplo, ResultadoGrupoEjemplo, ResumenEjercicio } from "../../types/ejercicio.types";
import { listarEnEspanol, porcentajeEntero } from "../../utils/formato";

export type FiltrosHistorial = {
  fecha?: string;
  tipoEscenario?: TipoEscenario | "";
};

const grupo = (
  grupoId: string,
  nombre: string,
  totalEstudiantes: number,
  verificados: number
): ResultadoGrupoEjemplo => ({
  grupoId,
  nombre,
  totalEstudiantes,
  verificados,
  pendientesRevision: totalEstudiantes - verificados,
});

export const EJERCICIOS_EJEMPLO: EjercicioEjemplo[] = [
  {
    id: "EJ-2026-015",
    nombre: "Simulacro de sismo",
    tipoEscenario: "sismo",
    fecha: "2026-10-28",
    responsable: "Coordinación académica",
    resultados: [
      grupo("transicion", "Transición", 28, 18),
      grupo("1a", "1° A", 26, 22),
      grupo("1b", "1° B", 30, 30),
      grupo("2a", "2° A", 27, 19),
      grupo("3a", "3° A", 29, 24),
    ],
  },
  {
    id: "EJ-2026-014",
    nombre: "Simulacro de incendio",
    tipoEscenario: "incendio",
    fecha: "2026-10-14",
    responsable: "Coordinación académica",
    resultados: [
      grupo("transicion", "Transición", 28, 20),
      grupo("1a", "1° A", 26, 21),
      grupo("1b", "1° B", 30, 24),
    ],
  },
  {
    id: "EJ-2026-013",
    nombre: "Simulacro de intruso",
    tipoEscenario: "intruso",
    fecha: "2026-09-30",
    responsable: "Coordinación académica",
    resultados: [
      grupo("2a", "2° A", 27, 22),
      grupo("3a", "3° A", 29, 25),
    ],
  },
  {
    id: "EJ-2026-012",
    nombre: "Simulacro de sismo",
    tipoEscenario: "sismo",
    fecha: "2026-09-16",
    responsable: "Coordinación académica",
    resultados: [
      grupo("transicion", "Transición", 28, 25),
      grupo("1a", "1° A", 26, 24),
      grupo("1b", "1° B", 30, 28),
      grupo("2a", "2° A", 27, 20),
    ],
  },
  {
    id: "EJ-2026-011",
    nombre: "Simulacro de incendio",
    tipoEscenario: "incendio",
    fecha: "2026-09-02",
    responsable: "Coordinación académica",
    resultados: [
      grupo("1a", "1° A", 26, 18),
      grupo("3a", "3° A", 29, 22),
    ],
  },
];

export const resumirEjercicio = (ejercicio: EjercicioEjemplo, grupoId?: string): ResumenEjercicio => {
  const grupos = grupoId ? ejercicio.resultados.filter((item) => item.grupoId === grupoId) : ejercicio.resultados;
  const totalEstudiantes = grupos.reduce((acc, item) => acc + item.totalEstudiantes, 0);
  const verificados = grupos.reduce((acc, item) => acc + item.verificados, 0);
  const pendientesRevision = grupos.reduce((acc, item) => acc + item.pendientesRevision, 0);

  return {
    id: ejercicio.id,
    nombre: ejercicio.nombre,
    tipoEscenario: ejercicio.tipoEscenario,
    fecha: ejercicio.fecha,
    responsable: ejercicio.responsable,
    grupos,
    totalEstudiantes,
    verificados,
    pendientesRevision,
    porcentajeVerificado: porcentajeEntero(verificados, totalEstudiantes),
  };
};

export const listarEjerciciosEjemplo = (filtros: FiltrosHistorial = {}): ResumenEjercicio[] => {
  return EJERCICIOS_EJEMPLO.filter((ejercicio) => {
    const coincideFecha = !filtros.fecha || ejercicio.fecha === filtros.fecha;
    const coincideEscenario = !filtros.tipoEscenario || ejercicio.tipoEscenario === filtros.tipoEscenario;
    return coincideFecha && coincideEscenario;
  })
    .sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
    .map((ejercicio) => resumirEjercicio(ejercicio));
};

export const obtenerEjercicioEjemplo = (id: string): ResumenEjercicio | undefined => {
  const ejercicio = EJERCICIOS_EJEMPLO.find((item) => item.id === id);
  return ejercicio ? resumirEjercicio(ejercicio) : undefined;
};

export const consolidarEjercicioEjemplo = (id: string, grupoId?: string): ResumenEjercicio | undefined => {
  const ejercicio = EJERCICIOS_EJEMPLO.find((item) => item.id === id);
  if (!ejercicio) return undefined;
  if (grupoId && !ejercicio.resultados.some((item) => item.grupoId === grupoId)) return undefined;
  return resumirEjercicio(ejercicio, grupoId);
};

export const fechasDisponiblesEjemplo = (): string[] => {
  return [...new Set(EJERCICIOS_EJEMPLO.map((item) => item.fecha))].sort((a, b) => (a < b ? 1 : -1));
};

export const etiquetaEscenario = (tipo: TipoEscenario): string => ETIQUETAS_ESCENARIO[tipo];

export const textoGruposParticipantes = (resumen: ResumenEjercicio): string => {
  const nombres = resumen.grupos.map((item) => item.nombre);
  return `${nombres.length} ${nombres.length === 1 ? "grupo" : "grupos"} · ${listarEnEspanol(nombres)}`;
};
