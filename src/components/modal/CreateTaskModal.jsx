import React, { useState, useRef } from "react";
import {
  X,
  Image as ImageIcon,
  Calendar,
  Clock,
  Target,
  FileText,
  Plus,
  Trash2,
  List,
  AlignLeft,
  ChevronDown
} from "lucide-react";

const PRESET_IMAGES = [
  {
    label: "Dumbbell",
    src: "/assets/dumbbell.jpg",
    defaultName: "Gym Workout",
    defaultGoal: "Stay fit and healthy",
    defaultHeader: "Full body workout",
    defaultPoints: [
      "10 min warm up",
      "30 min strength training",
      "10 min cardio",
      "10 min cool down",
    ],
  },
  {
    label: "Books",
    src: "/assets/books.jpg",
    defaultName: "Reading Book",
    defaultGoal: "Expand knowledge & mindfulness",
    defaultHeader: "Evening reading session",
    defaultPoints: [
      "Read chapters 4 & 5",
      "Highlight key concepts",
      "Reflect on core takeaways",
    ],
  },
  {
    label: "Laptop",
    src: "/assets/laptop.jpg",
    defaultName: "Product Development",
    defaultGoal: "Review Sprint Goals & Architecture",
    defaultHeader: "Project review",
    defaultPoints: [
      "Verify Taskly UI matching modern standards",
      "Review smart chatbot responses",
      "Check interactive canvas and workflow",
    ],
  },
  {
    label: "Shopping",
    src: "/assets/shopping.jpg",
    defaultName: "Grocery Shopping",
    defaultGoal: "Purchase weekly essentials",
    defaultHeader: "Shopping list",
    defaultPoints: [
      "Organic fruits & protein shakes",
      "Notebooks & stationery supplies",
      "Review list before checkout",
    ],
  },
];

