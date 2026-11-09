import api from "./api";
import type { Grupo } from "../types/grupo.types";

export const GruposService = {
  listar: async (): Promise<Grupo[]> => {
    const { data } = await api.get("/grupos");
    return data.data;
  },
};
