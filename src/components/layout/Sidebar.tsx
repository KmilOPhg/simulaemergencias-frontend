import React from "react";
import { menuConfig } from "../../config/menuItems";
import { SidebarItem } from "./SidebarItem";

export const Sidebar: React.FC = () => (
  <aside className="fixed inset-y-0 left-0 z-20 flex w-14 lg:w-57 flex-col bg-slate-900 overflow-y-auto sidebar-scroll">
    <div className="flex items-center gap-2 px-3 py-4 border-b border-slate-800">
      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
        {"simulaemergencias".slice(0, 1).toUpperCase()}
      </div>
      <span className="hidden lg:inline text-white font-semibold text-sm truncate">{"simulaemergencias"}</span>
    </div>

    <nav className="flex-1 px-2 py-4 space-y-6">
      {menuConfig.map((categoria, idx) => (
        <div key={idx}>
          {categoria.title && (
            <p className="hidden lg:block px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-500">{categoria.title}</p>
          )}
          <div className="space-y-1">
            {categoria.items.map((item) => (
              <SidebarItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}
    </nav>
  </aside>
);
