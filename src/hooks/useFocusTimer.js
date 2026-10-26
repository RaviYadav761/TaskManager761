import { useState, useEffect, useCallback, useRef } from "react";
import { STORAGE_KEYS, getStorageItem, setStorageItem } from "../utils/storage";
import { playVictoryChime } from "../utils/audio";

export const useFocusTimer = (tasks, onTaskCompleted) => {
  // Focus Timer persistent state
  const [focusTimer, setFocusTimer] = useState(() => {
    const saved = getStorageItem(STORAGE_KEYS.ACTIVE_TIMER, null);
    if (saved) {
      if (saved.isRunning && saved.targetEndTime) {
        const remaining = Math.max(0, Math.round((saved.targetEndTime - Date.now()) / 1000));
        return {
          ...saved,
          timeLeft: remaining,
          isRunning: remaining > 0,
        };
      }
      return saved;
    }
    return {
      taskId: tasks[0]?.id || "",
      durationMinutes: 60,
      timeLeft: 3600,
      targetEndTime: null,
      isRunning: false,
      isCompleted: false,
    };
  });

  // Focus stats in localStorage
  const [focusStats, setFocusStats] = useState(() => {
    return getStorageItem(STORAGE_KEYS.FOCUS_STATS, { sessionsCompleted: 0, totalMinutesFocused: 0 });
  });

  // Ref to always have latest onTaskCompleted without triggering effect recreation
  const onTaskCompletedRef = useRef(onTaskCompleted);
  useEffect(() => {
    onTaskCompletedRef.current = onTaskCompleted;
  }, [onTaskCompleted]);

  // Active task ID with fallback to first task
  const activeTaskId = focusTimer.taskId || tasks[0]?.id || "";

  // Global Timer background ticking that persists across tab switches
  useEffect(() => {
    let interval = null;
    if (focusTimer.isRunning && focusTimer.targetEndTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.round((focusTimer.targetEndTime - now) / 1000));

        if (remaining <= 0) {
          clearInterval(interval);
          playVictoryChime();

          if (focusTimer.taskId && onTaskCompletedRef.current) {
            onTaskCompletedRef.current(focusTimer.taskId);
          }

          setFocusStats((prev) => {
            const updated = {
              sessionsCompleted: prev.sessionsCompleted + 1,
              totalMinutesFocused: prev.totalMinutesFocused + (focusTimer.durationMinutes || 60),
            };
            setStorageItem(STORAGE_KEYS.FOCUS_STATS, updated);
            return updated;
          });

          setFocusTimer((prev) => {
            const next = {
              ...prev,
              timeLeft: 0,
              isRunning: false,
              isCompleted: true,
              targetEndTime: null,
            };
            setStorageItem(STORAGE_KEYS.ACTIVE_TIMER, next);
            return next;
          });
        } else {
          setFocusTimer((prev) => {
            const next = { ...prev, timeLeft: remaining };
            setStorageItem(STORAGE_KEYS.ACTIVE_TIMER, next);
            return next;
          });
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [focusTimer.isRunning, focusTimer.targetEndTime, focusTimer.taskId, focusTimer.durationMinutes]);

  const handleStartTimer = useCallback((taskIdToFocus) => {
    setFocusTimer((prev) => {
      const tid = taskIdToFocus || prev.taskId || tasks.find((t) => t.status !== "Completed")?.id || "";
      const targetEndTime = Date.now() + prev.timeLeft * 1000;
      const updated = {
        ...prev,
        taskId: tid,
        isRunning: true,
        isCompleted: false,
        targetEndTime: targetEndTime,
      };
      setStorageItem(STORAGE_KEYS.ACTIVE_TIMER, updated);
      return updated;
    });
  }, [tasks]);

  const handlePauseTimer = useCallback(() => {
    setFocusTimer((prev) => {
      const updated = {
        ...prev,
        isRunning: false,
        targetEndTime: null,
      };
      setStorageItem(STORAGE_KEYS.ACTIVE_TIMER, updated);
      return updated;
    });
  }, []);

  const handleResetTimer = useCallback(() => {
    setFocusTimer((prev) => {
      const totalSecs = (prev.durationMinutes || 60) * 60;
      const updated = {
        ...prev,
        timeLeft: totalSecs,
        isRunning: false,
        isCompleted: false,
        targetEndTime: null,
      };
      setStorageItem(STORAGE_KEYS.ACTIVE_TIMER, updated);
      return updated;
    });
  }, []);

  const handleSelectDuration = useCallback((minutes) => {
    setFocusTimer((prev) => {
      const totalSecs = minutes * 60;
      const targetEndTime = prev.isRunning ? Date.now() + totalSecs * 1000 : null;
      const updated = {
        ...prev,
        durationMinutes: minutes,
        timeLeft: totalSecs,
        targetEndTime: targetEndTime,
        isCompleted: false,
      };
      setStorageItem(STORAGE_KEYS.ACTIVE_TIMER, updated);
      return updated;
    });
  }, []);

  const handleSelectTimerTask = useCallback((taskId) => {
    setFocusTimer((prev) => {
      const updated = { ...prev, taskId: taskId, isCompleted: false };
      setStorageItem(STORAGE_KEYS.ACTIVE_TIMER, updated);
      return updated;
    });
  }, []);

  const handleCompleteEarly = useCallback(() => {
    if (focusTimer.taskId && onTaskCompletedRef.current) {
      onTaskCompletedRef.current(focusTimer.taskId);
    }
    playVictoryChime();

    setFocusStats((prev) => {
      const updated = {
        sessionsCompleted: prev.sessionsCompleted + 1,
        totalMinutesFocused: prev.totalMinutesFocused + (focusTimer.durationMinutes || 60),
      };
      setStorageItem(STORAGE_KEYS.FOCUS_STATS, updated);
      return updated;
    });

    setFocusTimer((prev) => {
      const next = {
        ...prev,
        timeLeft: 0,
        isRunning: false,
        isCompleted: true,
        targetEndTime: null,
      };
      setStorageItem(STORAGE_KEYS.ACTIVE_TIMER, next);
      return next;
    });
  }, [focusTimer.taskId, focusTimer.durationMinutes]);

  const currentFocusTimer = {
    ...focusTimer,
    taskId: focusTimer.taskId || activeTaskId,
  };

  return {
    focusTimer: currentFocusTimer,
    focusStats,
    handleStartTimer,
    handlePauseTimer,
    handleResetTimer,
    handleSelectDuration,
    handleSelectTimerTask,
    handleCompleteEarly,
  };
};
