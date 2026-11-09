import api from "./api";
import type { Estudiante, EstudiantesPaginados } from "../types/estudiante.types";

export const EstudiantesService = {
  listar: async (pagina = 1, limite = 20, grupoId?: number): Promise<EstudiantesPaginados> => {
    const { data } = await api.get("/estudiantes", {
      params: { page: pagina, limit: limite, ...(grupoId ? { grupoId } : {}) },
    });
    return data.data;
  },

  buscarPorCodigo: async (codigo: string): Promise<Estudiante> => {
    const { data } = await api.get(`/estudiantes/codigo/${encodeURIComponent(codigo)}`);
    return data.data;
  },
};
