import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  pagina: number;
  totalPaginas: number;
  total: number;
  onCambiarPagina: (pagina: number) => void;
}

export const PaginacionSimple: React.FC<Props> = ({ pagina, totalPaginas, total, onCambiarPagina }) => {
  if (totalPaginas <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-[13px] text-gray-500">
      <span>
        Página {pagina} de {totalPaginas} · {total} registros
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onCambiarPagina(pagina - 1)}
          disabled={pagina <= 1}
          className="p-1.5 rounded-md border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronLeft size={15} />
        </button>
        <button
          onClick={() => onCambiarPagina(pagina + 1)}
          disabled={pagina >= totalPaginas}
          className="p-1.5 rounded-md border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};
