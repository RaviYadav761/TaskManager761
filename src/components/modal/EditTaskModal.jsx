import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Calendar,
  Clock,
  Target,
  FileText,
  Plus,
  Trash2,
  Tag,
  CheckCircle2,
  Image as ImageIcon
} from "lucide-react";
import { CATEGORIES, PRIORITIES } from "../../data/initialTasks";

const PRESET_IMAGES = [
  { label: "Dumbbell", src: "/assets/dumbbell.jpg" },
  { label: "Books", src: "/assets/books.jpg" },
  { label: "Laptop", src: "/assets/laptop.jpg" },
  { label: "Shopping", src: "/assets/shopping.jpg" },
];

const EditTaskModal = ({ isOpen, onClose, task, onUpdateTask }) => {
  const fileInputRef = useRef(null);
  const dateInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [priority, setPriority] = useState("Low Priority");
  const [category, setCategory] = useState("General");
  const [status, setStatus] = useState("Pending");
  const [dueDate, setDueDate] = useState("");
  const [dateDisplay, setDateDisplay] = useState("Today");
  const [time, setTime] = useState("");
  const [repeat, setRepeat] = useState("Daily");
  const [notesHeader, setNotesHeader] = useState("");
  const [bulletPoints, setBulletPoints] = useState([]);
  const [image, setImage] = useState("/assets/dumbbell.jpg");

  // Load task into state when opened
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setGoal(task.goal || "");
      setPriority(task.priority || "Low Priority");
      setCategory(task.category || "General");
      setStatus(task.status || "Pending");
      setDueDate(task.dueDate || new Date().toISOString().split("T")[0]);
      setDateDisplay(task.date || "Today");
      setTime(task.time || "6:00 PM – 7:00 PM");
      setRepeat(task.repeat || "Daily");
      setNotesHeader(task.notesHeader || "");
      setBulletPoints(
        Array.isArray(task.bulletPoints) ? [...task.bulletPoints] : []
      );
      setImage(task.image || "/assets/dumbbell.jpg");
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handlePointChange = (idx, value) => {
    setBulletPoints((prev) => {
      const copy = [...prev];
      copy[idx] = value;
      return copy;
    });
  };

  const handleAddPoint = () => {
    setBulletPoints((prev) => [...prev, "New takeaway point"]);
  };

  const handleDeletePoint = (idx) => {
    setBulletPoints((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter a task title.");
      return;
    }

    const updatedTask = {
      ...task,
      title: title.trim(),
      pillTitle: title.trim(),
      goal: goal.trim(),
      priority,
      category,
      status,
      dueDate,
      date: dateDisplay,
      time,
      repeat,
      notesHeader: notesHeader.trim(),
      bulletPoints: bulletPoints.filter((pt) => pt.trim().length > 0),
      image,
      updatedAt: new Date().toISOString(),
    };

    onUpdateTask(updatedTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl max-h-[92vh] bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 shadow-2xl border border-neutral-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-150">
          <div>
            <h2 className="text-xl font-black text-neutral-900 tracking-tight">
              Edit Task
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Update task details, schedule, notes and goals.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto no-scrollbar py-5 space-y-4"
        >
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Gym workout, Project sprint..."
              className="w-full bg-[#FAF9F6] focus:bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-neutral-900 outline-none focus:ring-1 focus:ring-neutral-900 transition-all shadow-2xs"
              required
            />
          </div>

          {/* Goal */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">
              Goal / Outcome
            </label>
            <div className="relative">
              <Target
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Stay fit, Finish thesis..."
                className="w-full bg-[#FAF9F6] focus:bg-white border border-neutral-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:ring-1 focus:ring-neutral-900 transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Grid: Priority, Category, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Priority */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-800 outline-none cursor-pointer"
              >
                <option value="High Priority">High Priority</option>
                <option value="Medium Priority">Medium Priority</option>
                <option value="Low Priority">Low Priority</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-800 outline-none cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer ${
                  status === "Completed"
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                    : "bg-[#FAF9F6] border-neutral-200 text-neutral-800"
                }`}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Grid: Date, Time, Repeat */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Due Date
              </label>
              <div className="relative">
                <Calendar
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                />
                <input
                  type="date"
                  ref={dateInputRef}
                  value={dueDate}
                  onChange={(e) => {
                    setDueDate(e.target.value);
                    const todayStr = new Date().toISOString().split("T")[0];
                    setDateDisplay(e.target.value === todayStr ? "Today" : e.target.value);
                  }}
                  className="w-full bg-[#FAF9F6] border border-neutral-200 rounded-xl pl-8 pr-2 py-2 text-xs text-neutral-800 outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Time */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Time Interval
              </label>
              <div className="relative">
                <Clock
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                />
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="6:00 PM – 7:00 PM"
                  className="w-full bg-[#FAF9F6] border border-neutral-200 rounded-xl pl-8 pr-2 py-2 text-xs text-neutral-800 outline-none"
                />
              </div>
            </div>

            {/* Repeat */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Repeat
              </label>
              <select
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-800 outline-none cursor-pointer"
              >
                <option value="Daily">Daily</option>
                <option value="Weekdays">Weekdays</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Once">Once</option>
              </select>
            </div>
          </div>

          {/* Notes Header */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">
              Notes Section Header
            </label>
            <div className="relative">
              <FileText
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                value={notesHeader}
                onChange={(e) => setNotesHeader(e.target.value)}
                placeholder="e.g. Full body workout, Session plan..."
                className="w-full bg-[#FAF9F6] focus:bg-white border border-neutral-200 rounded-xl pl-8 pr-3.5 py-2 text-xs text-neutral-900 outline-none shadow-2xs"
              />
            </div>
          </div>

          {/* Bullet Points */}
          <div className="bg-[#FAF9F6] p-3.5 rounded-2xl border border-neutral-200/80">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-neutral-800">
                Action / Workout Points
              </span>
              <button
                type="button"
                onClick={handleAddPoint}
                className="text-[11px] font-bold text-neutral-700 hover:text-black flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-neutral-200 shadow-2xs cursor-pointer"
              >
                <Plus size={11} />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto no-scrollbar">
              {bulletPoints.map((pt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-700 shrink-0" />
                  <input
                    type="text"
                    value={pt}
                    onChange={(e) => handlePointChange(idx, e.target.value)}
                    className="flex-1 bg-white border border-neutral-200/90 rounded-lg px-2.5 py-1 text-xs text-neutral-800 outline-none focus:border-neutral-900"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeletePoint(idx)}
                    className="p-1 text-neutral-400 hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 3D Image Selection */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">
              Card 3D Thumbnail
            </label>
            <div className="flex items-center gap-2.5 flex-wrap">
              {PRESET_IMAGES.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setImage(p.src)}
                  className={`w-12 h-12 rounded-xl p-1 bg-[#F5F3ED] border transition-all cursor-pointer flex items-center justify-center ${
                    image === p.src
                      ? "border-neutral-900 ring-2 ring-neutral-900/20 scale-105"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                  title={p.label}
                >
                  <img
                    src={p.src}
                    alt={p.label}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-12 px-3 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-[11px] font-bold text-neutral-600 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <ImageIcon size={14} />
                <span>Upload Custom</span>
              </button>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-150">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer hover:scale-102 flex items-center gap-1.5"
            >
              <CheckCircle2 size={14} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
