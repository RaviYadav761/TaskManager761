import React from "react";
import { X, Info, Layers, CheckCircle2, Sparkles, Cpu } from "lucide-react";

const ProjectSynopsisModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-neutral-200 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-neutral-800 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-900 p-1.5 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 border-b border-neutral-100 pb-4 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-neutral-900 flex items-center justify-center text-white shadow-xs">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-neutral-900 tracking-tight">Taskly Workspace Overview</h2>
            <p className="text-xs text-neutral-500 font-medium">Smart Task & Productivity Management Ecosystem</p>
          </div>
        </div>

        {/* Workspace Information Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 bg-[#FAF9F6] p-4 rounded-2xl border border-neutral-200/80">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold">Platform</span>
            <span className="text-sm font-bold text-neutral-900 flex items-center gap-1.5 mt-0.5">
              <Cpu size={14} className="text-neutral-700" />
              Taskly Web
            </span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold">Release Version</span>
            <span className="text-sm font-bold text-neutral-900 mt-0.5 block">v2.5 Production</span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold">Storage State</span>
            <span className="text-sm font-bold text-emerald-600 mt-0.5 block">Local Encrypted</span>
          </div>
        </div>

        {/* Project Details */}
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-bold text-neutral-900 flex items-center gap-2 mb-1.5 text-xs uppercase tracking-wider">
              <Info size={15} className="text-neutral-700" />
              System Architecture
            </h3>
            <p className="text-neutral-600 bg-[#FAF9F6] p-3.5 rounded-2xl border border-neutral-200/80 text-xs leading-relaxed font-medium">
              <strong className="text-neutral-900">Taskly Intelligent Workspace</strong> — A high-performance productivity system built for modern professionals, featuring interactive 3D line stack previews, integrated focus timers, rich multimedia notes, and an embedded TaskBot AI assistant.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-neutral-900 flex items-center gap-2 mb-1.5 text-xs uppercase tracking-wider">
              <Layers size={15} className="text-neutral-700" />
              Technology Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white text-neutral-800 border border-neutral-200 rounded-xl text-xs font-semibold shadow-2xs">React 19</span>
              <span className="px-3 py-1 bg-white text-neutral-800 border border-neutral-200 rounded-xl text-xs font-semibold shadow-2xs">Tailwind CSS</span>
              <span className="px-3 py-1 bg-white text-neutral-800 border border-neutral-200 rounded-xl text-xs font-semibold shadow-2xs">Vite 6</span>
              <span className="px-3 py-1 bg-white text-neutral-800 border border-neutral-200 rounded-xl text-xs font-semibold shadow-2xs">Lucide Icons</span>
              <span className="px-3 py-1 bg-white text-neutral-800 border border-neutral-200 rounded-xl text-xs font-semibold shadow-2xs">LocalStorage Sync</span>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-neutral-900 flex items-center gap-2 mb-2 text-xs uppercase tracking-wider">
              <CheckCircle2 size={15} className="text-emerald-600" />
              Key Features
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-700">
              <li className="flex items-center gap-2 bg-[#FAF9F6] p-2.5 rounded-xl border border-neutral-200/60 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-900"></span>
                Task Creation, In-place Editing & Deletion
              </li>
              <li className="flex items-center gap-2 bg-[#FAF9F6] p-2.5 rounded-xl border border-neutral-200/60 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-900"></span>
                High, Medium & Low Priorities
              </li>
              <li className="flex items-center gap-2 bg-[#FAF9F6] p-2.5 rounded-xl border border-neutral-200/60 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-900"></span>
                Categories, Due Dates & Time Ranges
              </li>
              <li className="flex items-center gap-2 bg-[#FAF9F6] p-2.5 rounded-xl border border-neutral-200/60 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-900"></span>
                Multi-criteria Search, Filter & Sort
              </li>
              <li className="flex items-center gap-2 bg-[#FAF9F6] p-2.5 rounded-xl border border-neutral-200/60 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-900"></span>
                Focus Timer with Stats & Sound FX
              </li>
              <li className="flex items-center gap-2 bg-[#FAF9F6] p-2.5 rounded-xl border border-neutral-200/60 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-900"></span>
                TaskBot AI Assistant with Structured Actions
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-neutral-900 hover:bg-black text-white rounded-2xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSynopsisModal;
