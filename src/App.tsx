import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import { PERMISOS } from "./constants/permisos.constants";
import { Login } from "./pages/Login";
import { RecuperarContrasena } from "./pages/RecuperarContrasena";
import { Home } from "./pages/Home";
import "./index.css";

const RestablecerContrasena = lazy(() =>
  import("./pages/RestablecerContrasena").then((m) => ({ default: m.RestablecerContrasena }))
);
const RecursosPage = lazy(() => import("./pages/recursos/RecursosPage").then((m) => ({ default: m.RecursosPage })));

const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
  </div>
);

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex min-h-screen overflow-x-hidden bg-[#f4f5f7]">
    <Sidebar />
    <div className="flex min-h-screen min-w-0 flex-1 flex-col ml-14 lg:ml-57">
      <Header />
      <main className="min-w-0 flex flex-col flex-1 w-full">
        <Suspense fallback={<PageLoader />}>{children}</Suspense>
      </main>
      <Footer />
    </div>
  </div>
);

const App: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
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
          {/* Ambas rutas apuntan al mismo componente: cubre tanto el link con ?token=
              (recuperación propia) como el link con #access_token= (Supabase Auth). */}
          <Route path="/restablecer-contrasena" element={<RestablecerContrasena />} />
          <Route path="/reset-password" element={<RestablecerContrasena />} />

          <Route path="/" element={<ProtectedRoute element={<Navigate to="/home" />} />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute
                element={
                  <AppLayout>
                    <Home />
                  </AppLayout>
                }
              />
            }
          />
          <Route
            path="/recursos"
            element={
              <ProtectedRoute
                permiso={PERMISOS.RECURSOS_CONSULTAR}
                element={
                  <AppLayout>
                    <RecursosPage />
                  </AppLayout>
                }
              />
            }
          />
          <Route
            path="*"
            element={
              <ProtectedRoute
                element={
                  <AppLayout>
                    <div className="p-10 text-gray-400">Página no encontrada</div>
                  </AppLayout>
                }
              />
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
