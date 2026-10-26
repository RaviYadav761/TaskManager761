import React from "react";
import { ArrowUpDown, Plus, Search } from "lucide-react";
import NoteListItem from "./NoteListItem";

const NotesSidebarList = ({
  notes = [],
  selectedNoteId,
  onSelectNote,
  searchQuery,
  onSearchChange,
  sortAsc,
  onToggleSort,
  onCreateNote,
  isVisibleMobile,
}) => {
  return (
    <div
      className={`${
        isVisibleMobile ? "flex" : "hidden"
      } lg:flex w-full lg:w-[330px] xl:w-[370px] bg-white rounded-[24px] sm:rounded-[32px] p-4 sm:p-5 shadow-sm border border-neutral-150 flex-col justify-between shrink-0 h-full`}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header: All Notes + Sort Icon + Plus Button */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100">
          <h2 className="text-xl font-black text-neutral-900 tracking-tight">
            All Notes
          </h2>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onToggleSort}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                sortAsc
                  ? "bg-neutral-900 text-white"
                  : "hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900"
              }`}
              title="Sort notes alphabetically"
            >
              <ArrowUpDown size={15} />
            </button>

            <button
              type="button"
              onClick={onCreateNote}
              className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer shadow-xs hover:scale-105"
              title="Create new note"
            >
              <Plus size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Quick Search Input */}
        <div className="relative mb-3">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search all notes..."
            className="w-full bg-[#F4F4F6] text-xs font-medium text-neutral-900 placeholder:text-neutral-400 rounded-xl pl-8 pr-3 py-2 border-none outline-none focus:ring-1 focus:ring-neutral-900/10"
          />
        </div>

        {/* Scrollable Note Items List */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-2.5 pr-1">
          {notes.length === 0 ? (
            <div className="text-center py-10 text-neutral-400 text-xs font-medium">
              No notes found.
            </div>
          ) : (
            notes.map((note) => (
              <NoteListItem
                key={note.id}
                note={note}
                isSelected={selectedNoteId === note.id}
                onSelect={() => onSelectNote(note.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesSidebarList;
