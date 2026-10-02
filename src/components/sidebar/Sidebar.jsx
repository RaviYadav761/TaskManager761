import React from "react";
import {
  Home,
  CheckSquare,
  Calendar,
  FileText,
  BarChart2,
  Settings,
  Bot,
  Flame
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

  return (
    <aside className="w-56 min-w-[220px] max-w-[240px] h-screen sticky top-0 p-5 flex flex-col justify-between select-none shrink-0 bg-[#F5F3ED]">
      <div>
        {/* Brand Logo */}
        <SidebarLogo />

        {/* Navigation Menu */}
        <nav className="space-y-1.5 mt-2">
          {navItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
            />
          ))}

          {/* Active Global Focus Timer Pill */}
          {focusTimer?.isRunning && (
            <div
              onClick={() => setActiveTab("analytics")}
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
            onClick={() => setActiveTab("settings")}
          />

          {/* Smart Assistant Quick Item */}
          <SidebarItem
            icon={Bot}
            label="TaskBot AI"
            active={false}
            onClick={onOpenChatbot}
          />
        </nav>
      </div>

      {/* Bottom Profile Section */}
      <div className="pt-4">
        <SidebarProfile
          onOpenSynopsis={onOpenSynopsis}
          onOpenSettings={() => setActiveTab("settings")}
        />
      </div>
    </aside>
  );
};

export default Sidebar;