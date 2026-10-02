import React from "react";
import NoteCard from "./NoteCard";
import { FileText, Plus, SearchX } from "lucide-react";

const NotesGrid = ({
  notes = [],
  onEdit,
  onDelete,
  onToggleFavorite,
  onOpenCreateModal,
  isSearching = false,
}) => {
  if (notes.length === 0) {
    return (
      <div className="bg-white/80 rounded-3xl border border-dashed border-neutral-200 p-12 text-center my-6 flex flex-col items-center justify-center min-h-[360px] shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4 shadow-2xs">
          {isSearching ? <SearchX size={30} /> : <FileText size={30} />}
        </div>

        {isSearching ? (
          <>
            <h3 className="text-lg font-bold text-neutral-900 mb-1">
              No matching notes found
            </h3>
            <p className="text-xs text-neutral-400 max-w-sm mb-6 font-medium">
              We couldn't find any notes matching your search or active category filter. Try clearing filters or creating a new note.
            </p>
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer hover:scale-105"
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>+ New Note</span>
            </button>
          </>
        ) : (
          <>
            <h3 className="text-xl font-black text-neutral-900 mb-1 tracking-tight">
              No notes yet
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mb-6 font-medium">
              Create your first note to get started. Capture workout plans, book summaries, ideas, and daily tasks.
            </p>
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="px-6 py-3 bg-black hover:bg-neutral-800 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer hover:scale-105"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>+ New Note</span>
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-12">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};

export default NotesGrid;
