import React from "react";
import { CheckSquare, Square, Plus, Trash2, X } from "lucide-react";

const NoteChecklistSection = ({
  actionItems = [],
  onToggleItem,
  onUpdateItemText,
  onAddItem,
  onDeleteItem,
  onRemoveSection,
}) => {
  if (!actionItems || actionItems.length === 0) return null;

  return (
    <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-neutral-200/90 animate-in fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <CheckSquare size={14} className="text-emerald-600" />
          <h4 className="font-bold text-neutral-900 text-sm">
            Action Items & Checklist
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAddItem}
            className="text-xs font-bold text-neutral-700 hover:text-black flex items-center gap-1 cursor-pointer bg-white hover:bg-neutral-50 px-2.5 py-1 rounded-lg border border-neutral-200 shadow-2xs transition-all"
          >
            <Plus size={12} />
            <span>Add Item</span>
          </button>
          <button
            type="button"
            onClick={onRemoveSection}
            className="p-1 hover:text-rose-500 text-neutral-400 transition-colors cursor-pointer"
            title="Remove Checklist section"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {actionItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2.5 group text-xs bg-white p-2.5 rounded-xl border border-neutral-200/80 shadow-2xs"
          >
            {/* Interactive checkbox */}
            <button
              type="button"
              onClick={() => onToggleItem(item.id)}
              className="cursor-pointer"
              title={item.done ? "Mark pending" : "Mark completed"}
            >
              {item.done ? (
                <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <CheckSquare size={14} className="stroke-[2.5]" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-md border border-neutral-300 hover:border-neutral-700 bg-white flex items-center justify-center shrink-0 transition-colors">
                  <Square size={14} className="text-transparent" />
                </div>
              )}
            </button>

            {/* Editable item text */}
            <input
              type="text"
              value={item.text}
              onChange={(e) => onUpdateItemText(item.id, e.target.value)}
              placeholder="Type action item..."
              className={`flex-1 bg-transparent border-b border-transparent focus:border-neutral-300 outline-none px-2 py-0.5 rounded transition-colors text-xs font-medium ${
                item.done
                  ? "line-through text-neutral-400"
                  : "text-neutral-800"
              }`}
            />

            {/* Delete item button */}
            <button
              type="button"
              onClick={() => onDeleteItem(item.id)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 text-neutral-400 transition-opacity cursor-pointer"
              title="Remove item"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteChecklistSection;
