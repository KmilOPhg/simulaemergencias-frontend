import React, { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Power, Search } from "lucide-react";
import { toast } from "sonner";
import { RecursosService } from "../../services/recursos.service";
import { extractErrorMessage } from "../../utils/extractErrorMessage";
import { PaginacionSimple } from "../../components/PaginacionSimple";
import { useAuth } from "../../hooks/useAuth";
import { PERMISOS } from "../../constants/permisos.constants";
import type { Recurso } from "../../types/recurso.types";
import { ModalAgregarRecurso } from "./ModalAgregarRecurso";
import { ModalEditarRecurso } from "./ModalEditarRecurso";

const LIMITE = 10;

export const RecursosPage: React.FC = () => {
  const { tienePermiso } = useAuth();
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
  const [recursoEditando, setRecursoEditando] = useState<Recurso | null>(null);

  const puedeCrear = tienePermiso(PERMISOS.RECURSOS_CREAR);
  const puedeActualizar = tienePermiso(PERMISOS.RECURSOS_ACTUALIZAR);
  const puedeDeshabilitar = tienePermiso(PERMISOS.RECURSOS_DESHABILITAR);

  const cargar = useCallback(async (paginaCargar: number) => {
    setLoading(true);
    try {
      const resultado = await RecursosService.listar(paginaCargar, LIMITE);
      setRecursos(resultado.datos);
      setPagina(resultado.pagina);
      setTotalPaginas(resultado.totalPaginas);
      setTotal(resultado.total);
    } catch (err) {
      toast.error(extractErrorMessage(err, "No se pudieron cargar los recursos."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar(1);
  }, [cargar]);

  const recursosFiltrados = recursos.filter((r) => r.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  const handleToggleActivo = async (recurso: Recurso) => {
    try {
      const actualizado = await RecursosService.toggleActivo(recurso.id);
      setRecursos((prev) => prev.map((r) => (r.id === actualizado.id ? actualizado : r)));
      toast.success(actualizado.activo ? "Recurso habilitado." : "Recurso deshabilitado.");
    } catch (err) {
      toast.error(extractErrorMessage(err, "No se pudo cambiar el estado del recurso."));
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Recursos</h1>
          <p className="text-[13px] text-gray-500">Módulo de ejemplo — úsalo como plantilla para tus propios módulos.</p>
        </div>
        {puedeCrear && (
          <button
            onClick={() => setModalAgregarAbierto(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition self-start"
          >
            <Plus size={16} /> Nuevo recurso
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 font-semibold">Nombre</th>
                <th className="px-4 py-3 font-semibold">Descripción</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-gray-400">
                    Cargando...
                  </td>
                </tr>
              ) : recursosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-gray-400">
                    No hay recursos para mostrar.
                  </td>
                </tr>
              ) : (
                recursosFiltrados.map((recurso) => (
                  <tr key={recurso.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{recurso.nombre}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{recurso.descripcion || "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          recurso.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {recurso.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {puedeActualizar && (
                          <button
                            onClick={() => setRecursoEditando(recurso)}
                            className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                            title="Editar"
                          >
                            <Pencil size={15} />
                          </button>
                        )}
                        {puedeDeshabilitar && (
                          <button
                            onClick={() => handleToggleActivo(recurso)}
                            className="p-1.5 rounded-md text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition"
                            title={recurso.activo ? "Deshabilitar" : "Habilitar"}
                          >
                            <Power size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <PaginacionSimple pagina={pagina} totalPaginas={totalPaginas} total={total} onCambiarPagina={cargar} />
      </div>

      {modalAgregarAbierto && (
        <ModalAgregarRecurso
          onClose={() => setModalAgregarAbierto(false)}
          onCreado={() => cargar(1)}
        />
      )}

      {recursoEditando && (
        <ModalEditarRecurso
          recurso={recursoEditando}
          onClose={() => setRecursoEditando(null)}
          onActualizado={(actualizado) => setRecursos((prev) => prev.map((r) => (r.id === actualizado.id ? actualizado : r)))}
        />
      )}
    </div>
  );
};
