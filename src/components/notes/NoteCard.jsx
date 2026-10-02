import React, { useState, useRef, useEffect } from "react";
import { Star, MoreVertical, Edit3, Trash2, Calendar, Tag } from "lucide-react";

// Subtle pastel color styles matching Taskly aesthetic
export const NOTE_COLORS = {
  cream: {
    id: "cream",
    label: "Vanilla",
    cardBg: "bg-[#FCFBF7]",
    cardBorder: "border-[#EDE9DF]",
    badgeBg: "bg-[#F3EFE6]",
    badgeText: "text-[#6E5D3F]",
    dotBg: "bg-[#D8CEB9]",
  },
  mint: {
    id: "mint",
    label: "Mint",
    cardBg: "bg-[#F3FAF5]",
    cardBorder: "border-[#E1F2E6]",
    badgeBg: "bg-[#E0F2E9]",
    badgeText: "text-[#1E7245]",
    dotBg: "bg-[#9AE6B4]",
  },
  sky: {
    id: "sky",
    label: "Sky",
    cardBg: "bg-[#F4F8FA]",
    cardBorder: "border-[#E2EDF3]",
    badgeBg: "bg-[#DDEEF8]",
    badgeText: "text-[#20698E]",
    dotBg: "bg-[#BAE6FD]",
  },
  lavender: {
    id: "lavender",
    label: "Lavender",
    cardBg: "bg-[#F8F6FC]",
    cardBorder: "border-[#EBE6F7]",
    badgeBg: "bg-[#EFE8FA]",
    badgeText: "text-[#6B46C1]",
    dotBg: "bg-[#DDD6FE]",
  },
  peach: {
    id: "peach",
    label: "Peach",
    cardBg: "bg-[#FCF6F2]",
    cardBorder: "border-[#F6E8DF]",
    badgeBg: "bg-[#FAE8DE]",
    badgeText: "text-[#B45309]",
    dotBg: "bg-[#FED7AA]",
  },
  lemon: {
    id: "lemon",
    label: "Lemon",
    cardBg: "bg-[#FEFCE8]",
    cardBorder: "border-[#FEF08A]/70",
    badgeBg: "bg-[#FEF9C3]",
    badgeText: "text-[#854D0E]",
    dotBg: "bg-[#FDE047]",
  },
  white: {
    id: "white",
    label: "Classic",
    cardBg: "bg-white",
    cardBorder: "border-neutral-200/80",
    badgeBg: "bg-neutral-100",
    badgeText: "text-neutral-700",
    dotBg: "bg-neutral-300",
  },
};

const NoteCard = ({ note, onEdit, onDelete, onToggleFavorite }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close three-dot menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const colorConfig = NOTE_COLORS[note.color] || NOTE_COLORS.cream;

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    if (window.confirm(`Are you sure you want to delete "${note.title}"?`)) {
      onDelete(note.id);
    }
  };

  return (
    <div
      onClick={() => onEdit(note)}
      className={`${colorConfig.cardBg} ${colorConfig.cardBorder} rounded-3xl p-5 sm:p-6 border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 relative flex flex-col justify-between min-h-[220px] cursor-pointer group shadow-xs`}
    >
      <div>
        {/* Top Header: Title + Star + Three-dot Menu */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`w-2.5 h-2.5 rounded-full ${colorConfig.dotBg} shrink-0`} />
            <h3 className="font-bold text-base text-neutral-900 tracking-tight truncate">
              {note.title}
            </h3>
          </div>

          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
            {/* Star Favorite Button */}
            <button
              type="button"
              onClick={() => onToggleFavorite(note.id)}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                note.isFavorite
                  ? "text-amber-500 hover:bg-amber-50"
                  : "text-neutral-300 hover:text-amber-500 hover:bg-black/5 opacity-60 group-hover:opacity-100"
              }`}
              title={note.isFavorite ? "Remove from favorites" : "Mark as favorite"}
            >
              <Star
                size={17}
                className={note.isFavorite ? "fill-amber-400 text-amber-500" : ""}
                strokeWidth={note.isFavorite ? 1.5 : 2}
              />
            </button>

            {/* Three-dot Menu Button */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-800 hover:bg-black/5 transition-colors cursor-pointer"
                title="Note options"
              >
                <MoreVertical size={16} />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-2xl shadow-xl border border-neutral-100 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onEdit(note);
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Edit3 size={14} className="text-neutral-500" />
                    <span>Edit Note</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onToggleFavorite(note.id);
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Star
                      size={14}
                      className={note.isFavorite ? "fill-amber-400 text-amber-500" : "text-neutral-500"}
                    />
                    <span>{note.isFavorite ? "Unfavorite" : "Favorite"}</span>
                  </button>

                  <div className="border-t border-neutral-100 my-1" />

                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    className="w-full px-3.5 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Trash2 size={14} className="text-rose-500" />
                    <span>Delete Note</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Preview */}
        <p className="text-xs text-neutral-600 font-normal leading-relaxed line-clamp-4 whitespace-pre-line my-3">
          {note.content}
        </p>
      </div>

      {/* Footer: Date + Category Badge */}
      <div className="pt-3 border-t border-neutral-900/5 flex items-center justify-between gap-2 mt-auto">
        <span className="text-[11px] font-medium text-neutral-400 flex items-center gap-1.5">
          <Calendar size={12} className="text-neutral-400" />
          <span>{note.date || "Today"}</span>
        </span>

        {note.category && (
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-tight ${colorConfig.badgeBg} ${colorConfig.badgeText}`}
          >
            {note.category}
          </span>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
