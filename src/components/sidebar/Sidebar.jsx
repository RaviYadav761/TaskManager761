import React from "react";
import {
  Home,
  CheckSquare,
  Calendar,
  FileText,
  BarChart2,
  Settings,
  Bot,
  Flame,
  X
} from "lucide-react";
import SidebarLogo from "./SidebarLogo";
import SidebarItem from "./SidebarItem";
import SidebarProfile from "./SidebarProfile";

const Sidebar = ({
  activeTab,
  setActiveTab,
  onOpenSynopsis,
  onOpenChatbot,
  focusTimer,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "my-tasks", label: "My Tasks", icon: CheckSquare },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "notes", label: "Notes", icon: FileText },
    { id: "analytics", label: "Analytics", icon: BarChart2 },
  ];

  const formatTimerDisplay = (totalSeconds) => {
    if (!totalSeconds || totalSeconds < 0) return "00:00";
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    const pad = (n) => String(n).padStart(2, "0");
    if (hrs > 0) return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    return `${pad(mins)}:${pad(secs)}`;
  };

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <>
      <div>
        {/* Brand Logo & Close button on mobile */}
        <div className="flex items-center justify-between">
          <SidebarLogo />
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-2 text-neutral-500 hover:text-black rounded-xl hover:bg-neutral-200/50 transition-colors"
              title="Close menu"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5 mt-2">
          {navItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              onClick={() => handleNavClick(item.id)}
            />
          ))}

          {/* Active Global Focus Timer Pill */}
          {focusTimer?.isRunning && (
            <div
              onClick={() => handleNavClick("analytics")}
              className="mt-3 mx-1 p-2.5 rounded-2xl bg-neutral-900 text-white flex items-center justify-between cursor-pointer hover:bg-black transition-all shadow-md group animate-pulse"
              title="Focus session in progress. Click to view timer."
            >
              <div className="flex items-center gap-1.5">
                <Flame size={14} className="text-amber-400 shrink-0" />
                <span className="text-[11px] font-bold">Focus</span>
              </div>
              <span className="text-xs font-black tracking-wider text-amber-300 font-mono">
                {formatTimerDisplay(focusTimer.timeLeft)}
              </span>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-[#E5E0D6] my-4 mx-2" />

          {/* Settings */}
          <SidebarItem
            icon={Settings}
            label="Settings"
            active={activeTab === "settings"}
            onClick={() => handleNavClick("settings")}
          />

          {/* Smart Assistant Quick Item */}
          <SidebarItem
            icon={Bot}
            label="TaskBot AI"
            active={false}
            onClick={() => {
              onOpenChatbot();
              if (onCloseMobile) onCloseMobile();
            }}
          />
        </nav>
      </div>

      {/* Bottom Profile Section */}
      <div className="pt-4">
        <SidebarProfile
          onOpenSynopsis={() => {
            onOpenSynopsis();
            if (onCloseMobile) onCloseMobile();
          }}
          onOpenSettings={() => handleNavClick("settings")}
        />
      </div>
    </>
  );

  return (
    <>
      {/* 1. Desktop Sidebar - EXACT and UNTOUCHED on laptop (lg:flex) */}
      <aside className="hidden lg:flex w-56 min-w-[220px] max-w-[240px] h-screen sticky top-0 p-5 flex-col justify-between select-none shrink-0 bg-[#F5F3ED] border-r border-[#EAE5DC]/60">
        {sidebarContent}
      </aside>

      {/* 2. Mobile Drawer Sidebar - only when open on mobile */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer content */}
          <aside className="relative w-64 max-w-[80vw] h-full bg-[#F5F3ED] p-5 flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;