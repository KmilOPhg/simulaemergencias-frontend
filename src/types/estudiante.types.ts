import type { Grupo } from "./grupo.types";
import type { ListaPaginada } from "./paginacion.types";

export type Estudiante = {
  id: number;
  codigoUnico: string;
  nombres: string;
  apellidos: string;
  grupo: Grupo;
};

export type EstudiantesPaginados = ListaPaginada<Estudiante>;
