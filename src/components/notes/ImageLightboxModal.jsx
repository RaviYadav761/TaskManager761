import React from "react";
import { X } from "lucide-react";

const ImageLightboxModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
          title="Close image view (Esc)"
        >
          <X size={20} />
        </button>

        {/* Full image */}
        <img
          src={imageUrl}
          alt="Full preview"
          className="max-w-full max-h-[80vh] rounded-2xl object-contain shadow-2xl border border-white/10"
        />

        {/* Caption & Download bar */}
        <div className="mt-3 flex items-center justify-between gap-4 w-full px-2 text-white/80 text-xs">
          <span className="font-medium">Note Image Attachment</span>
          <div className="flex items-center gap-2">
            <a
              href={imageUrl}
              download="taskly-note-image.png"
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold transition-colors cursor-pointer text-xs"
            >
              Download
            </a>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-white text-black font-bold hover:bg-neutral-100 transition-colors cursor-pointer text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageLightboxModal;
