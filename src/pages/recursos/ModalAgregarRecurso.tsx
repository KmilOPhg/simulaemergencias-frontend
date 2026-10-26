import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { RecursosService } from "../../services/recursos.service";
import { extractErrorMessage } from "../../utils/extractErrorMessage";
import type { Recurso } from "../../types/recurso.types";

interface Props {
  onClose: () => void;
  onCreado: (recurso: Recurso) => void;
}

export const ModalAgregarRecurso: React.FC<Props> = ({ onClose, onCreado }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      toast.error("El nombre es obligatorio.");
      return;
    }

    setLoading(true);
    try {
      const creado = await RecursosService.crear({ nombre: nombre.trim(), descripcion: descripcion.trim() || undefined });
      toast.success("Recurso creado correctamente.");
      onCreado(creado);
      onClose();
    } catch (err) {
      toast.error(extractErrorMessage(err, "No se pudo crear el recurso."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900 text-[15px]">Nuevo recurso</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              maxLength={200}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-semibold rounded-lg transition"
            >
              {loading ? "Guardando..." : "Crear recurso"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
