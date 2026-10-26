import { useState, useEffect, useCallback } from "react";
import { STORAGE_KEYS, getStorageItem, setStorageItem } from "../utils/storage";
import { INITIAL_TASKS } from "../data/initialTasks";

export const useTasks = () => {
  // Load tasks from LocalStorage or initialize with default sample tasks (Gym, Shopping, Reading, etc.)
  const [tasks, setTasks] = useState(() => {
    const saved = getStorageItem(STORAGE_KEYS.TASKS, null);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    return INITIAL_TASKS;
  });

  // Selected task in the 3D row
  const [selectedTaskId, setSelectedTaskId] = useState(() => {
    return tasks[0]?.id || "";
  });

  // Sync to LocalStorage whenever tasks change
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.TASKS, tasks);
  }, [tasks]);

  const handleAddTask = useCallback((newTask) => {
    setTasks((prev) => [newTask, ...prev]);
    setSelectedTaskId(newTask.id);
  }, []);

  const handleDeleteTask = useCallback((taskId) => {
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== taskId);
      return updated;
    });
    setSelectedTaskId((prevId) => {
      if (prevId === taskId) {
        const remaining = tasks.filter((t) => t.id !== taskId);
        return remaining[0]?.id || "";
      }
      return prevId;
    });
  }, [tasks]);

  const handleUpdateTask = useCallback((updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  }, []);

  const handleToggleTaskStatus = useCallback((taskId) => {
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id === taskId) {
          const nextStatus = t.status === "Completed" ? "Pending" : "Completed";
          return { ...t, status: nextStatus };
        }
        return t;
      });
      return updated;
    });

    setSelectedTaskId((prevId) => {
      if (prevId === taskId) {
        const remainingPending = tasks.filter(
          (t) => t.id !== taskId && t.status !== "Completed"
        );
        return remainingPending[0]?.id || "";
      }
      return prevId;
    });
  }, [tasks]);

  return {
    tasks,
    setTasks,
    selectedTaskId,
    setSelectedTaskId,
    handleAddTask,
    handleDeleteTask,
    handleUpdateTask,
    handleToggleTaskStatus,
  };
};
