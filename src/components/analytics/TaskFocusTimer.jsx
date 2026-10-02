import React, { useState, useEffect } from "react";
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Flame,
  Clock,
  Target
} from "lucide-react";
import { playVictoryChime } from "../../utils/audio";

const DURATION_PRESETS = [
  { label: "15 Min", minutes: 15 },
  { label: "25 Min", minutes: 25 },
  { label: "45 Min", minutes: 45 },
  { label: "1 Hour", minutes: 60 },
  { label: "2 Hours", minutes: 120 },
];

const TaskFocusTimer = ({
  tasks = [],
  onToggleStatus,
  focusTimer: globalFocusTimer,
  onStartTimer,
  onPauseTimer,
  onResetTimer,
  onSelectDuration: globalSelectDuration,
  onSelectTimerTask,
  focusStats: globalFocusStats,
  onCompleteEarly: globalCompleteEarly,
}) => {
  // Pending tasks list
  const pendingTasks = tasks.filter((t) => t.status !== "Completed");

  // Local fallback state if not driven globally
  const [localTaskId, setLocalTaskId] = useState(() => {
    return pendingTasks[0]?.id || tasks[0]?.id || "";
  });
  const [customInput, setCustomInput] = useState("");

  const selectedTaskId = globalFocusTimer?.taskId || localTaskId || pendingTasks[0]?.id || "";
  const currentTask = tasks.find((t) => t.id === selectedTaskId) || pendingTasks[0] || null;

  const durationMinutes = globalFocusTimer ? globalFocusTimer.durationMinutes || 60 : 60;
  const timeLeft = globalFocusTimer ? globalFocusTimer.timeLeft : 3600;
  const isRunning = Boolean(globalFocusTimer?.isRunning);
  const isCompleted = Boolean(globalFocusTimer?.isCompleted);

  const focusStats = globalFocusStats || { sessionsCompleted: 0, totalMinutesFocused: 0 };

  const handleSelectDuration = (minutes) => {
    if (globalSelectDuration) {
      globalSelectDuration(minutes);
    }
  };

  const handleCustomDurationSubmit = (e) => {
    e.preventDefault();
    const parsed = parseInt(customInput, 10);
    if (parsed && parsed > 0 && parsed <= 720) {
      handleSelectDuration(parsed);
      setCustomInput("");
    } else {
      alert("Please enter a valid duration between 1 and 720 minutes.");
    }
  };

  const handleStart = () => {
    if (onStartTimer) {
      onStartTimer(selectedTaskId);
    }
  };

  const handlePause = () => {
    if (onPauseTimer) {
      onPauseTimer();
    }
  };

  const handleReset = () => {
    if (onResetTimer) {
      onResetTimer();
    }
  };

  const handleCompleteEarly = () => {
    if (!currentTask) return;
    if (
      window.confirm(
        `Are you sure you want to finish focus session early and mark "${currentTask.title}" as Completed?`
      )
    ) {
      if (globalCompleteEarly) {
        globalCompleteEarly();
      } else if (onToggleStatus) {
        onToggleStatus(currentTask.id);
        playVictoryChime();
      }
    }
  };

  // Format HH:MM:SS
  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const pad = (n) => String(n).padStart(2, "0");
    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  // Percentage complete
  const totalSeconds = durationMinutes * 60;
  const progressPercent =
    totalSeconds > 0
      ? Math.min(100, Math.round(((totalSeconds - timeLeft) / totalSeconds) * 100))
      : 0;

  return (
    <div className="bg-white rounded-3xl p-6 lg:p-8 mb-8 border border-neutral-200/90 shadow-sm transition-all">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-150 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center shadow-xs">
              <Flame size={17} className="text-amber-400" />
            </div>
            <h2 className="text-lg font-black text-neutral-900 tracking-tight">
              Task Focus Timer & Time Tracker
            </h2>
          </div>
          <p className="text-xs text-neutral-500 font-medium">
            Set your focus task and session duration. When the countdown completes, your task is automatically marked as <strong>Completed</strong>.
          </p>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3.5 py-1.5 rounded-2xl bg-[#FAF9F6] border border-neutral-200/80 text-center shadow-2xs">
            <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Sessions
            </span>
            <span className="text-xs font-black text-neutral-900">
              {focusStats.sessionsCompleted} Done
            </span>
          </div>
          <div className="px-3.5 py-1.5 rounded-2xl bg-[#FAF9F6] border border-neutral-200/80 text-center shadow-2xs">
            <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Focused
            </span>
            <span className="text-xs font-black text-emerald-600">
              {focusStats.totalMinutesFocused} Min
            </span>
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div className="my-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between animate-in fade-in relative z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
            <div>
              <h4 className="font-extrabold text-sm">
                🎉 Great Job! Focus Session Finished!
              </h4>
              <p className="text-xs text-emerald-700 font-medium">
                "{currentTask?.title || "Task"}" has been automatically marked as Completed!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            Start Next Session
          </button>
        </div>
      )}

      {/* Main Grid: Controls & Countdown Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-center relative z-10">
        {/* Left Column: Task & Duration Selectors */}
        <div className="lg:col-span-6 space-y-5">
          {/* 1. Select Task */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-2 flex items-center gap-1.5">
              <Target size={14} className="text-neutral-500" />
              <span>Choose Task to Focus On</span>
            </label>

            {pendingTasks.length > 0 ? (
              <select
                value={selectedTaskId}
                onChange={(e) => {
                  if (onSelectTimerTask) {
                    onSelectTimerTask(e.target.value);
                  } else {
                    setLocalTaskId(e.target.value);
                  }
                }}
                disabled={isRunning}
                className="w-full bg-[#FAF9F6] hover:bg-white focus:bg-white border border-neutral-200 rounded-2xl px-4 py-3 text-xs font-bold text-neutral-900 outline-none focus:ring-2 focus:ring-neutral-900/10 cursor-pointer transition-all shadow-2xs"
              >
                {pendingTasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.priority || "Pending"}) • Due: {t.date || "Today"}
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 bg-white/50 border border-dashed border-neutral-200 rounded-2xl text-xs text-neutral-500 text-center font-medium">
                All tasks completed! Create a new task to start focusing.
              </div>
            )}
          </div>

          {/* 2. Current Task Preview Card */}
          {currentTask && (
            <div className="p-3.5 bg-[#FAF9F6] rounded-2xl border border-neutral-200/90 flex items-center gap-3.5 shadow-2xs">
              {currentTask.image && (
                <div className="w-12 h-12 rounded-xl bg-white border border-neutral-200 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                  <img
                    src={currentTask.image}
                    alt={currentTask.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-extrabold text-neutral-900 truncate">
                  {currentTask.title}
                </h4>
                <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                  {currentTask.goal || currentTask.notesHeader || "Dedicated focus session"}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-200/70 text-neutral-700">
                    {currentTask.category || "General"}
                  </span>
                  <span className="text-[10px] font-semibold text-neutral-500">
                    {currentTask.time || "Scheduled"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 3. Choose Duration */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-2 flex items-center gap-1.5">
              <Clock size={14} className="text-neutral-500" />
              <span>Select Focus Duration</span>
            </label>

            {/* Presets */}
            <div className="grid grid-cols-5 gap-2 mb-3">
              {DURATION_PRESETS.map((preset) => {
                const isActive = durationMinutes === preset.minutes;
                return (
                  <button
                    key={preset.minutes}
                    type="button"
                    onClick={() => handleSelectDuration(preset.minutes)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer text-center border ${
                      isActive
                        ? "bg-neutral-900 text-white border-neutral-900 shadow-sm scale-102"
                        : "bg-white/80 hover:bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Custom Minutes Input */}
            <form onSubmit={handleCustomDurationSubmit} className="flex gap-2">
              <input
                type="number"
                min="1"
                max="720"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Or custom minutes (e.g. 90, 120)..."
                disabled={isRunning}
                className="flex-1 bg-white/80 focus:bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-900 outline-none focus:ring-1 focus:ring-neutral-900 shadow-2xs"
              />
              <button
                type="submit"
                disabled={isRunning || !customInput}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-black text-white disabled:opacity-40 transition-colors cursor-pointer"
              >
                Set
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Big Countdown Timer Display */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-[#FAF9F6] rounded-3xl border border-neutral-200/90 shadow-2xs text-center">
          {/* Status Label */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold mb-3 border bg-white border-neutral-200 shadow-2xs">
            <span
              className={`w-2 h-2 rounded-full ${
                isRunning
                  ? "bg-emerald-500 animate-pulse"
                  : isCompleted
                  ? "bg-emerald-600"
                  : "bg-amber-400"
              }`}
            />
            <span className="text-neutral-700">
              {isRunning
                ? "Focus in Progress 🔥"
                : isCompleted
                ? "Session Completed 🎉"
                : "Timer Ready to Start"}
            </span>
          </div>

          {/* Big Time Display */}
          <div className="my-2">
            <h1 className="text-5xl sm:text-6xl font-black text-neutral-900 tracking-tight font-mono">
              {formatTime(timeLeft)}
            </h1>
            <p className="text-xs text-neutral-400 font-semibold mt-1">
              {durationMinutes} min session • {progressPercent}% elapsed
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-xs h-2.5 bg-neutral-200/80 rounded-full overflow-hidden my-4 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-neutral-900 to-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Controls Button Row */}
          <div className="flex items-center gap-3 mt-2 flex-wrap justify-center">
            {/* Play / Pause Toggle */}
            {!isRunning ? (
              <button
                type="button"
                onClick={handleStart}
                disabled={!currentTask}
                className="px-6 py-3 rounded-2xl bg-neutral-900 hover:bg-black text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer hover:scale-105 disabled:opacity-40"
              >
                <Play size={16} fill="currentColor" />
                <span>Start Focus</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePause}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer hover:scale-105"
              >
                <Pause size={16} fill="currentColor" />
                <span>Pause</span>
              </button>
            )}

            {/* Reset */}
            <button
              type="button"
              onClick={handleReset}
              className="w-11 h-11 rounded-2xl bg-white hover:bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer shadow-2xs"
              title="Reset Timer"
            >
              <RotateCcw size={16} />
            </button>

            {/* Complete Early */}
            <button
              type="button"
              onClick={handleCompleteEarly}
              disabled={!currentTask || isCompleted}
              className="px-4 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
              title="Mark task as completed immediately"
            >
              <CheckCircle2 size={16} />
              <span>Complete Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFocusTimer;
