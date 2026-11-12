import React from "react";
import { Link } from "react-router-dom";
import { ClipboardCheck, Shield, Users } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { ConsultaShell } from "../components/consulta/ConsultaShell";
import { PageHeader } from "../components/consulta/PageHeader";
import { PERMISOS } from "../constants/permisos.constants";

export const Home: React.FC = () => {
  const { user, tienePermiso } = useAuth();

  return (
    <ConsultaShell>
      <PageHeader
        title={`Hola, ${user?.nombre ?? "usuario"}`}
        description="Consulta estudiantes, registra ejercicios y verifica participantes por grupo. Esta aplicación apoya la gestión de información y no sustituye los protocolos institucionales."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tienePermiso(PERMISOS.ESTUDIANTES_CONSULTAR) && (
          <Link
            to="/estudiantes"
            className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-brand hover:shadow-md transition"
          >
            <div className="w-11 h-11 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
              <Users size={22} aria-hidden />
            </div>
            <div>
              <p className="font-semibold text-brand-dark">Estudiantes</p>
              <p className="text-sm text-slate-500 mt-1">Consulta el listado y busca por código único.</p>
            </div>
          </Link>
        )}

        {tienePermiso(PERMISOS.EJERCICIOS_CONSULTAR) && (
          <Link
            to="/ejercicios"
            className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-brand hover:shadow-md transition"
          >
            <div className="w-11 h-11 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
              <Shield size={22} aria-hidden />
            </div>
            <div>
              <p className="font-semibold text-brand-dark">Ejercicios</p>
              <p className="text-sm text-slate-500 mt-1">Consulta los ejercicios registrados o crea uno nuevo.</p>
            </div>
          </Link>
        )}

        {(tienePermiso(PERMISOS.VERIFICACIONES_REGISTRAR) ||
          tienePermiso(PERMISOS.VERIFICACIONES_CONSULTAR) ||
          tienePermiso(PERMISOS.EJERCICIOS_CONSULTAR)) && (
          <Link
            to="/resultados"
            className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-brand hover:shadow-md transition"
          >
            <div className="w-11 h-11 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
              <ClipboardCheck size={22} aria-hidden />
            </div>
            <div>
              <p className="font-semibold text-brand-dark">Verificación</p>
              <p className="text-sm text-slate-500 mt-1">Selecciona un grupo y registra la verificación por código.</p>
            </div>
          </Link>
        )}
      </div>
    </ConsultaShell>
  );
};
