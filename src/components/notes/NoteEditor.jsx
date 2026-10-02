import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Pin,
  Bell,
  Archive,
  SquarePlus,
  Palette,
  Baseline,
  MoreVertical,
  Check,
  Trash2,
  Copy,
  Clock,
  CheckSquare
} from "lucide-react";
import { NOTE_COLORS } from "./NoteCard";

const NoteEditor = ({
  note = null,
  onSave,
  onDelete,
  onBack,
}) => {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [color, setColor] = useState(note?.color || "cream");
  const [category, setCategory] = useState(note?.category || "General");
  const [isFavorite, setIsFavorite] = useState(Boolean(note?.isFavorite));
  const [reminder, setReminder] = useState(note?.reminder || null);

  // Popover menus
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isFormatMenuOpen, setIsFormatMenuOpen] = useState(false);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const titleInputRef = useRef(null);
  const contentInputRef = useRef(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
      setColor(note.color || "cream");
      setCategory(note.category || "General");
      setIsFavorite(Boolean(note.isFavorite));
      setReminder(note.reminder || null);
    } else {
      setTitle("");
      setContent("");
      setColor("cream");
      setCategory("General");
      setIsFavorite(false);
      setReminder(null);
    }
  }, [note]);

  // Auto focus on title when opening a new note, or content when editing
  useEffect(() => {
    if (!note?.title) {
      titleInputRef.current?.focus();
    }
  }, [note]);

  // Helper to persist changes
  const saveCurrentState = (customOverrides = {}) => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    // If completely empty and new, don't create ghost note
    if (!trimmedTitle && !trimmedContent && !note) {
      return;
    }

    const noteData = {
      ...(note || {}),
      id: note ? note.id : `note-${Date.now()}`,
      title: trimmedTitle || "Untitled Note",
      content: trimmedContent,
      color: customOverrides.color !== undefined ? customOverrides.color : color,
      category: customOverrides.category !== undefined ? customOverrides.category : category,
      isFavorite: customOverrides.isFavorite !== undefined ? customOverrides.isFavorite : isFavorite,
      reminder: customOverrides.reminder !== undefined ? customOverrides.reminder : reminder,
      date: note
        ? note.date
        : new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
      updatedAt: new Date().toISOString(),
    };

    onSave(noteData);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 1500);
  };

  const handleBack = () => {
    saveCurrentState();
    onBack();
  };

  const handleTogglePin = () => {
    const next = !isFavorite;
    setIsFavorite(next);
    saveCurrentState({ isFavorite: next });
  };

  const handleSetReminder = () => {
    const next = reminder ? null : "Today, 8:00 PM";
    setReminder(next);
    saveCurrentState({ reminder: next });
  };

  const handleSelectColor = (colorId) => {
    setColor(colorId);
    setIsPaletteOpen(false);
    saveCurrentState({ color: colorId });
  };

  const handleInsertText = (prefix) => {
    setContent((prev) => {
      if (prev.endsWith("\n") || !prev) {
        return prev + prefix;
      }
      return prev + "\n" + prefix;
    });
    setIsAddMenuOpen(false);
    contentInputRef.current?.focus();
  };

  const handleDelete = () => {
    if (!note) {
      onBack();
      return;
    }
    if (window.confirm(`Are you sure you want to delete "${note.title || "this note"}"?`)) {
      onDelete(note.id);
      onBack();
    }
  };

  return (
    <div className="flex-1 h-screen bg-[#0E0E10] text-white flex flex-col justify-between p-6 lg:p-8 overflow-y-auto no-scrollbar select-none relative">
      {/* 1. TOP BAR: Back Button (Left) + Action Buttons (Right) */}
      <div className="flex items-center justify-between mb-8">
        {/* Back Button */}
        <button
          type="button"
          onClick={handleBack}
          className="w-11 h-11 rounded-full bg-[#1F1F23] hover:bg-[#2A2A30] text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
          title="Back to notes (auto-saves)"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>

        {/* Right Action Icons: Pin, Bell (Reminder), Archive / Save */}
        <div className="flex items-center gap-3">
          {/* Saved feedback badge */}
          {savedFeedback && (
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full animate-in fade-in">
              Saved
            </span>
          )}

          {/* Pin Button */}
          <button
            type="button"
            onClick={handleTogglePin}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-xs ${
              isFavorite
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "bg-[#1F1F23] hover:bg-[#2A2A30] text-neutral-300 hover:text-white"
            }`}
            title={isFavorite ? "Unpin note" : "Pin note"}
          >
            <Pin size={18} className={isFavorite ? "fill-amber-400" : ""} />
          </button>

          {/* Reminder / Bell Button */}
          <button
            type="button"
            onClick={handleSetReminder}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-xs ${
              reminder
                ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                : "bg-[#1F1F23] hover:bg-[#2A2A30] text-neutral-300 hover:text-white"
            }`}
            title={reminder ? `Reminder: ${reminder}` : "Add reminder"}
          >
            <Bell size={18} className={reminder ? "fill-indigo-400" : ""} />
          </button>

          {/* Archive / Save Note Button */}
          <button
            type="button"
            onClick={handleBack}
            className="w-11 h-11 rounded-2xl bg-[#1F1F23] hover:bg-[#2A2A30] text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
            title="Save and return"
          >
            <Archive size={18} />
          </button>
        </div>
      </div>

      {/* 2. MAIN BODY: Title + Note Content matching exact screenshot layout */}
      <div className="flex-1 max-w-4xl w-full mx-auto flex flex-col justify-start py-2">
        {/* Title input with subtle vertical indicator */}
        <div className="flex items-center gap-2 mb-6">
          <span className="w-1 h-9 bg-neutral-400 rounded-full shrink-0" />
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => saveCurrentState()}
            placeholder="Title"
            className="w-full bg-transparent border-none outline-none text-3xl sm:text-4xl lg:text-5xl font-semibold text-neutral-100 placeholder:text-neutral-500 tracking-tight"
          />
        </div>

        {/* Note textarea with subtle vertical indicator */}
        <div className="flex items-start gap-2 flex-1">
          <span className="w-1 h-6 bg-neutral-600 rounded-full shrink-0 mt-1" />
          <textarea
            ref={contentInputRef}
            rows={14}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={() => saveCurrentState()}
            placeholder="Note"
            className="w-full bg-transparent border-none outline-none text-lg sm:text-xl font-normal text-neutral-300 placeholder:text-neutral-600 resize-none leading-relaxed min-h-[360px]"
          />
        </div>
      </div>

      {/* 3. BOTTOM TOOLBAR: Left icons ([+], [Palette], [A]) + Right menu ([⋮]) */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-800/40 relative">
        {/* Bottom Left Tools */}
        <div className="flex items-center gap-3">
          {/* [+] Add Checklist / Bullets / Time */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsAddMenuOpen(!isAddMenuOpen);
                setIsPaletteOpen(false);
                setIsFormatMenuOpen(false);
                setIsOptionsMenuOpen(false);
              }}
              className="w-11 h-11 rounded-2xl bg-[#1F1F23] hover:bg-[#2A2A30] text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              title="Add item or checklist"
            >
              <SquarePlus size={20} />
            </button>

            {isAddMenuOpen && (
              <div className="absolute left-0 bottom-full mb-2 w-48 bg-[#18181B] rounded-2xl shadow-2xl border border-neutral-700/60 py-2 z-30 animate-in fade-in zoom-in-95">
                <button
                  type="button"
                  onClick={() => handleInsertText("☐ ")}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-neutral-200 hover:bg-neutral-800 flex items-center gap-2.5 cursor-pointer"
                >
                  <CheckSquare size={15} className="text-neutral-400" />
                  <span>Checklist item</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertText("• ")}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-neutral-200 hover:bg-neutral-800 flex items-center gap-2.5 cursor-pointer"
                >
                  <span className="w-3.5 text-center font-bold text-neutral-400">•</span>
                  <span>Bullet point</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertText(`[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] `)}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-neutral-200 hover:bg-neutral-800 flex items-center gap-2.5 cursor-pointer"
                >
                  <Clock size={15} className="text-neutral-400" />
                  <span>Insert timestamp</span>
                </button>
              </div>
            )}
          </div>

          {/* [🎨] Palette Color Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsPaletteOpen(!isPaletteOpen);
                setIsAddMenuOpen(false);
                setIsFormatMenuOpen(false);
                setIsOptionsMenuOpen(false);
              }}
              className="w-11 h-11 rounded-2xl bg-[#1F1F23] hover:bg-[#2A2A30] text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              title="Card color theme"
            >
              <Palette size={20} />
            </button>

            {isPaletteOpen && (
              <div className="absolute left-0 bottom-full mb-2 p-3 bg-[#18181B] rounded-2xl shadow-2xl border border-neutral-700/60 z-30 flex items-center gap-2 animate-in fade-in zoom-in-95">
                {Object.values(NOTE_COLORS).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectColor(c.id)}
                    className={`w-7 h-7 rounded-full ${c.cardBg} border-2 border-neutral-600 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                      color === c.id ? "ring-2 ring-white scale-110" : ""
                    }`}
                    title={c.label}
                  >
                    {color === c.id && <Check size={12} className="text-neutral-900 stroke-[3]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* [<u>A</u>] Text Styling */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsFormatMenuOpen(!isFormatMenuOpen);
                setIsAddMenuOpen(false);
                setIsPaletteOpen(false);
                setIsOptionsMenuOpen(false);
              }}
              className="w-11 h-11 rounded-2xl bg-[#1F1F23] hover:bg-[#2A2A30] text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              title="Text formatting"
            >
              <Baseline size={20} />
            </button>

            {isFormatMenuOpen && (
              <div className="absolute left-0 bottom-full mb-2 w-40 bg-[#18181B] rounded-2xl shadow-2xl border border-neutral-700/60 py-2 z-30 animate-in fade-in zoom-in-95">
                <button
                  type="button"
                  onClick={() => handleInsertText("## ")}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-neutral-200 hover:bg-neutral-800 cursor-pointer"
                >
                  Heading (H2)
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertText("> ")}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-neutral-200 hover:bg-neutral-800 cursor-pointer"
                >
                  Blockquote
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertText("1. ")}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-neutral-200 hover:bg-neutral-800 cursor-pointer"
                >
                  Numbered List
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Right Menu [⋮] */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsOptionsMenuOpen(!isOptionsMenuOpen);
              setIsAddMenuOpen(false);
              setIsPaletteOpen(false);
              setIsFormatMenuOpen(false);
            }}
            className="w-11 h-11 rounded-2xl bg-[#1F1F23] hover:bg-[#2A2A30] text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
            title="Options"
          >
            <MoreVertical size={20} />
          </button>

          {isOptionsMenuOpen && (
            <div className="absolute right-0 bottom-full mb-2 w-44 bg-[#18181B] rounded-2xl shadow-2xl border border-neutral-700/60 py-1.5 z-30 animate-in fade-in zoom-in-95">
              <button
                type="button"
                onClick={() => {
                  setIsOptionsMenuOpen(false);
                  navigator.clipboard.writeText(`${title}\n\n${content}`);
                  alert("Note copied to clipboard!");
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-semibold text-neutral-200 hover:bg-neutral-800 flex items-center gap-2.5 cursor-pointer"
              >
                <Copy size={14} className="text-neutral-400" />
                <span>Copy Note</span>
              </button>

              <div className="border-t border-neutral-700/50 my-1" />

              <button
                type="button"
                onClick={() => {
                  setIsOptionsMenuOpen(false);
                  handleDelete();
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-semibold text-rose-400 hover:bg-rose-950/40 flex items-center gap-2.5 cursor-pointer"
              >
                <Trash2 size={14} className="text-rose-400" />
                <span>Delete Note</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
