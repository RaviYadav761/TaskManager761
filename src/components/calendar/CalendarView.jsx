import React, { useState } from "react";
import { Plus, ArrowRight } from "lucide-react";
import MonthCalendarGrid from "./MonthCalendarGrid";
import DailyAgendaNotebook from "./DailyAgendaNotebook";
import {
  MONTH_NAMES,
  formatDateISO,
  getTasksForDate,
} from "../../utils/calendarUtils";

const CalendarView = ({
  tasks = [],
  onToggleStatus,
  onAddTask,
  onOpenCreateModal,
  onSelectTask,
}) => {
  // Initialize to March 2026, selected day 24 to match the screenshot exactly
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 2, 1)); // March 2026
  const [selectedDate, setSelectedDate] = useState(() => new Date(2026, 2, 24)); // March 24, 2026
  const [quickInput, setQuickInput] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleSelectDate = (date, isCurrentMonth) => {
    setSelectedDate(date);
    if (!isCurrentMonth) {
      setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  };

  const selectedDayTasks = getTasksForDate(selectedDate, tasks);

  const handleQuickSubmit = (e) => {
    e?.preventDefault();
    const val = quickInput.trim();
    if (!val) {
      onOpenCreateModal();
      return;
    }

    let image = "/assets/dumbbell.jpg";
    let category = "Personal";
    const lower = val.toLowerCase();
    if (lower.includes("shop") || lower.includes("buy")) {
      image = "/assets/shopping.jpg";
      category = "Shopping";
    } else if (lower.includes("book") || lower.includes("read")) {
      image = "/assets/books.jpg";
      category = "Personal Growth";
    } else if (lower.includes("project") || lower.includes("code") || lower.includes("assign")) {
      image = "/assets/laptop.jpg";
      category = "Work & Projects";
    }

    const newTask = {
      id: `task-${Date.now()}`,
      pillTitle: val.length > 15 ? val.substring(0, 14) + "..." : val,
      title: val,
      priority: "Low Priority",
      category,
      status: "Pending",
      date: `${selectedDate.getDate()} ${MONTH_NAMES[selectedDate.getMonth()].slice(0, 3)}`,
      dueDate: formatDateISO(selectedDate),
      time: "6:00 PM – 7:00 PM",
      repeat: "Daily",
      goal: `Complete ${val}`,
      notesMode: "points",
      notesHeader: "Task objectives",
      bulletPoints: ["Focus on deliverables", "Mark completed when finished"],
      image,
      createdAt: new Date().toISOString(),
    };

    onAddTask(newTask);
    setQuickInput("");
  };

  return (
    <div className="flex-1 w-full min-w-0 lg:min-w-[760px] min-h-[calc(100vh-57px)] lg:h-screen flex flex-col justify-between p-3 sm:p-4 lg:p-6 bg-[#F5F3ED] overflow-y-auto no-scrollbar select-none">
      <div />

      {/* Main Center Area: Two Side-by-Side Cards on desktop, stacked on mobile */}
      <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-6 w-full max-w-5xl mx-auto my-auto py-2">
        <MonthCalendarGrid
          currentDate={currentDate}
          selectedDate={selectedDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onSelectDate={handleSelectDate}
          tasks={tasks}
        />

        <DailyAgendaNotebook
          selectedDate={selectedDate}
          tasks={selectedDayTasks}
          onToggleStatus={onToggleStatus}
          onOpenCreateModal={onOpenCreateModal}
          onSelectTask={onSelectTask}
        />
      </div>

      {/* Bottom Floating Task Creation Capsule Bar */}
      <div className="w-full max-w-xs sm:max-w-md lg:max-w-xl mx-auto pb-2">
        <form
          onSubmit={handleQuickSubmit}
          className="bg-white rounded-full p-1.5 sm:p-2 pl-2 pr-2 sm:pl-2.5 sm:pr-2.5 shadow-xl shadow-neutral-900/4 border border-white/90 flex items-center gap-2 sm:gap-3 transition-shadow hover:shadow-2xl"
        >
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#1C1D1F] hover:bg-black text-white flex items-center justify-center shrink-0 transition-all cursor-pointer hover:scale-105"
            title="Create Task"
          >
            <Plus size={16} strokeWidth={2.5} className="sm:w-5 sm:h-5" />
          </button>

          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="Create your task stack..."
            className="flex-1 bg-transparent text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none px-1.5 sm:px-2 font-medium"
          />

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

export default CalendarView;
