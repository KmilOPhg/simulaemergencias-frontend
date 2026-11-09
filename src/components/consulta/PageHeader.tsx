import React from "react";

type PageHeaderProps = {
  kicker?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export const PageHeader: React.FC<PageHeaderProps> = ({ kicker, title, description, actions }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
    <div className="min-w-0">
      {kicker && (
        <p className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 mb-1">{kicker}</p>
      )}
      <h1 className="text-2xl lg:text-[28px] font-bold text-brand-dark tracking-tight">{title}</h1>
      {description && <p className="mt-1 text-sm text-slate-500 max-w-2xl">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
  </div>
);
