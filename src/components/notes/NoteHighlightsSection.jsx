import React from "react";
import { Key, Plus, Trash2, X } from "lucide-react";

const NoteHighlightsSection = ({
  highlights = [],
  onAddPoint,
  onUpdatePoint,
  onDeletePoint,
  onRemoveSection,
}) => {
  if (!highlights || highlights.length === 0) return null;

  return (
    <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-neutral-200/90 animate-in fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Key size={14} className="text-amber-500" />
          <h4 className="font-bold text-neutral-900 text-sm">
            Key Highlights & Takeaways
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAddPoint}
            className="text-xs font-bold text-neutral-700 hover:text-black flex items-center gap-1 cursor-pointer bg-white hover:bg-neutral-50 px-2.5 py-1 rounded-lg border border-neutral-200 shadow-2xs transition-all"
          >
            <Plus size={12} />
            <span>Add Point</span>
          </button>
          <button
            type="button"
            onClick={onRemoveSection}
            className="p-1 hover:text-rose-500 text-neutral-400 transition-colors cursor-pointer"
            title="Remove Key Highlights section"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {highlights.map((pt, idx) => (
          <div key={idx} className="flex items-center gap-2 group">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-800 shrink-0" />
            <input
              type="text"
              value={pt}
              onChange={(e) => onUpdatePoint(idx, e.target.value)}
              placeholder="Type takeaway point..."
              className="flex-1 bg-transparent border-b border-transparent focus:border-neutral-300 outline-none text-xs text-neutral-800 font-medium focus:bg-white px-2 py-1 rounded transition-colors"
            />
            <button
              type="button"
              onClick={() => onDeletePoint(idx)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 text-neutral-400 transition-opacity cursor-pointer"
              title="Delete point"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteHighlightsSection;
