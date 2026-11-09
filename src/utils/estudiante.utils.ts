import type { Estudiante } from "../types/estudiante.types";

export const nombreEstudiante = (estudiante: Pick<Estudiante, "nombres" | "apellidos">): string =>
  `${estudiante.apellidos} ${estudiante.nombres}`.trim();
