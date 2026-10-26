import React from "react";
import { Plus, Check, ChevronRight } from "lucide-react";
import { MONTH_NAMES } from "../../utils/calendarUtils";

const DailyAgendaNotebook = ({
  selectedDate,
  tasks = [],
  onToggleStatus,
  onOpenCreateModal,
  onSelectTask,
}) => {
  const selectedDayNum = selectedDate.getDate();
  const selectedDayName = selectedDate.toLocaleDateString("en-US", { weekday: "long" });
  const selectedMonthYear = `${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;

  return (
    <div className="w-full max-w-md lg:max-w-none lg:w-[360px] xl:w-[390px] bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 lg:p-7 shadow-xl shadow-neutral-900/4 border border-white/80 flex flex-col justify-between min-h-[460px] lg:min-h-[500px]">
      <div>
        {/* Header: Date Number + Day & Month/Year + Plus Button */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <span className="text-5xl font-black text-[#EF4444] leading-none tracking-tight">
              {selectedDayNum}
            </span>

            <div className="flex flex-col">
              <span className="text-base font-bold text-neutral-900 leading-tight">
                {selectedDayName}
              </span>
              <span className="text-xs font-semibold text-neutral-400 mt-0.5">
                {selectedMonthYear}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenCreateModal}
            className="w-11 h-11 rounded-2xl bg-[#1C1D1F] hover:bg-black text-white flex items-center justify-center transition-all shadow-md cursor-pointer hover:scale-105"
            title="Create task for this day"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Notebook Planner Body with classic Pink/Red Vertical Margin Line */}
        <div className="relative min-h-[300px]">
          <div className="absolute top-0 bottom-0 left-[34px] w-[1.5px] bg-[#FDA4AF] pointer-events-none" />

          {/* Task list rows */}
          <div className="space-y-4 pt-1">
            {tasks.length > 0 ? (
              tasks.map((task) => {
                const isCompleted = task.status === "Completed";
                return (
                  <div key={task.id} className="flex items-center gap-3 relative group">
                    {/* Checkbox button */}
                    <button
                      type="button"
                      onClick={() => onToggleStatus(task.id)}
                      className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                        isCompleted
                          ? "bg-neutral-900 border-neutral-900 text-white"
                          : "border-neutral-300 hover:border-neutral-700 bg-white"
                      }`}
                      title={isCompleted ? "Mark pending" : "Mark completed"}
                    >
                      {isCompleted && <Check size={13} strokeWidth={3} />}
                    </button>

                    {/* Task Card row */}
                    <div
                      onClick={() => onSelectTask && onSelectTask(task.id)}
                      className="flex-1 ml-2.5 bg-[#FAF9F5] hover:bg-[#F5F3ED] rounded-2xl p-2.5 flex items-center justify-between gap-3 transition-colors cursor-pointer border border-neutral-100/80 shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-white overflow-hidden flex items-center justify-center p-1.5 shrink-0 shadow-2xs border border-neutral-100">
                          <img
                            src={task.image || "/assets/dumbbell.jpg"}
                            alt={task.title}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="min-w-0">
                          <h4
                            className={`text-sm font-bold text-neutral-900 truncate leading-snug ${
                              isCompleted ? "line-through text-neutral-400" : ""
                            }`}
                          >
                            {task.title}
                          </h4>
                          <p className="text-xs text-neutral-400 font-medium mt-0.5 truncate">
                            {task.time || "6:00 PM – 7:00 PM"}
                          </p>
                        </div>
                      </div>

                      <ChevronRight
                        size={18}
                        className="text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-all shrink-0"
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="pl-12 py-8 text-left">
                <p className="text-xs font-semibold text-neutral-400">
                  No tasks scheduled for {selectedDayName}, {selectedDayNum}{" "}
                  {MONTH_NAMES[selectedDate.getMonth()]}.
                </p>
                <button
                  type="button"
                  onClick={onOpenCreateModal}
                  className="mt-3 text-xs font-bold text-neutral-900 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add a task for this date</span>
                </button>
              </div>
            )}

            {/* Decorative horizontal ruled lines */}
            <div className="pt-4 space-y-7 pointer-events-none opacity-40">
              <div className="border-b border-neutral-200" />
              <div className="border-b border-neutral-200" />
              <div className="border-b border-neutral-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyAgendaNotebook;
