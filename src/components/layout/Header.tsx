import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, KeyRound, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { CambiarContrasenaModal } from "../CambiarContrasenaModal";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modalContrasenaAbierto, setModalContrasenaAbierto] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-white border-b border-gray-200 px-4 lg:px-6 py-3">
      <span className="lg:hidden font-semibold text-sm text-gray-800">{"simulaemergencias"}</span>
      <div className="flex-1 hidden lg:block" />

      <div className="relative">
        <button
          onClick={() => setMenuAbierto((v) => !v)}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition"
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
            {(user?.nombre ?? "?").slice(0, 1).toUpperCase()}
          </div>
          <span className="hidden sm:inline text-sm font-medium text-gray-700">{user?.nombre}</span>
          <ChevronDown size={14} className="text-gray-400" />
        </button>

        {menuAbierto && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuAbierto(false)} />
            <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
              <button
                onClick={() => {
                  setMenuAbierto(false);
                  setModalContrasenaAbierto(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-50 text-left"
              >
                <KeyRound size={14} /> Cambiar contraseña
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-red-600 hover:bg-red-50 text-left"
              >
                <LogOut size={14} /> Cerrar sesión
              </button>
            </div>
          </>
        )}
      </div>

      <CambiarContrasenaModal open={modalContrasenaAbierto} onClose={() => setModalContrasenaAbierto(false)} />
    </header>
  );
};
