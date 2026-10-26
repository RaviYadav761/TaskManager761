/**
 * Storage Utility for Taskly Workspace
 * Centralizes localStorage keys and provides safe get/set/remove methods.
 * Prevents accidental erasure of non-app data on the domain.
 */

export const STORAGE_KEYS = {
  TASKS: "ravi_taskly_tasks_v3",
  AUTH_USER: "taskly_auth_user",
  REGISTERED_USERS: "taskly_registered_users",
  PROFILE: "taskly_profile_v1",
  NOTES: "taskly_notes_v2",
  ACTIVE_TIMER: "taskly_active_timer",
  FOCUS_STATS: "taskly_focus_stats",
};

/**
 * Safely retrieve parsed JSON from localStorage
 */
export const getStorageItem = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null || item === undefined) return fallback;
    return JSON.parse(item);
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return fallback;
  }
};

/**
 * Safely save JSON data to localStorage
 */
export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Safely remove an item from localStorage
 */
export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
};

/**
 * Safely resets only Taskly-specific data without touching other apps on localhost
 */
export const clearTasklyStorage = () => {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith("taskly_") || key.startsWith("ravi_taskly_"))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error("Error clearing Taskly storage:", error);
  }
};
