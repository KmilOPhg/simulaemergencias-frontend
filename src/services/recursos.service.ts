import api from "./api";
import type { Recurso, RecursoFormData, RecursosPaginados } from "../types/recurso.types";

export const RecursosService = {
  listar: async (pagina = 1, limite = 10): Promise<RecursosPaginados> => {
    const { data } = await api.get("/recursos", { params: { page: pagina, limit: limite } });
    return data.data;
  },

  obtener: async (id: number): Promise<Recurso> => {
    const { data } = await api.get(`/recursos/${id}`);
    return data.data;
  },

  crear: async (payload: RecursoFormData): Promise<Recurso> => {
    const { data } = await api.post("/recursos", payload);
    return data.data;
  },

  actualizar: async (id: number, payload: RecursoFormData): Promise<Recurso> => {
    const { data } = await api.put(`/recursos/${id}`, payload);
    return data.data;
  },

  toggleActivo: async (id: number): Promise<Recurso> => {
    const { data } = await api.patch(`/recursos/${id}/disable`);
    return data.data;
  },
};
