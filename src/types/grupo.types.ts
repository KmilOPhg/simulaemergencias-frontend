export type Grupo = {
  id: number;
  codigo: string;
  nombre: string;
};

export type GrupoSeleccionado = {
  id: number;
  seleccionadoEn: string;
  grupo: Grupo;
  seleccionadoPor: {
    id: number;
    nombre: string;
  };
};

export type GruposDelEjercicio = {
  ejercicio: {
    id: number;
    nombre: string;
  };
  grupos: GrupoSeleccionado[];
};
