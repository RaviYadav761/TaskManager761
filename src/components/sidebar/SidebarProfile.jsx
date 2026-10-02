import React, { useState, useEffect } from "react";

const LOCAL_STORAGE_PROFILE_KEY = "taskly_profile_v1";

const SidebarProfile = ({ onOpenSynopsis, onOpenSettings }) => {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      fullName: "Alex Morgan",
      avatar: "/assets/avatar.jpg",
    };
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
        if (saved) setProfile(JSON.parse(saved));
      } catch (e) {}
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
      className="p-3 bg-[#EDE9E1] hover:bg-[#E5E0D6] rounded-[24px] w-fit cursor-pointer transition-all shadow-xs group"
      title={`Click to view Profile & Settings (${profile.fullName || "Alex Morgan"})`}
    >
      <div className="relative">
        <img
          src={profile.avatar || "/assets/avatar.jpg"}
          alt={profile.fullName || "User Avatar"}
          className="w-12 h-12 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform"
        />
        <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#EDE9E1] absolute bottom-0 right-0"></span>
      </div>
    </div>
  );
};

export default SidebarProfile;