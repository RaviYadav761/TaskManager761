import React from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import {
  DAYS_OF_WEEK,
  MONTH_NAMES,
  isSameDay,
  hasTasksOnDate,
} from "../../utils/calendarUtils";

const MonthCalendarGrid = ({
  currentDate,
  selectedDate,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
  tasks = [],
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Generate 35-42 calendar grid cells
  const generateGrid = () => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells = [];

    // 1. Previous month trailing days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, daysInPrevMonth - i);
      cells.push({
        date: d,
        dayNum: daysInPrevMonth - i,
        isCurrentMonth: false,
      });
    }

    // 2. Current month days
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const dateObj = new Date(year, month, d);
      cells.push({
        date: dateObj,
        dayNum: d,
        isCurrentMonth: true,
      });
    }

    // 3. Next month leading days
    const remaining = 35 - cells.length > 0 ? 35 - cells.length : 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      const dateObj = new Date(year, month + 1, d);
      cells.push({
        date: dateObj,
        dayNum: d,
        isCurrentMonth: false,
      });
    }

    return cells;
  };

  const gridCells = generateGrid();

  return (
    <div className="w-full lg:flex-1 bg-white rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 lg:p-8 shadow-xl shadow-neutral-900/4 border border-white/80 flex flex-col justify-between min-h-[460px] lg:min-h-[500px]">
      <div>
        {/* Header: < Month Year > */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={onPrevMonth}
            className="w-11 h-11 rounded-full bg-[#F5F5F7] hover:bg-neutral-200 text-neutral-800 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            title="Previous month"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>

          <div className="flex items-center gap-2.5">
            <CalendarIcon size={22} className="text-neutral-900 stroke-[2.2]" />
            <h2 className="text-xl lg:text-2xl font-black text-neutral-900 tracking-tight">
              {MONTH_NAMES[month]} {year}
            </h2>
          </div>

          <button
            type="button"
            onClick={onNextMonth}
            className="w-11 h-11 rounded-full bg-[#F5F5F7] hover:bg-neutral-200 text-neutral-800 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            title="Next month"
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 mb-2 border-b border-neutral-100 pb-2">
          {DAYS_OF_WEEK.map((d) => (
            <div
              key={d}
              className="text-center text-xs font-semibold text-neutral-400 py-1"
            >
              {d}
            </div>
          ))}
        </div>

        {/* 7-Column Calendar Month Grid */}
        <div className="grid grid-cols-7 border-t border-l border-neutral-100/90 rounded-2xl overflow-hidden">
          {gridCells.map((cell, idx) => {
            const isSelected = isSameDay(cell.date, selectedDate);
            const hasDot = hasTasksOnDate(cell.date, tasks, year, month);

            return (
              <div
                key={idx}
                onClick={() => onSelectDate(cell.date, cell.isCurrentMonth)}
                className={`h-14 sm:h-16 border-r border-b border-neutral-100/90 flex flex-col items-center justify-center relative cursor-pointer transition-colors ${
                  cell.isCurrentMonth
                    ? "bg-white hover:bg-neutral-50/80"
                    : "bg-neutral-50/40 hover:bg-neutral-100/50"
                }`}
              >
                {isSelected ? (
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#1C1D1F] text-white flex flex-col items-center justify-center shadow-lg shadow-black/20 transform transition-transform scale-105">
                    <span className="text-sm font-bold leading-none">
                      {cell.dayNum}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white mt-1 shrink-0" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full py-1">
                    <span
                      className={`text-sm font-bold leading-none ${
                        cell.isCurrentMonth
                          ? "text-neutral-900"
                          : "text-neutral-300 font-medium"
                      }`}
                    >
                      {cell.dayNum}
                    </span>
                    {hasDot && cell.isCurrentMonth && (
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-1 shrink-0" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MonthCalendarGrid;
