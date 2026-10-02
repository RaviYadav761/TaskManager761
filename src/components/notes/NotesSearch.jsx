import React from "react";
import { Search, X, Star } from "lucide-react";

const NotesSearch = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories = [],
  notesCount = 0,
}) => {
  return (
    <div className="space-y-3.5 mb-6">
      {/* Search Input Bar */}
      <div className="bg-white rounded-2xl px-4 py-3 shadow-sm shadow-neutral-900/5 border border-white/80 flex items-center gap-3 transition-all focus-within:ring-2 focus-within:ring-neutral-900/10">
        <Search size={18} className="text-neutral-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes by title, content or category..."
          className="bg-transparent border-none outline-none text-sm text-neutral-900 placeholder:text-neutral-400 font-medium w-full"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="w-6 h-6 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category & Favorites Quick Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          type="button"
          onClick={() => setSelectedCategory("All")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            selectedCategory === "All"
              ? "bg-neutral-900 text-white shadow-xs"
              : "bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 border border-neutral-200/70"
          }`}
        >
          All ({notesCount})
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory("Favorites")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
            selectedCategory === "Favorites"
              ? "bg-amber-500 text-white shadow-xs"
              : "bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 border border-neutral-200/70"
          }`}
        >
          <Star size={13} className={selectedCategory === "Favorites" ? "fill-white" : "fill-amber-400 text-amber-500"} />
          <span>Favorites</span>
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              selectedCategory === cat
                ? "bg-neutral-900 text-white shadow-xs"
                : "bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 border border-neutral-200/70"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NotesSearch;
