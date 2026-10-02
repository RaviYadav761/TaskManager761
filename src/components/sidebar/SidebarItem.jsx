import React from "react";

const SidebarItem = ({
  icon: Icon,
  label,
  active = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full
        flex items-center gap-3.5
        px-4 py-3
        rounded-2xl
        text-sm font-semibold
        transition-all duration-150
        cursor-pointer
        ${
          active
            ? "bg-[#212327] text-white shadow-sm"
            : "text-[#353942] hover:text-black hover:bg-[#EAE5DC]/60"
        }
      `}
    >
      <Icon size={19} strokeWidth={active ? 2.5 : 2} className="shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  );
};

export default SidebarItem;