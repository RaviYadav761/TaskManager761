import { useState, useEffect } from "react";
import { STORAGE_KEYS, getStorageItem } from "../utils/storage";

export const useTheme = () => {
  const [showFloatingBot, setShowFloatingBot] = useState(() => {
    const profile = getStorageItem(STORAGE_KEYS.PROFILE, null);
    return Boolean(profile?.showFloatingBot);
  });

  useEffect(() => {
    const applySettingsAndTheme = () => {
      try {
        const saved = getStorageItem(STORAGE_KEYS.PROFILE, null);
        if (saved) {
          setShowFloatingBot(Boolean(saved.showFloatingBot));
          const currentTheme = saved.theme || "normal";
          document.body.className = `theme-${currentTheme}`;
        } else {
          document.body.className = "theme-normal";
        }
      } catch {
        document.body.className = "theme-normal";
      }
    };

    applySettingsAndTheme();
    window.addEventListener("taskly_settings_updated", applySettingsAndTheme);
    window.addEventListener("storage", applySettingsAndTheme);

    return () => {
      window.removeEventListener("taskly_settings_updated", applySettingsAndTheme);
      window.removeEventListener("storage", applySettingsAndTheme);
    };
  }, []);

  return { showFloatingBot };
};
