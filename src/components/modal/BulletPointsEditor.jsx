import React from "react";
import { Plus, X } from "lucide-react";

const BulletPointsEditor = ({
  points = [],
  onChangePoint,
  onAddPoint,
  onDeletePoint,
  placeholder = "Add key deliverable point...",
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-neutral-800">
          Key Takeaway Points & Objectives
        </label>
        <button
          type="button"
          onClick={onAddPoint}
          className="text-xs font-bold text-neutral-800 hover:text-black flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-xl border border-neutral-200 shadow-2xs hover:bg-neutral-50 transition-all"
        >
          <Plus size={12} strokeWidth={2.5} />
          <span>Add Point</span>
        </button>
      </div>

      <div className="space-y-1.5">
        {points.map((point, idx) => (
          <div key={idx} className="flex items-center gap-2 group">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 shrink-0 ml-1" />
            <input
              type="text"
              value={point}
              onChange={(e) => onChangePoint(idx, e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-white border border-neutral-200 focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400/20 text-xs text-neutral-900 px-3 py-2 rounded-xl outline-none transition-all shadow-2xs"
            />
            <button
              type="button"
              onClick={() => onDeletePoint(idx)}
              className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Delete point"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BulletPointsEditor;
