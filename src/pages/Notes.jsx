import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import {
  Star,
  Share2,
  Trash2,
  Check,
  ChevronLeft,
  Clock,
} from "lucide-react";
import NotesSidebarList from "../components/notes/NotesSidebarList";
import NoteToolbar from "../components/notes/NoteToolbar";
import NoteHighlightsSection from "../components/notes/NoteHighlightsSection";
import NoteChecklistSection from "../components/notes/NoteChecklistSection";
import NoteImageGallery from "../components/notes/NoteImageGallery";
import ImageLightboxModal from "../components/notes/ImageLightboxModal";
import { CATEGORY_STYLES, INITIAL_NOTES } from "../data/notesData";
import { STORAGE_KEYS, getStorageItem, setStorageItem } from "../utils/storage";

const Notes = ({
  embedded = false,
  activeTab = "notes",
  setActiveTab = () => {},
  onOpenSynopsis = () => {},
  onOpenChatbot = () => {},
}) => {
  // Load notes from localStorage or initialize with seed notes
  const [notes, setNotes] = useState(() => {
    const saved = getStorageItem(STORAGE_KEYS.NOTES, null);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    return INITIAL_NOTES;
  });

  const [selectedNoteId, setSelectedNoteId] = useState(() => {
    return notes[0]?.id || "note-retro-takeaways";
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [mobileNotesView, setMobileNotesView] = useState("list"); // 'list' | 'detail'

  // Text formatting states
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [activeLightboxImage, setActiveLightboxImage] = useState(null);

  // Sync notes to localStorage
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.NOTES, notes);
  }, [notes]);

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || notes[0] || null;

  // Filter and sort notes
  const filteredNotes = notes
    .filter((n) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.snippet?.toLowerCase().includes(q) ||
        n.category?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortAsc) return a.title.localeCompare(b.title);
      return 0;
    });

  // Actions
  const handleToggleFavorite = (noteId) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, isFavorite: !n.isFavorite } : n))
    );
  };

  const handleToggleActionItem = (noteId, actionId) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === noteId && n.actionItems) {
          return {
            ...n,
            actionItems: n.actionItems.map((item) =>
              item.id === actionId ? { ...item, done: !item.done } : item
            ),
          };
        }
        return n;
      })
    );
  };

  const handleUpdateActionItemText = (noteId, actionId, newText) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === noteId && n.actionItems) {
          return {
            ...n,
            actionItems: n.actionItems.map((item) =>
              item.id === actionId ? { ...item, text: newText } : item
            ),
          };
        }
        return n;
      })
    );
  };

  const handleAddActionItem = (noteId) => {
    const newItem = { id: `act-${Date.now()}`, text: "New action item", done: false };
    setNotes((prev) =>
      prev.map((n) =>
        n.id === noteId
          ? { ...n, actionItems: [...(n.actionItems || []), newItem] }
          : n
      )
    );
  };

  const handleDeleteActionItem = (noteId, actionId) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === noteId && n.actionItems
          ? { ...n, actionItems: n.actionItems.filter((item) => item.id !== actionId) }
          : n
      )
    );
  };

  const handleToggleChecklistSection = (noteId) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === noteId) {
          const current = n.actionItems || [];
          return {
            ...n,
            actionItems: [
              ...current,
              { id: `act-${Date.now()}`, text: "New action item", done: false },
            ],
          };
        }
        return n;
      })
    );
  };

  const handleRemoveChecklistSection = (noteId) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, actionItems: [] } : n))
    );
  };

  const handleUpdateBulletPoint = (noteId, index, newText) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === noteId && n.whatWentWell) {
          const next = [...n.whatWentWell];
          next[index] = newText;
          return { ...n, whatWentWell: next };
        }
        return n;
      })
    );
  };

  const handleAddBulletPoint = (noteId) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === noteId
          ? { ...n, whatWentWell: [...(n.whatWentWell || []), "New takeaway point"] }
          : n
      )
    );
  };

  const handleDeleteBulletPoint = (noteId, index) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === noteId && n.whatWentWell
          ? { ...n, whatWentWell: n.whatWentWell.filter((_, idx) => idx !== index) }
          : n
      )
    );
  };

  const handleToggleKeySection = (noteId) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === noteId) {
          const current = n.whatWentWell || [];
          return {
            ...n,
            whatWentWell: [...current, "Key takeaway highlight"],
          };
        }
        return n;
      })
    );
  };

  const handleRemoveKeySection = (noteId) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, whatWentWell: [] } : n))
    );
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && selectedNoteId) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const imgUrl = event.target.result;
          setNotes((prev) =>
            prev.map((n) =>
              n.id === selectedNoteId
                ? { ...n, images: [...(n.images || []), imgUrl] }
                : n
            )
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = (noteId, imgIndex) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === noteId && n.images
          ? { ...n, images: n.images.filter((_, idx) => idx !== imgIndex) }
          : n
      )
    );
  };

  const handleDeleteNote = (noteId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      const remaining = notes.filter((n) => n.id !== noteId);
      setNotes(remaining);
      if (selectedNoteId === noteId && remaining.length > 0) {
        setSelectedNoteId(remaining[0].id);
      }
    }
  };

  const handleShareNote = (note) => {
    const textToShare = `${note.title}\n\n${note.introText || ""}\n\nAction items:\n${(
      note.actionItems || []
    )
      .map((a) => `${a.done ? "[x]" : "[ ]"} ${a.text}`)
      .join("\n")}`;
    navigator.clipboard.writeText(textToShare);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  const handleCreateNewNote = () => {
    const newNote = {
      id: `note-${Date.now()}`,
      title: "New Note",
      category: "General",
      categoryBg: CATEGORY_STYLES["General"],
      timeAgo: "Just now",
      isFavorite: false,
      author: "Alex",
      snippet: "Type your notes description...",
      introText: "",
      whatWentWell: [],
      actionItems: [],
      closingText: "",
      images: [],
      updatedAt: new Date().toISOString(),
    };

    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
    setMobileNotesView("detail");
  };

  const handleUpdateTitle = (val) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === selectedNoteId ? { ...n, title: val } : n))
    );
  };

  const handleUpdateIntro = (val) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNoteId
          ? { ...n, introText: val, snippet: val.slice(0, 75) + "..." }
          : n
      )
    );
  };

  const handleUpdateClosing = (val) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === selectedNoteId ? { ...n, closingText: val } : n))
    );
  };

  const handleUpdateCategory = (newCat) => {
    const bg = CATEGORY_STYLES[newCat] || "bg-[#F3F4F6] text-[#4B5563]";
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNoteId ? { ...n, category: newCat, categoryBg: bg } : n
      )
    );
  };

  const handleInsertLink = () => {
    if (!selectedNote) return;
    const url = prompt("Enter Link URL:", "https://");
    if (url) {
      handleUpdateIntro((selectedNote.introText || "") + ` [Link](${url})`);
    }
  };

  const notesTwoColumnContent = (
    <div className="flex-1 w-full min-h-[calc(100vh-57px)] lg:h-screen flex flex-col lg:flex-row overflow-hidden bg-[#F5F3ED] p-3 sm:p-4 lg:p-6 gap-6 relative">
      {/* Toast Notification */}
      {copiedToast && (
        <div className="absolute top-6 right-8 z-50 bg-black text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in">
          <Check size={14} className="text-emerald-400" />
          <span>Note copied to clipboard!</span>
        </div>
      )}

      {/* 1. LEFT COLUMN: All Notes List */}
      <NotesSidebarList
        notes={filteredNotes}
        selectedNoteId={selectedNote?.id}
        onSelectNote={(id) => {
          setSelectedNoteId(id);
          setMobileNotesView("detail");
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortAsc={sortAsc}
        onToggleSort={() => setSortAsc(!sortAsc)}
        onCreateNote={handleCreateNewNote}
        isVisibleMobile={mobileNotesView === "list"}
      />

      {/* 2. RIGHT COLUMN: Selected Rich Note View */}
      {selectedNote ? (
        <div
          className={`${
            mobileNotesView === "detail" ? "flex" : "hidden"
          } lg:flex flex-1 w-full bg-white rounded-[24px] sm:rounded-[32px] p-4 sm:p-7 lg:p-9 shadow-sm border border-neutral-150 h-full overflow-y-auto no-scrollbar flex-col justify-between`}
        >
          <div>
            {/* Mobile Back Button */}
            <button
              type="button"
              onClick={() => setMobileNotesView("list")}
              className="lg:hidden flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black mb-3 py-1 px-2.5 rounded-xl bg-neutral-100 w-fit cursor-pointer"
            >
              <ChevronLeft size={16} />
              <span>Back to all notes</span>
            </button>

            {/* Top Bar: Title + Star, Share, Trash Buttons */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <input
                type="text"
                value={selectedNote.title}
                onChange={(e) => handleUpdateTitle(e.target.value)}
                className="w-full text-2xl lg:text-3xl font-black text-neutral-900 tracking-tight bg-transparent border-none outline-none focus:ring-1 focus:ring-neutral-200 rounded-lg px-1 -ml-1"
                placeholder="Note Title..."
              />

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleFavorite(selectedNote.id)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    selectedNote.isFavorite
                      ? "text-amber-500 bg-amber-50"
                      : "text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
                  }`}
                  title={selectedNote.isFavorite ? "Unfavorite" : "Mark as favorite"}
                >
                  <Star
                    size={18}
                    className={selectedNote.isFavorite ? "fill-amber-400 text-amber-500" : ""}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => handleShareNote(selectedNote)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                  title="Share note (copy text)"
                >
                  <Share2 size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteNote(selectedNote.id)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete note"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Metadata Row: Category Tag Dropdown + Timestamp */}
            <div className="flex items-center gap-3 mb-6">
              <select
                value={selectedNote.category || "General"}
                onChange={(e) => handleUpdateCategory(e.target.value)}
                className={`px-2.5 py-1 rounded-md font-bold text-xs outline-none cursor-pointer border-none ${
                  selectedNote.categoryBg || "bg-[#EEF4FF] text-[#3B82F6]"
                }`}
              >
                {Object.keys(CATEGORY_STYLES).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <span className="text-xs text-neutral-400 font-medium">
                Edited recently by {selectedNote.author || "Alex"}
              </span>
            </div>

            {/* Formatting Toolbar */}
            <NoteToolbar
              isBold={isBold}
              onToggleBold={() => setIsBold(!isBold)}
              isItalic={isItalic}
              onToggleItalic={() => setIsItalic(!isItalic)}
              isUnderline={isUnderline}
              onToggleUnderline={() => setIsUnderline(!isUnderline)}
              onToggleKeySection={() => handleToggleKeySection(selectedNote.id)}
              onToggleChecklistSection={() => handleToggleChecklistSection(selectedNote.id)}
              onToggleClosingRemarks={() => {
                if (!selectedNote.closingText) {
                  handleUpdateClosing("Next steps, deadlines, and follow-up remarks...");
                }
              }}
              onImageUpload={handleImageUpload}
              onInsertLink={handleInsertLink}
            />

            {/* Note Body */}
            <div className="space-y-6 text-sm text-neutral-800 leading-relaxed font-normal">
              {/* Intro Overview Text */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-500 mb-1.5">
                  Note Overview / Description (Editable)
                </label>
                <textarea
                  rows={4}
                  value={selectedNote.introText || ""}
                  onChange={(e) => handleUpdateIntro(e.target.value)}
                  placeholder="Type your notes description, meeting summary, or thoughts here..."
                  className={`w-full bg-[#FAF9F6] hover:bg-[#F5F3ED]/50 focus:bg-white p-3.5 rounded-2xl border border-neutral-200 outline-none text-sm text-neutral-800 leading-relaxed transition-all resize-y shadow-2xs focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400 ${
                    isBold ? "font-bold" : "font-normal"
                  } ${isItalic ? "italic" : ""} ${isUnderline ? "underline" : ""}`}
                />
              </div>

              {/* Attached Images Gallery */}
              <NoteImageGallery
                images={selectedNote.images}
                onAddPhotoClick={() => {
                  const input = document.querySelector('input[type="file"][accept="image/*"]');
                  if (input) input.click();
                }}
                onDeleteImage={(idx) => handleDeleteImage(selectedNote.id, idx)}
                onOpenLightbox={(img) => setActiveLightboxImage(img)}
              />

              {/* Key Highlights & Takeaways */}
              <NoteHighlightsSection
                highlights={selectedNote.whatWentWell}
                onAddPoint={() => handleAddBulletPoint(selectedNote.id)}
                onUpdatePoint={(idx, val) => handleUpdateBulletPoint(selectedNote.id, idx, val)}
                onDeletePoint={(idx) => handleDeleteBulletPoint(selectedNote.id, idx)}
                onRemoveSection={() => handleRemoveKeySection(selectedNote.id)}
              />

              {/* Action Items Checklist */}
              <NoteChecklistSection
                actionItems={selectedNote.actionItems}
                onToggleItem={(itemId) => handleToggleActionItem(selectedNote.id, itemId)}
                onUpdateItemText={(itemId, val) => handleUpdateActionItemText(selectedNote.id, itemId, val)}
                onAddItem={() => handleAddActionItem(selectedNote.id)}
                onDeleteItem={(itemId) => handleDeleteActionItem(selectedNote.id, itemId)}
                onRemoveSection={() => handleRemoveChecklistSection(selectedNote.id)}
              />

              {/* Closing Remarks & Deadlines */}
              {selectedNote.closingText && selectedNote.closingText.trim().length > 0 && (
                <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-neutral-200/90 animate-in fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-purple-500" />
                      <h4 className="font-bold text-neutral-900 text-sm">
                        Closing Remarks & Deadlines
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUpdateClosing("")}
                      className="p-1 hover:text-rose-500 text-neutral-400 transition-colors cursor-pointer"
                      title="Remove Closing Remarks section"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={selectedNote.closingText || ""}
                    onChange={(e) => handleUpdateClosing(e.target.value)}
                    placeholder="Next steps, deadlines, and follow-up remarks..."
                    className="w-full bg-white hover:bg-neutral-50/50 focus:bg-white p-3 rounded-xl border border-neutral-200 outline-none text-xs text-neutral-800 transition-all font-medium shadow-2xs focus:ring-1 focus:ring-neutral-900/10 focus:border-neutral-400 resize-y"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`${
            mobileNotesView === "detail" ? "flex" : "hidden"
          } lg:flex flex-1 w-full bg-white rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 shadow-sm border border-neutral-100 flex-col items-center justify-center text-center`}
        >
          <button
            type="button"
            onClick={() => setMobileNotesView("list")}
            className="lg:hidden flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black mb-4 py-1.5 px-3 rounded-xl bg-neutral-100 w-fit cursor-pointer"
          >
            <ChevronLeft size={16} />
            <span>Back to notes list</span>
          </button>
          <p className="text-neutral-400 text-sm font-medium">
            Select a note from the left to view details
          </p>
        </div>
      )}

      {/* Lightbox Zoom Modal */}
      <ImageLightboxModal
        imageUrl={activeLightboxImage}
        onClose={() => setActiveLightboxImage(null)}
      />
    </div>
  );

  if (embedded) {
    return notesTwoColumnContent;
  }

  return (
    <div className="min-h-screen w-full bg-[#F5F3ED] text-[#1E2022] flex flex-row overflow-x-auto">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSynopsis={onOpenSynopsis}
        onOpenChatbot={onOpenChatbot}
      />
      {notesTwoColumnContent}
    </div>
  );
};

export default Notes;
