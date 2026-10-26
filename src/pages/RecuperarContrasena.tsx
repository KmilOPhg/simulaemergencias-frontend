import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { RecuperacionService } from "../services/recuperacion.service";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const RecuperarContrasena: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Ingresa tu correo electrónico.");
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    setLoading(true);
    try {
      await RecuperacionService.solicitar(email.trim());
      setEnviado(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 overflow-hidden p-4">
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-xl shadow-xl p-8">
          {enviado ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle className="text-blue-600" size={28} />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-[15px] mb-1">Correo enviado</p>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  Si el correo <span className="font-semibold text-gray-700">{email}</span> está registrado, recibirás
                  instrucciones para restablecer tu contraseña.
                </p>
              </div>
              <Link to="/login" className="mt-2 text-[13px] font-bold text-blue-600 hover:underline flex items-center gap-1">
                <ArrowLeft size={13} />
                Volver al inicio de sesión
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-[17px] font-bold text-gray-900 mb-1">Recuperar contraseña</h2>
                <p className="text-[13px] text-gray-500">Ingresa tu correo y te enviaremos un enlace para restablecerla.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="ejemplo@correo.com"
                      autoComplete="email"
                      className={`w-full pl-9 pr-4 py-2 border rounded-lg text-[14px] outline-none focus:ring-2 transition ${
                        error ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                      }`}
                    />
                  </div>
                  {error && <p className="mt-1.5 text-[12px] text-red-600">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition text-[14px] cursor-pointer"
                >
                  {loading ? "Enviando..." : "Enviar enlace de recuperación"}
                </button>
              </form>

              <div className="mt-5 text-center">
                <Link to="/login" className="text-[13px] font-medium text-blue-600 hover:underline flex items-center justify-center gap-1">
                  <ArrowLeft size={13} />
                  Volver al inicio de sesión
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
