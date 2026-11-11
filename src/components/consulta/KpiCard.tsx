import React from "react";

type KpiCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon: React.ReactNode;
};

export const KpiCard: React.FC<KpiCardProps> = ({ label, value, hint, icon }) => (
  <article className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[12px] text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-bold text-brand-dark tabular-nums">{value}</p>
        {hint && <p className="mt-1 text-[12px] text-slate-400">{hint}</p>}
      </div>
      <div className="w-9 h-9 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center shrink-0" aria-hidden>
        {icon}
      </div>
    </div>
  </article>
);
