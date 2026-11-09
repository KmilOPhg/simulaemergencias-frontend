import React from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { ConsultaShell } from "../../components/consulta/ConsultaShell";
import { EstadoVacio } from "../../components/consulta/EstadoVacio";
import { PageHeader } from "../../components/consulta/PageHeader";
import { AvisoEjemplo } from "../../components/consulta/AvisoEjemplo";

export const EstudiantesPendientePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ConsultaShell>
      <PageHeader
        title="Estudiantes"
        description="Consulta del listado institucional y búsqueda por código único."
      />
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <EstadoVacio
          icon={<Users size={24} aria-hidden />}
          title="Vista en preparación"
          description="El diseño de esta sección aún no está disponible. Cuando se entregue, podrás consultar estudiantes y buscarlos por su código único."
          action={
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="inline-flex items-center justify-center min-w-40 px-4 py-2.5 rounded-full bg-slate-100 text-brand font-medium text-sm hover:bg-slate-200 transition"
            >
              Volver
            </button>
          }
        />
      </section>
      <div className="mt-4">
        <AvisoEjemplo />
      </div>
    </ConsultaShell>
  );
};
