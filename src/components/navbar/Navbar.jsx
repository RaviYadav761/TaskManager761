import React from "react";
import {
  Menu,
  Plus,
  Bot,
  GraduationCap,
  CheckCircle
} from "lucide-react";

const Navbar = ({
  onToggleSidebar,
  onOpenCreateModal,
  onOpenChatbot,
  onOpenSynopsis,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3 transition-colors">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Hamburger (mobile) + App Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            title="Toggle Menu"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <CheckCircle size={18} strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  TaskManager
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                  Workspace
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Smart Task Management System
              </p>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Project Synopsis Button */}
          <button
            onClick={onOpenSynopsis}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
            title="View Project Synopsis & Student Info"
          >
            <GraduationCap size={15} className="text-amber-400" />
            <span className="hidden md:inline">Project Synopsis</span>
          </button>

          {/* Smart Chatbot Toggle Button */}
          <button
            onClick={onOpenChatbot}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/40 text-xs font-semibold text-indigo-300 hover:text-indigo-200 transition-all cursor-pointer"
            title="Open Smart Task Assistant"
          >
            <Bot size={15} className="text-indigo-400" />
            <span className="hidden sm:inline">Smart Assistant</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute -top-0.5 -right-0.5"></span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5"></span>
          </button>

          {/* Add New Task Button */}
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span className="hidden sm:inline">Add Task</span>
          </button>

          {/* User Account Badge */}
          <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[11px] font-bold">
              TL
            </div>
            <div className="text-left text-[11px] leading-tight">
              <span className="font-bold text-slate-200 block">Taskly User</span>
              <span className="text-slate-500 font-medium">Workspace Member</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
