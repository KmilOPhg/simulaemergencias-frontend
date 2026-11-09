import type { TipoEscenario } from "../constants/escenarios.constants";

export type EstadoVerificacion = "verificado" | "pendiente_revision";

export type ResultadoGrupoEjemplo = {
  grupoId: string;
  nombre: string;
  totalEstudiantes: number;
  verificados: number;
  pendientesRevision: number;
};

export type EjercicioEjemplo = {
  id: string;
  nombre: string;
  tipoEscenario: TipoEscenario;
  fecha: string;
  responsable: string;
  resultados: ResultadoGrupoEjemplo[];
};

export type ResumenEjercicio = {
  id: string;
  nombre: string;
  tipoEscenario: TipoEscenario;
  fecha: string;
  responsable: string;
  grupos: ResultadoGrupoEjemplo[];
  totalEstudiantes: number;
  verificados: number;
  pendientesRevision: number;
  porcentajeVerificado: number;
};
