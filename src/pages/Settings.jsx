import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import {
  CheckCircle2,
  Bot,
  RotateCcw,
} from "lucide-react";
import {
  STORAGE_KEYS,
  getStorageItem,
  setStorageItem,
  clearTasklyStorage,
} from "../utils/storage";

const ACCENT_COLORS = [
  { id: "emerald", label: "Emerald Green", hex: "#10B981" },
  { id: "blue", label: "Royal Blue", hex: "#3B82F6" },
  { id: "orange", label: "Vibrant Orange", hex: "#F97316" },
  { id: "pink", label: "Soft Pink", hex: "#EC4899" },
  { id: "purple", label: "Royal Purple", hex: "#8B5CF6" },
];

const DEFAULT_PROFILE = {
  fullName: "Ravi Yadav",
  email: "ravi.yadav@taskly.io",
  role: "TYCS Computer Science",
  timeZone: "IST (Indian Standard Time)",
  avatar: "/assets/avatar.jpg",
  theme: "normal",
  accentColor: "emerald",
  showFloatingBot: false,
};

const Settings = ({
  embedded = false,
  activeTab = "settings",
  setActiveTab = () => {},
  onOpenSynopsis = () => {},
  onOpenChatbot = () => {},
}) => {
  const [profile, setProfile] = useState(() => {
    return getStorageItem(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Sync to localStorage and broadcast to app
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.PROFILE, profile);
    window.dispatchEvent(
      new CustomEvent("taskly_settings_updated", { detail: profile })
    );
  }, [profile]);

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newAvatar = event.target.result;
          setProfile((prev) => ({ ...prev, avatar: newAvatar }));
          setSavedSuccess(true);
          setTimeout(() => setSavedSuccess(false), 2500);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = (e) => {
    e?.preventDefault();
    setStorageItem(STORAGE_KEYS.PROFILE, profile);
    window.dispatchEvent(
      new CustomEvent("taskly_settings_updated", { detail: profile })
    );
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all tasks, notes, and metrics back to initial defaults? This action cannot be undone."
      )
    ) {
      clearTasklyStorage();
      alert("All workspace data has been reset to defaults.");
      window.location.reload();
    }
  };

  const settingsContent = (
    <div className="flex-1 p-6 lg:p-10 max-w-4xl mx-auto overflow-y-auto h-screen no-scrollbar">
      {/* Success Notification Banner */}
      {savedSuccess && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>Profile and settings saved successfully! All updates are live.</span>
          </div>
          <button
            type="button"
            onClick={() => setSavedSuccess(false)}
            className="text-emerald-600 hover:text-emerald-800 text-sm font-bold cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* 1. CARD 1: Profile Information */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-neutral-150 mb-6">
        <h2 className="text-lg font-bold text-neutral-900 tracking-tight">
          Profile Information
        </h2>
        <p className="text-xs text-neutral-500 mt-1 mb-6 font-medium">
          Update your personal details, name, and role for this workspace.
        </p>

        {/* Avatar Row */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-black text-xl shadow-xs">
            {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : "R"}
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="border border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-neutral-700 shadow-2xs transition-colors cursor-pointer"
            >
              Change photo
            </button>
            <p className="text-[11px] text-neutral-400 mt-1 font-medium">
              JPG or PNG, max 2MB
            </p>
          </div>
        </div>

        {/* Inputs Form */}
        <form onSubmit={handleSaveChanges} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={profile.fullName || ""}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Ravi Yadav"
                className="w-full bg-[#FAF9F6] focus:bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-xs font-medium text-neutral-900 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/10 transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={profile.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="ravi.yadav@taskly.io"
                className="w-full bg-[#FAF9F6] focus:bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-xs font-medium text-neutral-900 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/10 transition-all shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Role / Title
            </label>
            <input
              type="text"
              value={profile.role || ""}
              onChange={(e) => handleInputChange("role", e.target.value)}
              placeholder="TYCS Computer Science"
              className="w-full bg-[#FAF9F6] focus:bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-xs font-medium text-neutral-900 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/10 transition-all shadow-2xs"
            />
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded-xl px-6 py-2.5 text-xs sm:text-sm transition-all shadow-sm cursor-pointer hover:scale-102"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* 2. CARD 2: Appearance */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-neutral-150 mb-6">
        <h2 className="text-lg font-bold text-neutral-900 tracking-tight">
          Appearance & Theme
        </h2>
        <p className="text-xs text-neutral-500 mt-1 mb-6 font-medium">
          Customize how Taskly looks on your device. Choose between Taskly's signature warm cream or crisp light mode.
        </p>

        {/* Theme Selection */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-neutral-700 mb-3">
            Theme
          </label>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div
              onClick={() => {
                handleInputChange("theme", "normal");
                document.body.className = "theme-normal";
              }}
              className={`rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
                profile.theme === "normal" || (!profile.theme && profile.theme !== "light")
                  ? "border-2 border-[#10B981] bg-white shadow-xs"
                  : "border border-neutral-200 hover:border-neutral-300 bg-white"
              }`}
            >
              <div className="w-full h-14 rounded-xl bg-[#F5F3ED] border border-[#E2DDD3] mb-3" />
              <span className="text-xs font-bold text-neutral-800">Normal (Default Warm)</span>
            </div>

            <div
              onClick={() => {
                handleInputChange("theme", "light");
                document.body.className = "theme-light";
              }}
              className={`rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
                profile.theme === "light"
                  ? "border-2 border-[#10B981] bg-white shadow-xs"
                  : "border border-neutral-200 hover:border-neutral-300 bg-white"
              }`}
            >
              <div className="w-full h-14 rounded-xl bg-[#F8F9FA] border border-neutral-200 mb-3" />
              <span className="text-xs font-bold text-neutral-800">Light (Clean White)</span>
            </div>
          </div>
        </div>

        {/* Accent Color Selection */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-3">
            Accent Color
          </label>
          <div className="flex items-center gap-3">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleInputChange("accentColor", c.id)}
                style={{ backgroundColor: c.hex }}
                className={`w-8 h-8 rounded-full transition-transform hover:scale-110 cursor-pointer shadow-xs ${
                  profile.accentColor === c.id
                    ? "ring-3 ring-offset-2 ring-[#10B981] scale-105"
                    : ""
                }`}
                title={c.label}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 3. CARD 3: TaskBot AI Floating Button Visibility Setting */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-neutral-150 mb-6">
        <div className="flex items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5 sm:mt-0">
              <Bot size={20} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                <span>TaskBot AI Floating Button</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-600">
                  {profile.showFloatingBot ? "Always Visible" : "Hidden (Default)"}
                </span>
              </h2>
              <p className="text-xs text-neutral-500 mt-1 max-w-xl font-normal leading-relaxed">
                Choose whether the floating <strong>Ask TaskBot</strong> button should always be visible on your screen. By default, it is hidden, and you can open TaskBot AI anytime from the sidebar menu.
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={() => {
              const nextVal = !profile.showFloatingBot;
              const updatedProfile = { ...profile, showFloatingBot: nextVal };
              setProfile(updatedProfile);
              setStorageItem(STORAGE_KEYS.PROFILE, updatedProfile);
              window.dispatchEvent(
                new CustomEvent("taskly_settings_updated", { detail: updatedProfile })
              );
              setSavedSuccess(true);
              setTimeout(() => setSavedSuccess(false), 2000);
            }}
            className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              profile.showFloatingBot ? "bg-emerald-500" : "bg-neutral-300"
            }`}
            title="Toggle floating bot visibility"
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                profile.showFloatingBot ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px]">
          <span className="text-neutral-500">
            {profile.showFloatingBot
              ? "✓ Floating button will remain visible in the bottom-right corner of every screen."
              : "✓ Floating button is hidden. You can open TaskBot AI anytime from the left sidebar."}
          </span>
          <span className={`font-bold ${profile.showFloatingBot ? "text-emerald-600" : "text-neutral-400"}`}>
            {profile.showFloatingBot ? "Status: Active" : "Status: Off"}
          </span>
        </div>
      </div>

      {/* 4. CARD 4: Reset Workspace Data */}
      <div className="bg-[#FFF8F8] border border-rose-200 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-bold text-rose-600 text-sm">Reset Workspace to Defaults</h3>
          <p className="text-xs text-rose-500 mt-0.5 font-medium">
            Reset all tasks, notes, and metrics back to initial sample deliverables.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDeleteAccount}
          className="border border-rose-300 hover:bg-rose-100/60 text-rose-600 rounded-xl px-5 py-2.5 text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
        >
          <RotateCcw size={13} />
          <span>Reset All Data</span>
        </button>
      </div>

      {/* 5. CARD 5: Active Workspace Status */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-150 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
            {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : "R"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-neutral-900 text-sm">
                {profile.fullName || "Ravi Yadav"}
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                Personal Workspace Active
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-medium mt-0.5">
              {profile.email || "ravi.yadav@taskly.io"} • Direct Access Enabled
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return settingsContent;
  }

  return (
    <div className="min-h-screen w-full bg-[#F5F3ED] text-[#1E2022] flex flex-row overflow-x-auto">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSynopsis={onOpenSynopsis}
        onOpenChatbot={onOpenChatbot}
      />
      {settingsContent}
    </div>
  );
};

export default Settings;
