import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import {
  Star,
  Share2,
  Trash2,
  Plus,
  ArrowUpDown,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  Image as ImageIcon,
  CheckSquare,
  Square,
  Search,
  X,
  Check,
  Key,
  Sparkles,
  Upload,
  Clock,
  Maximize2,
  Minimize2,
  ChevronLeft
} from "lucide-react";

const LOCAL_STORAGE_NOTES_V2_KEY = "taskly_notes_v2";

const CATEGORY_STYLES = {
  "Mobile App Sprint": "bg-[#EEF4FF] text-[#3B82F6]",
  "Website Relaunch": "bg-[#F3E8FF] text-[#9333EA]",
  "Brand Guidelines v2": "bg-[#ECFDF5] text-[#10B981]",
  "Q3 Marketing Plan": "bg-[#FFF1F2] text-[#F43F5E]",
  "Fitness": "bg-[#FEF3C7] text-[#D97706]",
  "General": "bg-[#F3F4F6] text-[#4B5563]",
};

const INITIAL_IMAGE2_NOTES = [
  {
    id: "note-retro-takeaways",
    title: "Sprint retro takeaways",
    category: "Mobile App Sprint",
    categoryBg: "bg-[#EEF4FF] text-[#3B82F6]",
    timeAgo: "2h ago",
    isFavorite: true,
    author: "Alex",
    snippet: "Team agreed to shorten standups and move QA earlier in the sprint cycle...",
    introText:
      "We ran the Sprint 4 retrospective with the full mobile team. Overall velocity improved from last sprint, but a few process gaps surfaced that we want to address before Sprint 5 kicks off.",
    whatWentWell: [
      "Daily standups stayed under 10 minutes consistently",
      "Design handoff docs were clearer and reduced back-and-forth",
      "Zero critical bugs shipped to production this sprint",
    ],
    actionItems: [
      { id: "act-1", text: "Move QA pass earlier in the sprint", done: true },
      { id: "act-2", text: "Shorten standup to 3 questions format", done: false },
      { id: "act-3", text: "Schedule API scope sync for Sprint 5 planning", done: false },
    ],
    closingText: "",
    images: [],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "note-client-feedback",
    title: "Client feedback – homepage",
    category: "Website Relaunch",
    categoryBg: "bg-[#F3E8FF] text-[#9333EA]",
    timeAgo: "5h ago",
    isFavorite: false,
    author: "Alex",
    snippet: "Client wants a bolder hero section and clearer CTA placement above the fold...",
    introText:
      "Client reviewed the desktop staging build and gave very positive remarks on page performance. A few UI tweaks requested before final sign-off.",
    whatWentWell: [
      "High satisfaction with the 3D card interactions",
      "Typography readability praised on both Mac and Windows displays",
    ],
    actionItems: [
      { id: "act-cf-1", text: "Bolder hero section with prominent CTA buttons", done: false },
      { id: "act-cf-2", text: "Update customer testimonials carousel", done: true },
    ],
    closingText: "",
    images: [],
    updatedAt: new Date(Date.now() - 18000000).toISOString(),
  },
  {
    id: "note-brand-color",
    title: "Brand color exploration",
    category: "Brand Guidelines v2",
    categoryBg: "bg-[#ECFDF5] text-[#10B981]",
    timeAgo: "2 days ago",
    isFavorite: false,
    author: "Alex",
    snippet: "Explored 4 emerald-based palettes for the new guideline document...",
    introText:
      "Exploring refined primary and accent swatches to complement Taskly's signature warm cream background.",
    whatWentWell: [],
    actionItems: [],
    closingText: "",
    images: [],
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

const Notes = ({
  embedded = false,
  activeTab = "notes",
  setActiveTab = () => {},
  onOpenSynopsis = () => {},
  onOpenChatbot = () => {},
}) => {
  // Load notes from localStorage or initialize
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_NOTES_V2_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load notes:", e);
    }
    return INITIAL_IMAGE2_NOTES;
  });

  // Selected note ID in right column
  const [selectedNoteId, setSelectedNoteId] = useState(() => {
    return notes[0]?.id || "note-retro-takeaways";
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [mobileNotesView, setMobileNotesView] = useState("list"); // 'list' | 'detail'

  // Formatting and file refs
  const galleryInputRef = useRef(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [activeLightboxImage, setActiveLightboxImage] = useState(null);
  const [expandedImageIndex, setExpandedImageIndex] = useState(null);

  // Sync notes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_NOTES_V2_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error("Failed to save notes:", e);
    }
  }, [notes]);

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || notes[0] || null;

  // Filter notes by search query and sort
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
      if (sortAsc) {
        return a.title.localeCompare(b.title);
      }
      return 0; // Default order
    });

  // Actions
  const handleToggleFavorite = (noteId) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === noteId) {
          return { ...n, isFavorite: !n.isFavorite };
        }
        return n;
      })
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
    const newItem = {
      id: `act-${Date.now()}`,
      text: "New action item",
      done: false,
    };
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === noteId) {
          return {
            ...n,
            actionItems: [...(n.actionItems || []), newItem],
          };
        }
        return n;
      })
    );
  };

  const handleDeleteActionItem = (noteId, actionId) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === noteId && n.actionItems) {
          return {
            ...n,
            actionItems: n.actionItems.filter((item) => item.id !== actionId),
          };
        }
        return n;
      })
    );
  };

  const handleToggleChecklistSection = (noteId) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === noteId) {
          if (!n.actionItems || n.actionItems.length === 0) {
            return {
              ...n,
              actionItems: [{ id: `act-${Date.now()}`, text: "New action item", done: false }],
            };
          } else {
            return {
              ...n,
              actionItems: [
                ...n.actionItems,
                { id: `act-${Date.now()}`, text: "New action item", done: false },
              ],
            };
          }
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
      prev.map((n) => {
        if (n.id === noteId) {
          return {
            ...n,
            whatWentWell: [...(n.whatWentWell || []), "New takeaway point"],
          };
        }
        return n;
      })
    );
  };

  const handleDeleteBulletPoint = (noteId, index) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === noteId && n.whatWentWell) {
          return {
            ...n,
            whatWentWell: n.whatWentWell.filter((_, idx) => idx !== index),
          };
        }
        return n;
      })
    );
  };

  const handleToggleKeySection = (noteId) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === noteId) {
          if (!n.whatWentWell || n.whatWentWell.length === 0) {
            return {
              ...n,
              whatWentWell: ["Key takeaway highlight"],
            };
          } else {
            return {
              ...n,
              whatWentWell: [...n.whatWentWell, "New takeaway point"],
            };
          }
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

  const handleRemoveClosing = (noteId) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, closingText: "" } : n))
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
      prev.map((n) => {
        if (n.id === noteId && n.images) {
          return {
            ...n,
            images: n.images.filter((_, idx) => idx !== imgIndex),
          };
        }
        return n;
      })
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
    const textToShare = `${note.title}\n\n${note.introText || ""}\n\nAction items:\n${(note.actionItems || []).map(a => `${a.done ? '[x]' : '[ ]'} ${a.text}`).join('\n')}`;
    navigator.clipboard.writeText(textToShare);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  // Create clean new note without mandatory sections
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
      whatWentWell: [], // Clean slate by default!
      actionItems: [], // Clean slate by default!
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
      prev.map((n) => (n.id === selectedNoteId ? { ...n, introText: val, snippet: val.slice(0, 75) + "..." } : n))
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
      prev.map((n) => (n.id === selectedNoteId ? { ...n, category: newCat, categoryBg: bg } : n))
    );
  };

  const handleInsertFormat = (type) => {
    if (!selectedNote) return;
    if (type === "link") {
      const url = prompt("Enter Link URL:", "https://");
      if (url) {
        handleUpdateIntro((selectedNote.introText || "") + ` [Link](${url})`);
      }
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

      {/* ======================================================== */}
      {/* 1. LEFT COLUMN: All Notes List                           */}
      {/* ======================================================== */}
      <div className={`${mobileNotesView === "list" ? "flex" : "hidden"} lg:flex w-full lg:w-[330px] xl:w-[370px] bg-white rounded-[24px] sm:rounded-[32px] p-4 sm:p-5 shadow-sm border border-neutral-150 flex-col justify-between shrink-0 h-full`}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header: All Notes + Sort Icon + Plus Button */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100">
            <h2 className="text-xl font-black text-neutral-900 tracking-tight">
              All Notes
            </h2>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSortAsc(!sortAsc)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  sortAsc ? "bg-neutral-900 text-white" : "hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900"
                }`}
                title="Sort notes alphabetically"
              >
                <ArrowUpDown size={15} />
              </button>

              <button
                type="button"
                onClick={handleCreateNewNote}
                className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer shadow-xs hover:scale-105"
                title="Create new note"
              >
                <Plus size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Quick Search Input */}
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search all notes..."
              className="w-full bg-[#F4F4F6] text-xs font-medium text-neutral-900 placeholder:text-neutral-400 rounded-xl pl-8 pr-3 py-2 border-none outline-none focus:ring-1 focus:ring-neutral-900/10"
            />
          </div>

          {/* Scrollable Note Items List */}
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-2.5 pr-1">
            {filteredNotes.map((note) => {
              const isSelected = selectedNote?.id === note.id;
              return (
                <div
                  key={note.id}
                  onClick={() => {
                    setSelectedNoteId(note.id);
                    setMobileNotesView("detail");
                  }}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? "bg-[#F3F6FD] border-[#DCE6FC] shadow-2xs scale-[1.01]"
                      : "bg-white hover:bg-neutral-50 border-neutral-100"
                  }`}
                >
                  {/* Title + Star */}
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
            })}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. RIGHT COLUMN: Selected Rich Note View                 */}
      {/* ======================================================== */}
      {selectedNote ? (
        <div className={`${mobileNotesView === "detail" ? "flex" : "hidden"} lg:flex flex-1 w-full bg-white rounded-[24px] sm:rounded-[32px] p-4 sm:p-7 lg:p-9 shadow-sm border border-neutral-150 h-full overflow-y-auto no-scrollbar flex-col justify-between`}>
          <div>
            {/* Mobile Back to Notes button */}
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
                {/* Favorite Star */}
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

                {/* Share Button */}
                <button
                  type="button"
                  onClick={() => handleShareNote(selectedNote)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                  title="Share note (copy text)"
                >
                  <Share2 size={18} />
                </button>

                {/* Delete Button */}
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

            {/* Metadata Row: Category Tag Dropdown + Edited Timestamp */}
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

            {/* ======================================================== */}
            {/* ENHANCED FORMATTING TOOLBAR                              */}
            {/* ======================================================== */}
            <div className="flex items-center gap-2 py-2 px-3 bg-[#FAF9F6] rounded-2xl border border-neutral-200/90 mb-6 text-neutral-600 overflow-x-auto no-scrollbar">
              {/* Bold Toggle */}
              <button
                type="button"
                onClick={() => setIsBold(!isBold)}
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
                onClick={() => setIsItalic(!isItalic)}
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
                onClick={() => setIsUnderline(!isUnderline)}
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
                onClick={() => handleToggleKeySection(selectedNote.id)}
                className="px-3 py-1.5 rounded-xl hover:bg-white hover:shadow-2xs border border-transparent hover:border-neutral-200 flex items-center gap-1.5 transition-all cursor-pointer text-xs font-bold text-neutral-800"
                title="Add Key Highlights & Takeaways section"
              >
                <Key size={14} className="text-amber-500" />
                <span>Key Highlights</span>
              </button>

              {/* Checklist Section Button */}
              <button
                type="button"
                onClick={() => handleToggleChecklistSection(selectedNote.id)}
                className="px-3 py-1.5 rounded-xl hover:bg-white hover:shadow-2xs border border-transparent hover:border-neutral-200 flex items-center gap-1.5 transition-all cursor-pointer text-xs font-bold text-neutral-800"
                title="Add Action Items & Checklist section"
              >
                <CheckSquare size={14} className="text-emerald-600" />
                <span>Checklist</span>
              </button>

              {/* Closing Remarks Button */}
              <button
                type="button"
                onClick={() => {
                  if (!selectedNote.closingText) {
                    handleUpdateClosing("Next steps, deadlines, and follow-up remarks...");
                  }
                }}
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
                ref={galleryInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl hover:bg-white hover:shadow-2xs border border-transparent hover:border-neutral-200 flex items-center gap-1.5 transition-all cursor-pointer text-xs font-bold text-neutral-800"
                title="Upload image from device / gallery"
              >
                <ImageIcon size={14} className="text-blue-500" />
                <span>Add Image</span>
              </button>

              {/* Link Button */}
              <button
                type="button"
                onClick={() => handleInsertFormat("link")}
                className="w-8 h-8 rounded-xl hover:bg-white hover:shadow-2xs flex items-center justify-center transition-all cursor-pointer"
                title="Insert Link"
              >
                <Link2 size={15} />
              </button>
            </div>

            {/* Note Body: Paragraph + Sections + Interactive Checklists */}
            <div className="space-y-6 text-sm text-neutral-800 leading-relaxed font-normal">
              {/* Intro Paragraph - Fully Editable */}
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

              {/* Attached Images Gallery with In-Place Expand & Fullscreen Lightbox */}
              {selectedNote.images && selectedNote.images.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-neutral-600">
                      Attached Images ({selectedNote.images.length}) • Click image to expand width & height
                    </label>
                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      className="text-xs font-bold text-neutral-700 hover:text-black flex items-center gap-1 cursor-pointer bg-[#FAF9F6] hover:bg-neutral-100 px-3 py-1.5 rounded-xl border border-neutral-200 transition-all"
                    >
                      <Plus size={13} />
                      <span>Add photo</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {selectedNote.images.map((img, i) => {
                      const isExpanded = expandedImageIndex === i;
                      return (
                        <div
                          key={i}
                          onClick={() => setExpandedImageIndex(isExpanded ? null : i)}
                          className={`relative group rounded-2xl overflow-hidden border border-neutral-200 shadow-sm bg-neutral-100 cursor-pointer transition-all duration-300 ${
                            isExpanded
                              ? "w-full h-80 sm:h-96 md:h-[460px] shadow-lg ring-2 ring-neutral-900/10"
                              : "w-64 sm:w-80 h-48 sm:h-52 hover:shadow-md hover:scale-[1.01]"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Note attachment ${i + 1}`}
                            className={`w-full h-full transition-transform duration-300 ${
                              isExpanded ? "object-contain bg-neutral-900/5 p-2" : "object-cover group-hover:scale-105"
                            }`}
                          />

                          {/* Hover action overlay */}
                          <div className="absolute top-2.5 right-2.5 flex items-center gap-2 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            {/* Toggle size button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedImageIndex(isExpanded ? null : i);
                              }}
                              className="p-1.5 rounded-xl bg-black/75 hover:bg-black text-white cursor-pointer shadow-md transition-all"
                              title={isExpanded ? "Shrink size" : "Expand width & height"}
                            >
                              {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                            </button>

                            {/* Fullscreen lightbox button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveLightboxImage(img);
                              }}
                              className="p-1.5 rounded-xl bg-black/75 hover:bg-black text-white cursor-pointer shadow-md transition-all"
                              title="Fullscreen view"
                            >
                              <Search size={14} />
                            </button>

                            {/* Remove image button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (expandedImageIndex === i) setExpandedImageIndex(null);
                                handleDeleteImage(selectedNote.id, i);
                              }}
                              className="p-1.5 rounded-xl bg-black/75 hover:bg-rose-600 text-white cursor-pointer shadow-md transition-all"
                              title="Remove image"
                            >
                              <X size={14} />
                            </button>
                          </div>

                          {/* Click hint pill */}
                          {!isExpanded && (
                            <div className="absolute bottom-2.5 left-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-white text-[11px] font-bold bg-black/70 px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1 shadow-sm">
                                <Maximize2 size={11} /> Click to Expand
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Key Highlights & Takeaways - Only shown if present or added via toolbar */}
              {selectedNote.whatWentWell && selectedNote.whatWentWell.length > 0 && (
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
                        onClick={() => handleAddBulletPoint(selectedNote.id)}
                        className="text-xs font-bold text-neutral-700 hover:text-black flex items-center gap-1 cursor-pointer bg-white hover:bg-neutral-50 px-2.5 py-1 rounded-lg border border-neutral-200 shadow-2xs transition-all"
                      >
                        <Plus size={12} />
                        <span>Add Point</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveKeySection(selectedNote.id)}
                        className="p-1 hover:text-rose-500 text-neutral-400 transition-colors cursor-pointer"
                        title="Remove Key Highlights section"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {selectedNote.whatWentWell.map((pt, idx) => (
                      <div key={idx} className="flex items-center gap-2 group">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-800 shrink-0" />
                        <input
                          type="text"
                          value={pt}
                          onChange={(e) =>
                            handleUpdateBulletPoint(selectedNote.id, idx, e.target.value)
                          }
                          placeholder="Type takeaway point..."
                          className="flex-1 bg-transparent border-b border-transparent focus:border-neutral-300 outline-none text-xs text-neutral-800 font-medium focus:bg-white px-2 py-1 rounded transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteBulletPoint(selectedNote.id, idx)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 text-neutral-400 transition-opacity cursor-pointer"
                          title="Delete point"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action items with Interactive Checkboxes - Only shown if present or added via toolbar */}
              {selectedNote.actionItems && selectedNote.actionItems.length > 0 && (
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
                        onClick={() => handleAddActionItem(selectedNote.id)}
                        className="text-xs font-bold text-neutral-700 hover:text-black flex items-center gap-1 cursor-pointer bg-white hover:bg-neutral-50 px-2.5 py-1 rounded-lg border border-neutral-200 shadow-2xs transition-all"
                      >
                        <Plus size={12} />
                        <span>Add Item</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveChecklistSection(selectedNote.id)}
                        className="p-1 hover:text-rose-500 text-neutral-400 transition-colors cursor-pointer"
                        title="Remove Checklist section"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {selectedNote.actionItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2.5 group text-xs bg-white p-2.5 rounded-xl border border-neutral-200/80 shadow-2xs"
                      >
                        {/* Interactive checkbox */}
                        <button
                          type="button"
                          onClick={() => handleToggleActionItem(selectedNote.id, item.id)}
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
                          onChange={(e) =>
                            handleUpdateActionItemText(selectedNote.id, item.id, e.target.value)
                          }
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
                          onClick={() => handleDeleteActionItem(selectedNote.id, item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 text-neutral-400 transition-opacity cursor-pointer"
                          title="Remove item"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Closing Remarks & Deadlines - Only shown if present or added via toolbar */}
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
                      onClick={() => handleRemoveClosing(selectedNote.id)}
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
        <div className={`${mobileNotesView === "detail" ? "flex" : "hidden"} lg:flex flex-1 w-full bg-white rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 shadow-sm border border-neutral-100 flex-col items-center justify-center text-center`}>
          <button
            type="button"
            onClick={() => setMobileNotesView("list")}
            className="lg:hidden flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black mb-4 py-1.5 px-3 rounded-xl bg-neutral-100 w-fit cursor-pointer"
          >
            <ChevronLeft size={16} />
            <span>Back to notes list</span>
          </button>
          <p className="text-neutral-400 text-sm font-medium">Select a note from the left to view details</p>
        </div>
      )}

      {/* Lightbox Zoom Modal for Images */}
      {activeLightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setActiveLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setActiveLightboxImage(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              title="Close image view (Esc)"
            >
              <X size={20} />
            </button>

            {/* Full image */}
            <img
              src={activeLightboxImage}
              alt="Full preview"
              className="max-w-full max-h-[80vh] rounded-2xl object-contain shadow-2xl border border-white/10"
            />

            {/* Caption & Download bar */}
            <div className="mt-3 flex items-center justify-between gap-4 w-full px-2 text-white/80 text-xs">
              <span className="font-medium">Note Image Attachment</span>
              <div className="flex items-center gap-2">
                <a
                  href={activeLightboxImage}
                  download="taskly-note-image.png"
                  className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold transition-colors cursor-pointer text-xs"
                >
                  Download
                </a>
                <button
                  type="button"
                  onClick={() => setActiveLightboxImage(null)}
                  className="px-3 py-1.5 rounded-xl bg-white text-black font-bold hover:bg-neutral-100 transition-colors cursor-pointer text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
