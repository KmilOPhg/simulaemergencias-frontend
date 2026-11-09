import type { TipoEscenario } from "../constants/escenarios.constants";

export type VerificacionCreate = {
  estudianteId: number;
  grupoId: number;
  observacion?: string;
};

export type Verificacion = {
  id: number;
  estado: "VERIFICADO";
  observacion: string | null;
  verificadoEn: string;
  estudiante: {
    id: number;
    codigoUnico: string;
    nombres: string;
    apellidos: string;
  };
  grupo: {
    id: number;
    codigo: string;
    nombre: string;
  };
  ejercicio: {
    id: number;
    nombre: string;
    fecha: string;
    tipoEscenario: TipoEscenario | string;
  };
  registradoPor: {
    id: number;
    nombre: string;
  };
};
