import React, { useState } from "react";
import { Plus, Maximize2, Minimize2, Search, X } from "lucide-react";

const NoteImageGallery = ({
  images = [],
  onAddPhotoClick,
  onDeleteImage,
  onOpenLightbox,
}) => {
  const [expandedImageIndex, setExpandedImageIndex] = useState(null);

  if (!images || images.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-neutral-600">
          Attached Images ({images.length}) • Click image to expand width & height
        </label>
        <button
          type="button"
          onClick={onAddPhotoClick}
          className="text-xs font-bold text-neutral-700 hover:text-black flex items-center gap-1 cursor-pointer bg-[#FAF9F6] hover:bg-neutral-100 px-3 py-1.5 rounded-xl border border-neutral-200 transition-all"
        >
          <Plus size={13} />
          <span>Add photo</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        {images.map((img, i) => {
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

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenLightbox(img);
                  }}
                  className="p-1.5 rounded-xl bg-black/75 hover:bg-black text-white cursor-pointer shadow-md transition-all"
                  title="Fullscreen view"
                >
                  <Search size={14} />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (expandedImageIndex === i) setExpandedImageIndex(null);
                    onDeleteImage(i);
                  }}
                  className="p-1.5 rounded-xl bg-black/75 hover:bg-rose-600 text-white cursor-pointer shadow-md transition-all"
                  title="Remove image"
                >
                  <X size={14} />
                </button>
              </div>

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
  );
};

export default NoteImageGallery;
