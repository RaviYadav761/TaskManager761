import React, { useRef } from "react";
import { Upload } from "lucide-react";
import { PRESET_IMAGES } from "../../data/taskPresets";

const ImagePicker = ({ selectedImage, onSelectImage, onSelectPreset }) => {
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSelectImage(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <label className="block text-xs font-bold text-neutral-800 mb-2">
        3D Task Icon & Image
      </label>

      {/* Preset Selector Grid */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {PRESET_IMAGES.map((preset) => {
          const isSelected = selectedImage === preset.src;
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                if (onSelectPreset) {
                  onSelectPreset(preset);
                } else {
                  onSelectImage(preset.src);
                }
              }}
              className={`p-2 rounded-2xl flex flex-col items-center gap-1.5 transition-all cursor-pointer border ${
                isSelected
                  ? "bg-white border-neutral-900 shadow-sm ring-2 ring-neutral-900/10"
                  : "bg-white/60 border-neutral-200 hover:bg-white hover:border-neutral-300"
              }`}
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#F5F3ED] flex items-center justify-center p-1">
                <img
                  src={preset.src}
                  alt={preset.label}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[10px] font-bold text-neutral-800">
                {preset.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Upload Custom Image Button */}
      <div className="flex items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3.5 py-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-800 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
        >
          <Upload size={13} />
          <span>Upload Custom Photo</span>
        </button>

        {selectedImage && !PRESET_IMAGES.some((p) => p.src === selectedImage) && (
          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
            Custom photo loaded
          </span>
        )}
      </div>
    </div>
  );
};

export default ImagePicker;
