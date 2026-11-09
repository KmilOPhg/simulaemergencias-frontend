export const TIPOS_ESCENARIO = ["sismo", "incendio", "intruso"] as const;

export type TipoEscenario = (typeof TIPOS_ESCENARIO)[number];

export const ETIQUETAS_ESCENARIO: Record<TipoEscenario, string> = {
  sismo: "Sismo",
  incendio: "Incendio",
  intruso: "Intruso",
};
