import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle, ArrowLeft, ShieldAlert } from "lucide-react";
import { RecuperacionService } from "../services/recuperacion.service";

export const RestablecerContrasena: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") ?? "";

  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [showNueva, setShowNueva] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState("");

  const errNueva = nueva && nueva.length < 8 ? "Mínimo 8 caracteres." : "";
  const errConfirmar = confirmar && nueva !== confirmar ? "Las contraseñas no coinciden." : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("El enlace no contiene un token válido.");
      return;
    }
    if (nueva.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (nueva !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await RecuperacionService.restablecer(token, nueva);
      setExito(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 overflow-hidden p-4">
        <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="text-red-500" size={26} />
          </div>
          <p className="font-bold text-gray-900 mb-1">Enlace inválido</p>
          <p className="text-[13px] text-gray-500 mb-5">Este enlace de recuperación no es válido o ya fue usado.</p>
          <Link to="/login" className="text-[13px] font-bold text-blue-600 hover:underline flex items-center justify-center gap-1">
            <ArrowLeft size={13} /> Volver al inicio de sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 overflow-hidden p-4">
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-xl shadow-xl p-8">
          {exito ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle className="text-blue-600" size={28} />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-[15px] mb-1">¡Contraseña restablecida!</p>
                <p className="text-[13px] text-gray-500">Serás redirigido al inicio de sesión en unos segundos.</p>
              </div>
              <Link to="/login" className="text-[13px] font-bold text-blue-600 hover:underline flex items-center gap-1">
                <ArrowLeft size={13} /> Ir al inicio de sesión
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-[17px] font-bold text-gray-900 mb-1">Nueva contraseña</h2>
                <p className="text-[13px] text-gray-500">Ingresa y confirma tu nueva contraseña.</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-[12px] text-red-700 font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nueva contraseña</label>
                  <div className="relative">
                    <input
                      type={showNueva ? "text" : "password"}
                      value={nueva}
                      onChange={(e) => setNueva(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      autoComplete="new-password"
                      className={`w-full px-4 py-2 pr-10 border rounded-lg text-[14px] outline-none focus:ring-2 transition ${
                        errNueva ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                      }`}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowNueva((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNueva ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errNueva && <p className="mt-1 text-[12px] text-red-600">{errNueva}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar contraseña</label>
                  <div className="relative">
                    <input
                      type={showConf ? "text" : "password"}
                      value={confirmar}
                      onChange={(e) => setConfirmar(e.target.value)}
                      placeholder="Repite la contraseña"
                      autoComplete="new-password"
                      className={`w-full px-4 py-2 pr-10 border rounded-lg text-[14px] outline-none focus:ring-2 transition ${
                        errConfirmar ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                      }`}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowConf((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConf ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errConfirmar && <p className="mt-1 text-[12px] text-red-600">{errConfirmar}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading || !!errNueva || !!errConfirmar}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition text-[14px] cursor-pointer"
                >
                  {loading ? "Guardando..." : "Restablecer contraseña"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
