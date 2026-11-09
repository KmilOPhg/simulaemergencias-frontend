export const porcentajeEntero = (parte: number, total: number): number => {
  if (total <= 0) return 0;
  return Math.round((parte / total) * 100);
};

export const formatearFechaCorta = (isoFecha: string): string => {
  const fecha = new Date(`${isoFecha}T12:00:00`);
  return fecha.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatearFechaLarga = (isoFecha: string): string => {
  const fecha = new Date(`${isoFecha}T12:00:00`);
  return fecha.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const listarEnEspanol = (nombres: string[]): string => {
  if (nombres.length === 0) return "";
  if (nombres.length === 1) return nombres[0];
  if (nombres.length === 2) return `${nombres[0]} y ${nombres[1]}`;
  return `${nombres.slice(0, -1).join(", ")} y ${nombres[nombres.length - 1]}`;
};
