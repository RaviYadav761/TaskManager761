import React, { useState, useEffect } from "react";
import { STORAGE_KEYS, getStorageItem } from "../../utils/storage";

const DEFAULT_PROFILE = {
  fullName: "Ravi Yadav",
  email: "ravi.yadav@taskly.io",
  role: "TYCS Computer Science",
  avatar: "/assets/avatar.jpg",
};

const SidebarProfile = ({ onOpenSynopsis, onOpenSettings }) => {
  const [profile, setProfile] = useState(() => {
    return getStorageItem(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
  });

  useEffect(() => {
    const handleUpdate = () => {
      setProfile(getStorageItem(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE));
    };

    window.addEventListener("taskly_settings_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("taskly_settings_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return (
    <div
      onClick={onOpenSettings || onOpenSynopsis}
      className="flex items-center gap-3 p-2 rounded-2xl hover:bg-neutral-200/50 transition-colors cursor-pointer"
      title="Open Profile & Settings"
    >
      <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-black text-sm shrink-0 border border-neutral-300/80 shadow-xs">
        {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : "R"}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-neutral-900 truncate">
          {profile.fullName || "Ravi Yadav"}
        </h4>
        <p className="text-[11px] text-neutral-500 font-medium truncate">
          {profile.role || "TYCS Computer Science"}
        </p>
      </div>
    </div>
  );
};

export default SidebarProfile;