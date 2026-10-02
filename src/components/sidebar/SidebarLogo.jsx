import React from "react";
import { Check } from "lucide-react";

const SidebarLogo = () => {
  return (
    <div className="flex items-center gap-3 px-2 py-4 mb-4">
      <div className="w-8 h-8 rounded-lg border-[2.5px] border-neutral-900 flex items-center justify-center">
        <Check size={18} strokeWidth={3.5} className="text-neutral-900" />
      </div>
      <span className="text-2xl font-black tracking-tight text-neutral-900">
        Taskly
      </span>
    </div>
  );
};

export default SidebarLogo;