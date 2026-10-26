import React, { useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  Key,
  CheckSquare,
  Clock,
  Image as ImageIcon,
  Link2,
} from "lucide-react";

const NoteToolbar = ({
  isBold,
  onToggleBold,
  isItalic,
  onToggleItalic,
  isUnderline,
  onToggleUnderline,
  onToggleKeySection,
  onToggleChecklistSection,
  onToggleClosingRemarks,
  onImageUpload,
  onInsertLink,
}) => {
  const fileInputRef = useRef(null);

  return (
    <div className="flex items-center gap-2 py-2 px-3 bg-[#FAF9F6] rounded-2xl border border-neutral-200/90 mb-6 text-neutral-600 overflow-x-auto no-scrollbar">
      {/* Bold Toggle */}
      <button
        type="button"
        onClick={onToggleBold}
        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer font-bold ${
          isBold
            ? "bg-neutral-900 text-white shadow-xs"
            : "hover:bg-white hover:shadow-2xs text-neutral-700"
        }`}
        title="Toggle Bold text"
      >
        <Bold size={15} />
      </button>

      {/* Italic Toggle */}
      <button
        type="button"
        onClick={onToggleItalic}
        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer italic ${
          isItalic
            ? "bg-neutral-900 text-white shadow-xs"
            : "hover:bg-white hover:shadow-2xs text-neutral-700"
        }`}
        title="Toggle Italic text"
      >
        <Italic size={15} />
      </button>

      {/* Underline Toggle */}
      <button
        type="button"
        onClick={onToggleUnderline}
        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer underline ${
          isUnderline
            ? "bg-neutral-900 text-white shadow-xs"
            : "hover:bg-white hover:shadow-2xs text-neutral-700"
        }`}
        title="Toggle Underline text"
      >
        <Underline size={15} />
      </button>

      <div className="w-[1px] h-5 bg-neutral-300 mx-1" />

      {/* Key Highlights Section Button */}
      <button
        type="button"
        onClick={onToggleKeySection}
        className="px-3 py-1.5 rounded-xl hover:bg-white hover:shadow-2xs border border-transparent hover:border-neutral-200 flex items-center gap-1.5 transition-all cursor-pointer text-xs font-bold text-neutral-800"
        title="Add Key Highlights & Takeaways section"
      >
        <Key size={14} className="text-amber-500" />
        <span>Key Highlights</span>
      </button>

      {/* Checklist Section Button */}
      <button
        type="button"
        onClick={onToggleChecklistSection}
        className="px-3 py-1.5 rounded-xl hover:bg-white hover:shadow-2xs border border-transparent hover:border-neutral-200 flex items-center gap-1.5 transition-all cursor-pointer text-xs font-bold text-neutral-800"
        title="Add Action Items & Checklist section"
      >
        <CheckSquare size={14} className="text-emerald-600" />
        <span>Checklist</span>
      </button>

      {/* Closing Remarks Button */}
      <button
        type="button"
        onClick={onToggleClosingRemarks}
        className="px-3 py-1.5 rounded-xl hover:bg-white hover:shadow-2xs border border-transparent hover:border-neutral-200 flex items-center gap-1.5 transition-all cursor-pointer text-xs font-bold text-neutral-800"
        title="Add Closing Remarks & Deadlines section"
      >
        <Clock size={14} className="text-purple-500" />
        <span>Closing Remarks</span>
      </button>

      <div className="w-[1px] h-5 bg-neutral-300 mx-1" />

      {/* Gallery Image Upload Button */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={onImageUpload}
        accept="image/*"
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="px-3 py-1.5 rounded-xl hover:bg-white hover:shadow-2xs border border-transparent hover:border-neutral-200 flex items-center gap-1.5 transition-all cursor-pointer text-xs font-bold text-neutral-800"
        title="Upload image from device / gallery"
      >
        <ImageIcon size={14} className="text-blue-500" />
        <span>Add Image</span>
      </button>

      {/* Link Button */}
      <button
        type="button"
        onClick={onInsertLink}
        className="w-8 h-8 rounded-xl hover:bg-white hover:shadow-2xs flex items-center justify-center transition-all cursor-pointer"
        title="Insert Link"
      >
        <Link2 size={15} />
      </button>
    </div>
  );
};

export default NoteToolbar;
