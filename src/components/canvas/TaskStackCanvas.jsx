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
    <div className="flex-1 flex flex-col justify-between items-center px-4 py-6 relative h-full min-h-screen">
      {/* Top spacing */}
      <div />

      {/* Center Tasks - Arranged in a clean horizontal LINE ("line se show ho") */}
      <div className="w-full flex flex-col items-center my-auto py-4">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-8 max-w-md animate-in fade-in">
            <div className="w-20 h-20 rounded-3xl bg-white shadow-md border border-neutral-150 flex items-center justify-center mb-4 text-neutral-400">
              <Plus size={36} className="text-neutral-400" />
            </div>
            <h3 className="text-xl font-black text-neutral-900 mb-1 tracking-tight">
              No tasks in your workspace yet
            </h3>
            <p className="text-xs text-neutral-500 mb-6 font-medium">
              Your workspace is completely clean. Type a task title below or click "+ Create Task" to start building your stack.
            </p>
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="px-6 py-3 bg-neutral-900 hover:bg-black text-white rounded-full text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer hover:scale-105"
            >
              <Plus size={16} />
              <span>Create Your First Task</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-row items-end justify-center gap-7 sm:gap-9 flex-wrap max-w-full px-4 py-2">
            {tasks.map((task) => {
              const isSelected = selectedTaskId === task.id;
              return (
                <div
                  key={task.id}
                  onClick={() => onSelectTask(task.id)}
                  className="flex flex-col items-center cursor-pointer group transition-all duration-300 select-none shrink-0"
                >
                  {/* 3D Model / Image */}
                  <div
                    className={`w-32 h-32 sm:w-40 sm:h-40 transition-all duration-300 group-hover:scale-105 flex items-center justify-center ${
                      isSelected
                        ? "scale-105 drop-shadow-xl -translate-y-1.5"
                        : "opacity-90 hover:opacity-100 drop-shadow-md"
                    }`}
                  >
                    <img
                      src={task.image || "/assets/dumbbell.jpg"}
                      alt={task.pillTitle || task.title}
                      className="w-full h-full object-contain filter contrast-[1.03]"
                    />
                  </div>

                  {/* Pill Button Label */}
                  <div
                    className={`mt-2 px-7 py-2.5 rounded-full font-bold text-sm tracking-tight transition-all duration-200 shadow-md ${
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

      {/* Bottom Floating Task Creation Capsule Bar */}
      <div className="w-full max-w-xl pb-4">
        <form
          onSubmit={handleQuickSubmit}
          className="bg-white rounded-full p-2 pl-2.5 pr-2.5 shadow-xl shadow-neutral-900/4 border border-white/90 flex items-center gap-3 transition-shadow hover:shadow-2xl"
        >
          {/* Plus Button - Opens Image 2 Create Task Modal */}
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="w-11 h-11 rounded-full bg-[#1C1D1F] hover:bg-black text-white flex items-center justify-center shrink-0 transition-all cursor-pointer hover:scale-105"
            title="Create Task with Image, Date, Time, Goal, Notes"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>

          {/* Quick Input Text */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Create your task stack..."
            className="flex-1 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 outline-none px-2 font-medium"
          />

          {/* Submit Arrow Button */}
          <button
            type="submit"
            className="w-11 h-11 rounded-full bg-[#1C1D1F] hover:bg-black text-white flex items-center justify-center shrink-0 transition-all cursor-pointer hover:scale-105"
            title="Submit Task"
          >
            <ArrowRight size={20} strokeWidth={2.5} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskStackCanvas;
