import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, KeyRound, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { CambiarContrasenaModal } from "../CambiarContrasenaModal";
import { APP_NAME } from "../../constants/marca.constants";

const inicialesDe = (nombre: string): string => {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return `${partes[0][0]}${partes[1][0]}`.toUpperCase();
};

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modalContrasenaAbierto, setModalContrasenaAbierto] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const iniciales = inicialesDe(user?.nombre ?? "");

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-white/90 backdrop-blur border-b border-slate-200 px-4 lg:px-6 py-3">
      <span className="lg:hidden font-semibold text-sm text-brand-dark">{APP_NAME}</span>
      <div className="flex-1 hidden lg:block" />

      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuAbierto((v) => !v)}
          aria-expanded={menuAbierto}
          aria-haspopup="menu"
          aria-label={`Menú de ${user?.nombre ?? "usuario"}`}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition"
        >
          <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-[11px] font-bold">
            {iniciales}
          </div>
          <span className="hidden sm:inline text-sm font-medium text-slate-700">{user?.nombre}</span>
          <ChevronDown size={14} className="text-slate-400" aria-hidden />
        </button>

        {menuAbierto && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuAbierto(false)} />
            <div role="menu" className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuAbierto(false);
                  setModalContrasenaAbierto(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-700 hover:bg-slate-50 text-left"
              >
                <KeyRound size={14} aria-hidden /> Cambiar contraseña
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-red-600 hover:bg-red-50 text-left"
              >
                <LogOut size={14} aria-hidden /> Cerrar sesión
              </button>
            </div>
          </>
        )}
      </div>

      <CambiarContrasenaModal open={modalContrasenaAbierto} onClose={() => setModalContrasenaAbierto(false)} />
    </header>
  );
};
