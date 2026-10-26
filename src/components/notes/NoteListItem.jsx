import React from "react";
import { Star } from "lucide-react";

const NoteListItem = ({ note, isSelected, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
        isSelected
          ? "bg-[#F3F6FD] border-[#DCE6FC] shadow-2xs scale-[1.01]"
          : "bg-white hover:bg-neutral-50 border-neutral-100"
      }`}
    >
      {/* Title + Favorite Star */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3
          className={`text-sm font-bold tracking-tight truncate ${
            isSelected ? "text-neutral-900 font-extrabold" : "text-neutral-800"
          }`}
        >
          {note.title}
        </h3>

        {note.isFavorite && (
          <Star size={14} className="fill-amber-400 text-amber-500 shrink-0 mt-0.5" />
        )}
      </div>

      {/* Snippet (2 lines) */}
      <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed mb-2.5 font-normal">
        {note.snippet || note.introText || "No additional text"}
      </p>

      {/* Category Pill Tag + Timestamp */}
      <div className="flex items-center justify-between text-[11px]">
        <span
          className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
            note.categoryBg || "bg-[#F3F4F6] text-[#4B5563]"
          }`}
        >
          {note.category}
        </span>

        <span className="text-neutral-400 font-medium">
          {note.timeAgo || "Today"}
        </span>
      </div>
    </div>
  );
};

export default NoteListItem;
