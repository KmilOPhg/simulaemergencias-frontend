/** Formato vigente AGAPE-001. También se acepta el código anterior AGP-1001. */
const FORMATO_CODIGO_UNICO = /^(?:AGAPE-\d{3,6}|AGP-\d{3,6})$/i;

export const normalizarCodigoUnico = (valor: string): string => valor.trim().toUpperCase();

export const esCodigoUnico = (valor: string): boolean => FORMATO_CODIGO_UNICO.test(normalizarCodigoUnico(valor));

export const validarCodigoUnico = (valor: string): string => {
  const limpio = valor.trim();
  if (!limpio) return "Completa este campo";
  if (!esCodigoUnico(limpio)) return "Revisa el código";
  return "";
};
