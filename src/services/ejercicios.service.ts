import api from "./api";
import type {
  Ejercicio,
  EjercicioCreate,
  EjercicioDetalle,
  EjerciciosPaginados,
  FiltroEjercicios,
} from "../types/ejercicio.types";
import type { GrupoSeleccionado, GruposDelEjercicio } from "../types/grupo.types";

export const EjerciciosService = {
  listar: async (pagina = 1, limite = 20, filtros: FiltroEjercicios = {}): Promise<EjerciciosPaginados> => {
    const { data } = await api.get("/ejercicios", {
      params: {
        page: pagina,
        limit: limite,
        ...(filtros.tipoEscenario ? { tipoEscenario: filtros.tipoEscenario } : {}),
        ...(filtros.fecha ? { fecha: filtros.fecha } : {}),
      },
    });
    return data.data;
  },

  obtener: async (id: number): Promise<EjercicioDetalle> => {
    const { data } = await api.get(`/ejercicios/${id}`);
    return data.data;
  },

  crear: async (payload: EjercicioCreate): Promise<Ejercicio> => {
    const { data } = await api.post("/ejercicios", payload);
    return data.data;
  },

  listarGrupos: async (ejercicioId: number): Promise<GruposDelEjercicio> => {
    const { data } = await api.get(`/ejercicios/${ejercicioId}/grupos`);
    return data.data;
  },

  seleccionarGrupo: async (ejercicioId: number, grupoId: number): Promise<GrupoSeleccionado> => {
    const { data } = await api.post(`/ejercicios/${ejercicioId}/grupos`, { grupoId });
    return data.data;
  },
};
