import React, { useState, useEffect } from "react";
import { X, Plus, Calendar, Tag, AlertTriangle, FileText, Check } from "lucide-react";
import { CATEGORIES } from "../../data/initialTasks";
import { getTodayDateInput } from "../../utils/dateUtils";

const TaskModal = ({ isOpen, onClose, onSave, taskToEdit = null }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Work & Projects");
  const [customCategory, setCustomCategory] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState(getTodayDateInput());
  const [status, setStatus] = useState("Pending");
  const [error, setError] = useState("");

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || "");
      setDescription(taskToEdit.description || "");
      if (CATEGORIES.includes(taskToEdit.category)) {
        setCategory(taskToEdit.category);
        setCustomCategory("");
      } else {
        setCategory("Other");
        setCustomCategory(taskToEdit.category || "");
      }
      setPriority(taskToEdit.priority || "Medium");
      setDueDate(taskToEdit.dueDate || getTodayDateInput());
      setStatus(taskToEdit.status || "Pending");
    } else {
      setTitle("");
      setDescription("");
      setCategory("Work & Projects");
      setCustomCategory("");
      setPriority("Medium");
      setDueDate(getTodayDateInput());
      setStatus("Pending");
    }
    setError("");
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please provide a task title.");
      return;
    }

    const finalCategory = category === "Other" ? (customCategory.trim() || "General") : category;

    const taskData = {
      ...(taskToEdit || {}),
      id: taskToEdit ? taskToEdit.id : `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category: finalCategory,
      priority,
      dueDate,
      status,
      createdAt: taskToEdit ? taskToEdit.createdAt : new Date().toISOString(),
    };

    onSave(taskData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl p-6 text-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            {taskToEdit ? <FileText size={20} /> : <Plus size={22} />}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {taskToEdit ? "Edit Task Details" : "Create New Task"}
            </h2>
            <p className="text-xs text-slate-400">
              {taskToEdit
                ? "Update task information, priority, or deadline"
                : "Fill in the details below to organize your task"}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Task Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Complete Practical Assignment 3"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key objectives, links, or instructions..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { level: "High", color: "border-rose-500/50 bg-rose-500/10 text-rose-300", activeBg: "bg-rose-600 text-white" },
                { level: "Medium", color: "border-amber-500/50 bg-amber-500/10 text-amber-300", activeBg: "bg-amber-600 text-white" },
                { level: "Low", color: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300", activeBg: "bg-emerald-600 text-white" },
              ].map((p) => {
                const isSelected = priority === p.level;
                return (
                  <button
                    key={p.level}
                    type="button"
                    onClick={() => setPriority(p.level)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? `${p.activeBg} border-transparent shadow-md`
                        : `${p.color} hover:bg-slate-800`
                    }`}
                  >
                    {isSelected && <Check size={13} strokeWidth={3} />}
                    {p.level}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category & Due Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1">
                <Tag size={13} className="text-indigo-400" />
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="Other">Other (Custom)</option>
              </select>

              {category === "Other" && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category..."
                  className="mt-2 w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              )}
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1">
                <Calendar size={13} className="text-indigo-400" />
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Status selector if editing */}
          {taskToEdit && (
            <div className="pt-1">
              <label className="block text-slate-300 font-semibold mb-1.5">
                Status
              </label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="radio"
                    name="status"
                    checked={status === "Pending"}
                    onChange={() => setStatus("Pending")}
                    className="accent-indigo-600"
                  />
                  <span className="text-amber-300 font-medium">Pending</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="radio"
                    name="status"
                    checked={status === "Completed"}
                    onChange={() => setStatus("Completed")}
                    className="accent-emerald-600"
                  />
                  <span className="text-emerald-300 font-medium">Completed</span>
                </label>
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
            >
              {taskToEdit ? <Check size={14} /> : <Plus size={14} />}
              {taskToEdit ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
