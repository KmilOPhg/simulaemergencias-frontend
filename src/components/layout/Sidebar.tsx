import React from "react";
import { BarChart3 } from "lucide-react";
import { menuConfig } from "../../config/menuItems";
import { SidebarItem } from "./SidebarItem";
import { MarcaLockup } from "./MarcaLockup";

export const Sidebar: React.FC = () => (
  <aside className="fixed inset-y-0 left-0 z-20 flex w-14 lg:w-57 flex-col border-r border-slate-200 bg-white overflow-y-auto sidebar-scroll">
    <div className="flex items-center px-3 py-4 border-b border-slate-100">
      <MarcaLockup compact />
    </div>

    <nav aria-label="Navegación principal" className="flex-1 px-2 py-4 space-y-1">
      {menuConfig.map((categoria, idx) => (
        <div key={idx}>
          {categoria.title && (
            <p className="hidden lg:block px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400">
              {categoria.title}
            </p>
          )}
          <div className="space-y-1">
            {categoria.items.map((item) => (
              <SidebarItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}
    </nav>

    <div className="hidden lg:block p-3 border-t border-slate-100">
      <div className="rounded-xl bg-brand-soft px-3 py-3">
        <div className="flex items-start gap-2">
          <BarChart3 size={16} className="text-brand mt-0.5 shrink-0" aria-hidden />
          <div>
            <p className="text-[12px] font-semibold text-brand-dark">Vista de consulta</p>
            <p className="text-[11px] text-slate-500 leading-snug">Seguimiento institucional</p>
          </div>
        </div>
      </div>
    </div>
  </aside>
);
