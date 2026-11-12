import api from "./api";
import type { ListaPaginada } from "../types/paginacion.types";
import type { Verificacion, VerificacionCreate } from "../types/verificacion.types";

export const VerificacionesService = {
  listar: async (ejercicioId: number, pagina = 1, limite = 100): Promise<ListaPaginada<Verificacion>> => {
    const { data } = await api.get(`/ejercicios/${ejercicioId}/verificaciones`, {
      params: { page: pagina, limit: limite },
    });
    return data.data;
  },

  listarTodas: async (ejercicioId: number): Promise<Verificacion[]> => {
    const primera = await VerificacionesService.listar(ejercicioId, 1, 100);
    const todas = [...primera.datos];
    for (let pagina = 2; pagina <= primera.totalPaginas; pagina += 1) {
      const siguiente = await VerificacionesService.listar(ejercicioId, pagina, 100);
      todas.push(...siguiente.datos);
    }
    return todas;
  },

  registrar: async (ejercicioId: number, payload: VerificacionCreate): Promise<Verificacion> => {
    const { data } = await api.post(`/ejercicios/${ejercicioId}/verificaciones`, payload);
    return data.data;
  },
};
