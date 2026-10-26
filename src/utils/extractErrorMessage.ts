import { AxiosError } from "axios";

const ES_MENSAJE_AXIOS_GENERICO = (texto: string) => /^Request failed with status code \d+$/i.test(texto.trim());

/** Extrae un mensaje legible de un error de Axios contra la API (formato `{status,msg,errors?}`). */
export const extractErrorMessage = (err: unknown, fallback = "Ocurrió un error"): string => {
  const axiosError = err as AxiosError<{
    msg?: string;
    message?: string;
    error?: string;
    errors?: unknown[];
  }>;
  const data = axiosError?.response?.data;

  const mensajeAxios = typeof axiosError?.message === "string" ? axiosError.message : "";
  const mensajeBackend = data?.msg || data?.message || data?.error;

  let mensaje = mensajeBackend || (!ES_MENSAJE_AXIOS_GENERICO(mensajeAxios) ? mensajeAxios : "") || fallback;

  const listaErrores = data?.errors;
  if (Array.isArray(listaErrores) && listaErrores.length > 0) {
    const detalles = listaErrores
      .map((e: unknown) => {
        if (typeof e === "string") return e;
        const item = e as { msg?: string; message?: string };
        return item?.msg || item?.message || String(e);
      })
      .filter(Boolean);
    if (detalles.length > 0 && !mensajeBackend) {
      mensaje = detalles.join(", ");
    } else if (detalles.length > 0) {
      mensaje = `${mensaje}: ${detalles.join(", ")}`;
    }
  }

  return mensaje;
};
