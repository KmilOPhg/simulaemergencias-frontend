import api from "./api";
import type { Verificacion, VerificacionCreate } from "../types/verificacion.types";

export const VerificacionesService = {
  registrar: async (ejercicioId: number, payload: VerificacionCreate): Promise<Verificacion> => {
    const { data } = await api.post(`/ejercicios/${ejercicioId}/verificaciones`, payload);
    return data.data;
  },
};
