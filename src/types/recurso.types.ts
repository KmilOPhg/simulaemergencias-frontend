export interface Recurso {
  id: number;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface RecursoFormData {
  nombre: string;
  descripcion?: string;
}

export interface RecursosPaginados {
  datos: Recurso[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}
