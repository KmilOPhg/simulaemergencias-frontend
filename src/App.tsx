import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { Search } from "lucide-react";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import { PERMISOS } from "./constants/permisos.constants";
import { Login } from "./pages/Login";
import { RecuperarContrasena } from "./pages/RecuperarContrasena";
import { Home } from "./pages/Home";
import { EstadoVacio } from "./components/consulta/EstadoVacio";
import { ConsultaShell } from "./components/consulta/ConsultaShell";
import "./index.css";

const RestablecerContrasena = lazy(() =>
  import("./pages/RestablecerContrasena").then((m) => ({ default: m.RestablecerContrasena }))
);
const RecursosPage = lazy(() => import("./pages/recursos/RecursosPage").then((m) => ({ default: m.RecursosPage })));
const HistorialEjerciciosPage = lazy(() =>
  import("./pages/ejercicios/HistorialEjerciciosPage").then((m) => ({ default: m.HistorialEjerciciosPage }))
);
const DetalleEjercicioPage = lazy(() =>
  import("./pages/ejercicios/DetalleEjercicioPage").then((m) => ({ default: m.DetalleEjercicioPage }))
);
const ResultadosPage = lazy(() =>
  import("./pages/resultados/ResultadosPage").then((m) => ({ default: m.ResultadosPage }))
);
const EstudiantesPendientePage = lazy(() =>
  import("./pages/estudiantes/EstudiantesPendientePage").then((m) => ({ default: m.EstudiantesPendientePage }))
);

const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand" />
  </div>
);

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex min-h-screen overflow-x-hidden bg-page">
    <a
      href="#contenido-principal"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-brand"
    >
      Saltar al contenido
    </a>
    <Sidebar />
    <div className="flex min-h-screen min-w-0 flex-1 flex-col ml-14 lg:ml-57">
      <Header />
      <main id="contenido-principal" className="min-w-0 flex flex-col flex-1 w-full">
        <Suspense fallback={<PageLoader />}>{children}</Suspense>
      </main>
      <Footer />
    </div>
  </div>
);

const rutaProtegida = (page: React.ReactElement, permiso?: string) => (
  <ProtectedRoute
    permiso={permiso}
    element={<AppLayout>{page}</AppLayout>}
  />
);

const App: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-page">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand" />
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="bottom-right" />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
          <Route path="/restablecer-contrasena" element={<RestablecerContrasena />} />
          <Route path="/reset-password" element={<RestablecerContrasena />} />

          <Route path="/" element={<ProtectedRoute element={<Navigate to="/home" />} />} />
          <Route path="/home" element={rutaProtegida(<Home />)} />
          <Route path="/estudiantes" element={rutaProtegida(<EstudiantesPendientePage />)} />
          <Route path="/ejercicios" element={rutaProtegida(<HistorialEjerciciosPage />)} />
          <Route path="/ejercicios/:id" element={rutaProtegida(<DetalleEjercicioPage />)} />
          <Route path="/resultados" element={rutaProtegida(<ResultadosPage />)} />
          <Route
            path="/recursos"
            element={rutaProtegida(<RecursosPage />, PERMISOS.RECURSOS_CONSULTAR)}
          />
          <Route
            path="*"
            element={rutaProtegida(
              <ConsultaShell>
                <EstadoVacio
                  icon={<Search size={24} aria-hidden />}
                  title="Página no encontrada"
                  description="La ruta no existe o ya no está disponible."
                />
              </ConsultaShell>
            )}
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
