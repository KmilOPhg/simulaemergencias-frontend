import api from "./api";
import type { Ejercicio, EjercicioCreate, EjerciciosPaginados } from "../types/ejercicio.types";

export const EjerciciosService = {
  listar: async (pagina = 1, limite = 20): Promise<EjerciciosPaginados> => {
    const { data } = await api.get("/ejercicios", { params: { page: pagina, limit: limite } });
    return data.data;
  },

  crear: async (payload: EjercicioCreate): Promise<Ejercicio> => {
    const { data } = await api.post("/ejercicios", payload);
    return data.data;
  },
};
