import api from "./api";
import { normalizarCodigoUnico } from "../utils/codigo.utils";
import type { Estudiante, EstudiantesDeGrupo, EstudiantesPaginados } from "../types/estudiante.types";

export const EstudiantesService = {
  listar: async (pagina = 1, limite = 20, grupoId?: number): Promise<EstudiantesPaginados> => {
    const { data } = await api.get("/estudiantes", {
      params: { page: pagina, limit: limite, ...(grupoId ? { grupoId } : {}) },
    });
    return data.data;
  },

  listarPorGrupo: async (grupoId: number, pagina = 1, limite = 100): Promise<EstudiantesDeGrupo> => {
    const { data } = await api.get(`/grupos/${grupoId}/estudiantes`, {
      params: { page: pagina, limit: limite },
    });
    return data.data;
  },

  buscarPorCodigo: async (codigo: string): Promise<Estudiante> => {
    const { data } = await api.get(`/estudiantes/codigo/${encodeURIComponent(normalizarCodigoUnico(codigo))}`);
    return data.data;
  },
};
