import React, { useState, useEffect } from "react";
import { X, Check, Trash2, Tag, Palette, Star } from "lucide-react";
import { NOTE_COLORS } from "./NoteCard";

const CATEGORY_OPTIONS = [
  "Fitness",
  "Personal Growth",
  "Work & Projects",
  "Development",
  "Productivity",
  "Ideas",
  "Daily Tasks",
  "General",
];

const NoteModal = ({
  isOpen,
  onClose,
  onSaveNote,
  onDeleteNote,
  noteToEdit = null,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Fitness");
  const [color, setColor] = useState("cream");
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title || "");
      setContent(noteToEdit.content || "");
      setCategory(noteToEdit.category || "Fitness");
      setColor(noteToEdit.color || "cream");
      setIsFavorite(Boolean(noteToEdit.isFavorite));
    } else {
      setTitle("");
      setContent("");
      setCategory("Fitness");
      setColor("cream");
      setIsFavorite(false);
    }
    setError("");
  }, [noteToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please provide a note title.");
      return;
    }

    const noteData = {
      ...(noteToEdit || {}),
      id: noteToEdit ? noteToEdit.id : `note-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      category: category.trim() || "General",
      color,
      isFavorite,
      date: noteToEdit
        ? noteToEdit.date
        : new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
      updatedAt: new Date().toISOString(),
    };

    onSaveNote(noteData);
    onClose();
  };

  const handleDelete = () => {
    if (!noteToEdit) return;
    if (window.confirm(`Are you sure you want to delete "${noteToEdit.title}"?`)) {
      onDeleteNote(noteToEdit.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl p-7 text-neutral-900 relative max-h-[92vh] overflow-y-auto no-scrollbar border border-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
              {noteToEdit ? "Edit Note" : "Create New Note"}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5 font-medium">
              {noteToEdit
                ? "Update your note title, content, category, or card color"
                : "Capture your thoughts, plans, routines, and study notes"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-1.5">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Gym Routine, React Notes, Project Ideas..."
              className="w-full bg-[#F4F4F6] text-neutral-900 placeholder:text-neutral-400 rounded-xl px-4 py-3 text-sm font-medium border-none outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all"
              autoFocus
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-1.5 flex items-center gap-1.5">
              <Tag size={15} className="text-neutral-500" />
              <span>Category</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    category === cat
                      ? "bg-neutral-900 text-white shadow-xs"
                      : "bg-[#F4F4F6] text-neutral-600 hover:bg-neutral-200/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette (Card Pastel Theme) */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-1.5 flex items-center gap-1.5">
              <Palette size={15} className="text-neutral-500" />
              <span>Card Theme (Subtle Pastel)</span>
            </label>
            <div className="flex items-center gap-2.5 flex-wrap">
              {Object.values(NOTE_COLORS).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={`w-9 h-9 rounded-2xl ${c.cardBg} ${c.cardBorder} border-2 flex items-center justify-center transition-all cursor-pointer hover:scale-105 shadow-2xs ${
                    color === c.id
                      ? "ring-2 ring-neutral-900 ring-offset-2 scale-105"
                      : "opacity-80 hover:opacity-100"
                  }`}
                  title={c.label}
                >
                  {color === c.id && (
                    <Check size={14} className="text-neutral-900 stroke-[3]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Note Content */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-1.5">
              Note Content
            </label>
            <div className="bg-[#F4F4F6] rounded-2xl p-4 flex items-start gap-3 text-sm text-neutral-900 min-h-[140px]">
              <textarea
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note content here...
• Bullet points and steps
• Important thoughts
• Study summaries and checklists"
                className="bg-transparent border-none outline-none text-xs sm:text-sm text-neutral-900 font-medium w-full placeholder:text-neutral-400 resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Favorite Toggle Option */}
          <div className="flex items-center justify-between py-1 px-1">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-neutral-700 select-none">
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                  isFavorite
                    ? "bg-amber-500 text-white"
                    : "border border-neutral-300 text-transparent bg-white"
                }`}
              >
                <Star size={14} className={isFavorite ? "fill-white" : ""} />
              </div>
              <span>Mark as Favorite</span>
            </label>

            {noteToEdit && (
              <button
                type="button"
                onClick={handleDelete}
                className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1.5 transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-rose-50"
              >
                <Trash2 size={14} />
                <span>Delete Note</span>
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-105"
            >
              {noteToEdit ? "Save Changes" : "Save Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
