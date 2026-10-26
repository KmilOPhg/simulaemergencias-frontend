import React from "react";

export const Footer: React.FC = () => (
  <footer className="px-4 lg:px-6 py-3 text-center text-[11px] text-gray-400 border-t border-gray-100">
    © {new Date().getFullYear()} {"simulaemergencias"} — generado con create-app-fullstack
  </footer>
);
