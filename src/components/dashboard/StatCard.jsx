import React from "react";

const StatCard = ({ title, value, subtitle, icon: Icon, colorClass, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-3xl border border-neutral-200/90 bg-white transition-all duration-200 shadow-sm relative overflow-hidden ${
        onClick ? "cursor-pointer hover:scale-[1.01] hover:shadow-md" : ""
      }`}
    >
      <div className="flex items-start justify-between relative z-10">
        <div>
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">
            {title}
          </span>
          <div className="text-3xl font-black text-neutral-900 tracking-tight">{value}</div>
          {subtitle && (
            <p className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-2xl shadow-2xs ${colorClass}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