const CreateTaskModal = ({ isOpen, onClose, onAddTask }) => {
  const todayISO = new Date().toISOString().split("T")[0];

  const [taskName, setTaskName] = useState("");
  const [selectedImage, setSelectedImage] = useState("/assets/dumbbell.jpg");

  // Date states
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [dateDisplay, setDateDisplay] = useState("Today");

  // Time states (24-hour internal strings)
  const [startTime, setStartTime] = useState("18:00"); // 6:00 PM
  const [endTime, setEndTime] = useState("19:00"); // 7:00 PM

  // Repeat state
  const [repeat, setRepeat] = useState("Daily");

  // Goal state
  const [goal, setGoal] = useState("");

  // Notes states
  const [notesMode, setNotesMode] = useState("points"); // 'text' | 'points'
  const [notesHeader, setNotesHeader] = useState("Full body workout");
  const [points, setPoints] = useState([
    "10 min warm up",
    "30 min strength training",
    "10 min cardio",
    "10 min cool down",
  ]);
  const [notesText, setNotesText] = useState("");

  // Element refs for triggering pickers
  const fileInputRef = useRef(null);
  const dateInputRef = useRef(null);
  const startTimeInputRef = useRef(null);
  const endTimeInputRef = useRef(null);

  if (!isOpen) return null;

  // Convert 24-hr (HH:mm) to 12-hr format (e.g., "6:00 PM")
  const formatTime12h = (time24) => {
    if (!time24) return "--:-- --";
    const [hStr, mStr] = time24.split(":");
    let h = parseInt(hStr, 10);
    const m = mStr || "00";
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${m} ${ampm}`;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetSelect = (preset) => {
    setSelectedImage(preset.src);
    if (!taskName) {
      setTaskName(preset.defaultName);
    }
    if (!goal) {
      setGoal(preset.defaultGoal);
    }
    if (notesHeader === "Full body workout" || !notesHeader) {
      setNotesHeader(preset.defaultHeader);
    }
    if (notesMode === "points" && points.length <= 4) {
      setPoints(preset.defaultPoints);
    }
  };

  const handleDateChange = (e) => {
    const val = e.target.value;
    setSelectedDate(val);
    if (!val) {
      setDateDisplay("Today");
      return;
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    if (val === todayStr) {
      setDateDisplay("Today");
    } else if (val === tomorrowStr) {
      setDateDisplay("Tomorrow");
    } else {
      const [y, m, d] = val.split("-");
      setDateDisplay(`${d}/${m}/${y}`);
    }
  };

  const handleOpenDatePicker = () => {
    if (dateInputRef.current) {
      try {
        if (typeof dateInputRef.current.showPicker === "function") {
          dateInputRef.current.showPicker();
        } else {
          dateInputRef.current.focus();
        }
      } catch {
        dateInputRef.current.focus();
      }
    }
  };

  const handleOpenStartTime = () => {
    if (startTimeInputRef.current) {
      try {
        if (typeof startTimeInputRef.current.showPicker === "function") {
          startTimeInputRef.current.showPicker();
        } else {
          startTimeInputRef.current.focus();
        }
      } catch {
        startTimeInputRef.current.focus();
      }
    }
  };

  const handleOpenEndTime = () => {
    if (endTimeInputRef.current) {
      try {
        if (typeof endTimeInputRef.current.showPicker === "function") {
          endTimeInputRef.current.showPicker();
        } else {
          endTimeInputRef.current.focus();
        }
      } catch {
        endTimeInputRef.current.focus();
      }
    }
  };

  const handleQuickDateSelect = (type) => {
    if (type === "today") {
      setSelectedDate(todayISO);
      setDateDisplay("Today");
    } else if (type === "tomorrow") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];
      setSelectedDate(tomorrowStr);
      setDateDisplay("Tomorrow");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = taskName.trim() || "New Task";

    let finalNotes = "";
    let finalHeader = notesHeader.trim();
    let finalBulletPoints = [];

    if (notesMode === "points") {
      finalBulletPoints = points
        .map((p) => p.trim())
        .filter(Boolean);

      if (finalBulletPoints.length === 0 && finalHeader) {
        finalBulletPoints = [finalHeader];
      }

      finalNotes = finalBulletPoints.join("\n");
    } else {
      // Text mode
      finalNotes = notesText.trim();
      finalBulletPoints = [];
    }

    // Format time range string: e.g. "6:00 PM – 7:00 PM"
    const startFormatted = formatTime12h(startTime);
    const endFormatted = formatTime12h(endTime);
    let timeString = "6:00 PM – 7:00 PM";
    if (startFormatted && endFormatted) {
      timeString = `${startFormatted} – ${endFormatted}`;
    } else if (startFormatted) {
      timeString = startFormatted;
    }

    // Category detection
    let category = "Personal";
    if (
      selectedImage.includes("dumbbell") ||
      name.toLowerCase().includes("gym") ||
      name.toLowerCase().includes("workout")
    ) {
      category = "Health & Fitness";
    } else if (
      selectedImage.includes("books") ||
      name.toLowerCase().includes("read") ||
      name.toLowerCase().includes("book")
    ) {
      category = "Personal Growth";
    } else if (
      selectedImage.includes("laptop") ||
      name.toLowerCase().includes("project") ||
      name.toLowerCase().includes("code") ||
      name.toLowerCase().includes("work")
    ) {
      category = "Work & Projects";
    } else if (
      selectedImage.includes("shopping") ||
      name.toLowerCase().includes("shop")
    ) {
      category = "Shopping";
    }

    const newTask = {
      id: `task-${Date.now()}`,
      pillTitle: name.length > 15 ? name.substring(0, 14) + "..." : name,
      title: name,
      priority: "Low Priority",
      category: category,
      status: "Pending",
      date: dateDisplay || "Today",
      dueDate: selectedDate || todayISO,
      time: timeString,
      repeat: repeat || "Daily",
      goal: goal.trim() || "Stay fit and healthy",
      notesMode: notesMode, // 'text' | 'points'
      notesHeader: finalHeader,
      bulletPoints: finalBulletPoints,
      notes: finalNotes,
      image: selectedImage || "/assets/dumbbell.jpg",
      createdAt: new Date().toISOString(),
    };

    onAddTask(newTask);
    onClose();

    // Reset form
    setTaskName("");
    setGoal("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] sm:rounded-[32px] w-full max-w-md shadow-2xl p-5 sm:p-7 text-neutral-900 relative max-h-[92vh] overflow-y-auto no-scrollbar border border-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
            Create Task
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Name */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-1.5">
              Task Name
            </label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="e.g. Gym Workout"
              className="w-full bg-[#F4F4F6] text-neutral-900 placeholder:text-neutral-400 rounded-xl px-4 py-3.5 border-none outline-none text-sm font-medium focus:ring-2 focus:ring-neutral-900/10 transition-all"
              autoFocus
            />
          </div>

          {/* Image Upload / Picker */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-1.5">
              Image
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-neutral-300 rounded-2xl p-4 flex flex-col items-center justify-center bg-white hover:bg-neutral-50 transition-colors cursor-pointer group relative"
            >
              {selectedImage ? (
                <div className="flex items-center gap-4 w-full">
                  <div className="w-16 h-16 rounded-xl bg-[#F5F3ED] overflow-hidden flex items-center justify-center p-1 shrink-0 border border-neutral-200">
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-xs font-bold text-neutral-800 block">
                      Custom 3D / Photo Selected
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      Click to upload another image from your device
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center py-2">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 mb-1.5 group-hover:scale-105 transition-transform">
                    <ImageIcon size={20} strokeWidth={2} />
                  </div>
                  <span className="text-sm font-semibold text-neutral-800">
                    Add task image
                  </span>
                  <span className="text-xs text-neutral-400 mt-0.5">
                    Click to upload from device
                  </span>
                </div>
              )}
            </div>

            {/* Quick 3D Presets */}
            <div className="mt-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-semibold text-neutral-400 shrink-0">
                Presets:
              </span>
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                    selectedImage === preset.src
                      ? "border-neutral-900 bg-neutral-900 text-white shadow-xs"
                      : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700"
                  }`}
                >
                  <img
                    src={preset.src}
                    alt={preset.label}
                    className="w-3.5 h-3.5 object-contain rounded-full"
                  />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Picker (Calendar icon on side triggers calendar selection) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-neutral-900">
                Date
              </label>
              {/* Quick toggle chips */}
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickDateSelect("today")}
                  className={`px-2.5 py-0.5 rounded-full font-medium transition-all cursor-pointer ${
                    dateDisplay === "Today"
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDateSelect("tomorrow")}
                  className={`px-2.5 py-0.5 rounded-full font-medium transition-all cursor-pointer ${
                    dateDisplay === "Tomorrow"
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  Tomorrow
                </button>
              </div>
            </div>

            <div
              onClick={handleOpenDatePicker}
              className="bg-[#F4F4F6] hover:bg-[#EEEDF0] rounded-xl px-4 py-3 flex items-center justify-between text-sm text-neutral-900 cursor-pointer transition-colors relative group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Calendar
                  size={18}
                  className="text-neutral-500 group-hover:text-neutral-900 transition-colors shrink-0"
                />
                <span className="text-sm font-semibold text-neutral-900">
                  {dateDisplay}
                </span>
                {selectedDate && (
                  <span className="text-xs text-neutral-400 font-normal">
                    ({selectedDate.split("-").reverse().join("/")})
                  </span>
                )}
              </div>

              {/* Side Calendar Icon: Specifically opens calendar picker when clicked */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDatePicker();
                }}
                className="p-1 rounded-lg hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                title="Choose date from calendar"
              >
                <Calendar size={18} className="shrink-0" />
              </button>

              {/* Native HTML5 Date Picker triggered on click */}
              <input
                ref={dateInputRef}
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                tabIndex={-1}
                aria-label="Select date"
              />
            </div>
          </div>

          {/* Time Picker (Start Time - End Time, clicking shows time picker) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-neutral-900">
                Time
              </label>
              <span className="text-xs text-neutral-500 font-semibold">
                {formatTime12h(startTime)} – {formatTime12h(endTime)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Start Time Box */}
              <div
                onClick={handleOpenStartTime}
                className="flex-1 bg-[#F4F4F6] hover:bg-[#EEEDF0] rounded-xl px-3.5 py-3 flex items-center justify-between text-sm text-neutral-900 cursor-pointer transition-colors relative group"
                title="Select start time"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Clock
                    size={16}
                    className="text-neutral-500 group-hover:text-neutral-900 transition-colors shrink-0"
                  />
                  <span className="text-xs font-semibold text-neutral-900">
                    {formatTime12h(startTime)}
                  </span>
                </div>
                <Clock
                  size={16}
                  className="text-neutral-400 group-hover:text-neutral-700 transition-colors shrink-0"
                />
                <input
                  ref={startTimeInputRef}
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  tabIndex={-1}
                  aria-label="Start time"
                />
              </div>

              <span className="text-neutral-400 font-bold text-xs">–</span>

              {/* End Time Box */}
              <div
                onClick={handleOpenEndTime}
                className="flex-1 bg-[#F4F4F6] hover:bg-[#EEEDF0] rounded-xl px-3.5 py-3 flex items-center justify-between text-sm text-neutral-900 cursor-pointer transition-colors relative group"
                title="Select end time"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Clock
                    size={16}
                    className="text-neutral-500 group-hover:text-neutral-900 transition-colors shrink-0"
                  />
                  <span className="text-xs font-semibold text-neutral-900">
                    {formatTime12h(endTime)}
                  </span>
                </div>
                <Clock
                  size={16}
                  className="text-neutral-400 group-hover:text-neutral-700 transition-colors shrink-0"
                />
                <input
                  ref={endTimeInputRef}
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  tabIndex={-1}
                  aria-label="End time"
                />
              </div>
            </div>
          </div>

          {/* Repeat Option */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-1.5">
              Repeat
            </label>
            <div className="relative">
              <select
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
                className="w-full bg-[#F4F4F6] hover:bg-[#EEEDF0] text-neutral-900 rounded-xl px-4 py-3 text-sm font-medium outline-none appearance-none cursor-pointer pr-10 transition-colors"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Weekdays">Weekdays</option>
                <option value="Doesn't repeat">Doesn't repeat</option>
              </select>
              <ChevronDown
                size={18}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
              />
            </div>
          </div>

          {/* Goal */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-1.5">
              Goal
            </label>
            <div className="bg-[#F4F4F6] rounded-xl px-4 py-3 flex items-center gap-3 text-sm text-neutral-900">
              <Target size={18} className="text-neutral-500 shrink-0" />
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="What do you want to achieve? (e.g. Stay fit and healthy)"
                className="bg-transparent border-none outline-none text-sm text-neutral-900 font-medium w-full placeholder:text-neutral-400"
              />
            </div>
          </div>

          {/* Notes (Text vs Points Toggle) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-neutral-900">
                Notes
              </label>

              {/* Segmented Toggle: Text | Points */}
              <div className="bg-[#EFEFEF] p-0.5 rounded-xl flex items-center text-xs font-semibold border border-neutral-200">
                <button
                  type="button"
                  onClick={() => {
                    if (notesMode !== "text") {
                      const combined = [notesHeader, ...points.filter(Boolean)]
                        .filter(Boolean)
                        .join("\n\n");
                      if (!notesText && combined) setNotesText(combined);
                      setNotesMode("text");
                    }
                  }}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    notesMode === "text"
                      ? "bg-black text-white shadow-xs"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  <AlignLeft size={13} />
                  <span>Text</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (notesMode !== "points") {
                      if (notesText.trim()) {
                        const lines = notesText
                          .split("\n")
                          .map((l) => l.replace(/^[•\-*0-9.]\s*/, "").trim())
                          .filter(Boolean);
                        if (lines.length > 0) {
                          setNotesHeader(lines[0]);
                          if (lines.length > 1) {
                            setPoints(lines.slice(1));
                          }
                        }
                      }
                      setNotesMode("points");
                    }
                  }}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    notesMode === "points"
                      ? "bg-black text-white shadow-xs"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  <List size={13} />
                  <span>Points</span>
                </button>
              </div>
            </div>

            {/* Mode 1: Text Mode */}
            {notesMode === "text" ? (
              <div className="space-y-2">
                <div className="bg-[#F4F4F6] rounded-xl px-4 py-2.5 flex items-center gap-2.5 text-sm text-neutral-900">
                  <FileText size={16} className="text-neutral-400 shrink-0" />
                  <input
                    type="text"
                    value={notesHeader}
                    onChange={(e) => setNotesHeader(e.target.value)}
                    placeholder="Heading / Subject (optional, e.g. Full body workout)"
                    className="bg-transparent border-none outline-none text-xs text-neutral-900 font-semibold w-full placeholder:text-neutral-400"
                  />
                </div>

                <div className="bg-[#F4F4F6] rounded-xl p-3.5 flex items-start gap-2.5 text-sm text-neutral-900 min-h-[110px]">
                  <textarea
                    rows={4}
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    placeholder="Write your complete notes or paragraph here..."
                    className="bg-transparent border-none outline-none text-xs text-neutral-900 font-medium w-full placeholder:text-neutral-400 resize-none leading-relaxed"
                  />
                </div>
              </div>
            ) : (
              /* Mode 2: Points Mode (Step-by-step points: "is ki bad ye kar na hai") */
              <div className="space-y-2">
                {/* Heading for Points */}
                <div className="bg-[#F4F4F6] rounded-xl px-4 py-2.5 flex items-center gap-2.5 text-sm text-neutral-900">
                  <FileText size={16} className="text-neutral-400 shrink-0" />
                  <input
                    type="text"
                    value={notesHeader}
                    onChange={(e) => setNotesHeader(e.target.value)}
                    placeholder="Heading / Plan (e.g. Full body workout)"
                    className="bg-transparent border-none outline-none text-xs text-neutral-900 font-semibold w-full placeholder:text-neutral-400"
                  />
                </div>

                {/* Interactive Points List */}
                <div className="bg-[#F4F4F6] rounded-xl p-3 space-y-2 max-h-[190px] overflow-y-auto no-scrollbar">
                  {points.map((pt, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-white rounded-lg px-2.5 py-1.5 shadow-2xs border border-neutral-100"
                    >
                      <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={pt}
                        onChange={(e) => {
                          const next = [...points];
                          next[idx] = e.target.value;
                          setPoints(next);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const next = [...points];
                            next.splice(idx + 1, 0, "");
                            setPoints(next);
                          }
                        }}
                        placeholder={`Step ${idx + 1}: e.g. ${
                          idx === 0
                            ? "10 min warm up"
                            : idx === 1
                            ? "30 min strength training"
                            : idx === 2
                            ? "10 min cardio"
                            : "10 min cool down"
                        }`}
                        className="bg-transparent border-none outline-none text-xs text-neutral-900 font-medium w-full placeholder:text-neutral-400"
                      />
                      {points.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setPoints(points.filter((_, i) => i !== idx));
                          }}
                          className="w-5 h-5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-red-500 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                          title="Remove point"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => setPoints([...points, ""])}
                    className="w-full py-2 border border-dashed border-neutral-300 hover:border-neutral-900 rounded-lg text-xs font-semibold text-neutral-600 hover:text-neutral-900 flex items-center justify-center gap-1.5 transition-colors cursor-pointer bg-white/70 hover:bg-white"
                  >
                    <Plus size={14} />
                    <span>Add Next Point</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 bg-black hover:bg-neutral-800 text-white font-bold rounded-2xl transition-all shadow-md text-base cursor-pointer"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
