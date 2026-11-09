import React from "react";
import { Link } from "react-router-dom";
import { BarChart3, Shield } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { ConsultaShell } from "../components/consulta/ConsultaShell";
import { PageHeader } from "../components/consulta/PageHeader";

export const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <ConsultaShell>
      <PageHeader
        title={`Hola, ${user?.nombre ?? "usuario"}`}
        description="Consulta el historial de ejercicios y el consolidado de verificación por grupo. Esta aplicación apoya la gestión de información y no sustituye los protocolos institucionales."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/ejercicios"
          className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-brand hover:shadow-md transition"
        >
          <div className="w-11 h-11 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
            <Shield size={22} aria-hidden />
          </div>
          <div>
            <p className="font-semibold text-brand-dark">Ejercicios</p>
            <p className="text-sm text-slate-500 mt-1">
              Consulta los ejercicios registrados y abre el detalle de cada uno.
            </p>
          </div>
        </Link>

        <Link
          to="/resultados"
          className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-brand hover:shadow-md transition"
        >
          <div className="w-11 h-11 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
            <BarChart3 size={22} aria-hidden />
          </div>
          <div>
            <p className="font-semibold text-brand-dark">Resultados</p>
            <p className="text-sm text-slate-500 mt-1">
              Revisa el consolidado de verificación por grupo en modo de solo consulta.
            </p>
          </div>
        </Link>
      </div>
    </ConsultaShell>
  );
};
