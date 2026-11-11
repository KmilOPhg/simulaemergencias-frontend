export const TIPOS_ESCENARIO = ["SISMO", "INCENDIO", "INTRUSO"] as const;

export type TipoEscenario = (typeof TIPOS_ESCENARIO)[number];

export const ETIQUETAS_ESCENARIO: Record<TipoEscenario, string> = {
  SISMO: "Sismo",
  INCENDIO: "Incendio",
  INTRUSO: "Intruso",
};

export const etiquetaEscenario = (tipo: string): string => {
  if (tipo in ETIQUETAS_ESCENARIO) {
    return ETIQUETAS_ESCENARIO[tipo as TipoEscenario];
  }
  return tipo;
};
