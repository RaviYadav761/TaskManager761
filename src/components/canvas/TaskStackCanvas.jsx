import React, { useState } from "react";
import { Plus, ArrowRight } from "lucide-react";

const TaskStackCanvas = ({
  tasks,
  selectedTaskId,
  onSelectTask,
  onAddTask,
  onOpenCreateModal,
}) => {
  const [inputText, setInputText] = useState("");

  const handleQuickSubmit = (e) => {
    e?.preventDefault();
    const val = inputText.trim();
    if (!val) {
      onOpenCreateModal();
      return;
    }

    // Auto-detect matching image based on text
    let image = "/assets/dumbbell.jpg";
    let category = "Personal";
    const lower = val.toLowerCase();

    if (lower.includes("shop") || lower.includes("buy") || lower.includes("market") || lower.includes("store")) {
      image = "/assets/shopping.jpg";
      category = "Shopping";
    } else if (lower.includes("read") || lower.includes("book") || lower.includes("study")) {
      image = "/assets/books.jpg";
      category = "Personal Growth";
    } else if (lower.includes("gym") || lower.includes("workout") || lower.includes("fitness")) {
      image = "/assets/dumbbell.jpg";
      category = "Health & Fitness";
    } else if (lower.includes("code") || lower.includes("project") || lower.includes("dev") || lower.includes("work")) {
      image = "/assets/laptop.jpg";
      category = "Work & Projects";
    }

    const newTask = {
      id: `task-${Date.now()}`,
      pillTitle: val.length > 15 ? val.substring(0, 14) + "..." : val,
      title: val,
      priority: "Low Priority",
      category: category,
      status: "Pending",
      date: "Today",
      dueDate: new Date().toISOString().split("T")[0],
      time: "6:00 PM – 7:00 PM",
      repeat: "Daily",
      goal: `Complete ${val}`,
      notesHeader: "Task objectives",
      bulletPoints: [
        "Focus on key deliverables",
        "Track milestone progress",
        "Mark completed when finished",
      ],
      image: image,
      createdAt: new Date().toISOString(),
    };

    onAddTask(newTask);
    setInputText("");
    onSelectTask(newTask.id);
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between items-center px-2 sm:px-4 py-3 sm:py-6 relative min-h-0 lg:h-full">
      {/* Top spacing */}
      <div />

      {/* Center Tasks - Arranged in a clean horizontal LINE ("line se show ho"), compact on mobile, exact on desktop */}
      <div className="w-full flex flex-col items-center my-auto py-2 sm:py-4">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-6 sm:p-8 max-w-md animate-in fade-in">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-white shadow-md border border-neutral-150 flex items-center justify-center mb-3 text-neutral-400">
              <Plus size={30} className="text-neutral-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-neutral-900 mb-1 tracking-tight">
              No tasks in your workspace yet
            </h3>
            <p className="text-xs text-neutral-500 mb-4 sm:mb-6 font-medium">
              Your workspace is completely clean. Type a task title below or click "+ Create Task" to start building your stack.
            </p>
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="px-5 py-2.5 sm:px-6 sm:py-3 bg-neutral-900 hover:bg-black text-white rounded-full text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer hover:scale-105"
            >
              <Plus size={15} />
              <span>Create Your First Task</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-row items-end justify-center gap-3.5 sm:gap-6 lg:gap-8 flex-wrap max-w-full px-2 py-2">
            {tasks.map((task) => {
              const isSelected = selectedTaskId === task.id;
              return (
                <div
                  key={task.id}
                  onClick={() => onSelectTask(task.id)}
                  className="flex flex-col items-center cursor-pointer group transition-all duration-300 select-none shrink-0"
                >
                  {/* 3D Model / Image - Scaled compact on mobile, full size on desktop */}
                  <div
                    className={`w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 transition-all duration-300 group-hover:scale-105 flex items-center justify-center ${
                      isSelected
                        ? "scale-105 drop-shadow-xl -translate-y-1"
                        : "opacity-90 hover:opacity-100 drop-shadow-md"
                    }`}
                  >
                    <img
                      src={task.image || "/assets/dumbbell.jpg"}
                      alt={task.pillTitle || task.title}
                      className="w-full h-full object-contain filter contrast-[1.03]"
                    />
                  </div>

                  {/* Pill Button Label - Compact on mobile */}
                  <div
                    className={`mt-1.5 px-4 py-1.5 sm:px-6 sm:py-2 lg:px-7 lg:py-2.5 rounded-full font-bold text-xs sm:text-sm tracking-tight transition-all duration-200 shadow-md ${
                      isSelected
                        ? "bg-white text-neutral-900 ring-2 ring-neutral-900 shadow-lg scale-105"
                        : "bg-white text-neutral-900 hover:bg-neutral-50 hover:shadow-lg"
                    }`}
                  >
                    {task.pillTitle || task.title}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Floating Task Creation Capsule Bar - Compact on mobile */}
      <div className="w-full max-w-xs sm:max-w-md lg:max-w-xl pb-3 sm:pb-4">
        <form
          onSubmit={handleQuickSubmit}
          className="bg-white rounded-full p-1.5 sm:p-2 pl-2 pr-2 sm:pl-2.5 sm:pr-2.5 shadow-xl shadow-neutral-900/4 border border-white/90 flex items-center gap-2 sm:gap-3 transition-shadow hover:shadow-2xl"
        >
          {/* Plus Button */}
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#1C1D1F] hover:bg-black text-white flex items-center justify-center shrink-0 transition-all cursor-pointer hover:scale-105"
            title="Create Task with Image, Date, Time, Goal, Notes"
          >
            <Plus size={16} strokeWidth={2.5} className="sm:w-5 sm:h-5" />
          </button>

          {/* Quick Input Text */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Create your task stack..."
            className="flex-1 bg-transparent text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none px-1.5 sm:px-2 font-medium"
          />

          {/* Submit Arrow Button */}
          <button
            type="submit"
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#1C1D1F] hover:bg-black text-white flex items-center justify-center shrink-0 transition-all cursor-pointer hover:scale-105"
            title="Submit Task"
          >
            <ArrowRight size={16} strokeWidth={2.5} className="sm:w-5 sm:h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskStackCanvas;
