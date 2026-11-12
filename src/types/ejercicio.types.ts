import type { TipoEscenario } from "../constants/escenarios.constants";
import type { GrupoSeleccionado } from "./grupo.types";
import type { ListaPaginada } from "./paginacion.types";

export type Ejercicio = {
  id: number;
  nombre: string;
  fecha: string;
  horaInicio: string | null;
  tipoEscenario: TipoEscenario;
  lugar: string | null;
  descripcion: string | null;
  creadoEn: string;
  registradoPor: {
    id: number;
    nombre: string;
  };
};

export type EjercicioDetalle = Ejercicio & {
  grupos: GrupoSeleccionado[];
};

export type EjercicioCreate = {
  nombre: string;
  fecha: string;
  tipoEscenario: TipoEscenario;
  horaInicio?: string;
  lugar?: string;
  descripcion?: string;
};

export type FiltroEjercicios = {
  tipoEscenario?: TipoEscenario | "";
  fecha?: string;
};

export type EjerciciosPaginados = ListaPaginada<Ejercicio>;
