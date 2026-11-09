export type ListaPaginada<T> = {
  datos: T[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
};
