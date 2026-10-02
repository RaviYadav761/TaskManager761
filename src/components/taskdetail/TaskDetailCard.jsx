import React from "react";
import {
  Calendar,
  Clock,
  RotateCw,
  Target,
  FileText,
  Trash2,
  CheckCircle2,
  Edit3,
  Flame
} from "lucide-react";

const TaskDetailCard = ({
  task,
  onDeleteTask,
  onToggleStatus,
  onEditTask,
  onStartFocusTimer
}) => {
  if (!task) {
    return (
      <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 shadow-xl shadow-neutral-900/5 w-full max-w-md lg:max-w-[390px] border border-white/80 flex flex-col items-center justify-center text-center min-h-[220px] lg:min-h-[460px]">
        <p className="text-neutral-400 text-xs sm:text-sm font-medium">Select a task stack to view details</p>
      </div>
    );
  }

  const isCompleted = task.status === "Completed";

  // Priority badge styling
  const priorityBadgeStyle = {
    "Low Priority": "bg-[#EAF7EE] text-[#22864E]",
    "Medium Priority": "bg-[#FFF5E6] text-[#D97706]",
    "High Priority": "bg-[#FEECEB] text-[#DC2626]",
  }[task.priority] || "bg-[#EAF7EE] text-[#22864E]";

  return (
    <div className="bg-white rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 lg:p-7 shadow-xl shadow-neutral-900/5 w-full max-w-md lg:max-w-[390px] border border-white/80 flex flex-col justify-between min-h-0 lg:min-h-[580px] transition-all duration-200">
      <div>
        {/* Card Header Title */}
        <div className="flex items-center justify-between mb-3 sm:mb-5">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-neutral-900 tracking-tight">
            {task.pillTitle || task.title} Task Detail
          </h2>
          <div className="flex items-center gap-1">
            {onEditTask && (
              <button
                type="button"
                onClick={() => onEditTask(task)}
                className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                title="Edit task details"
              >
                <Edit3 size={16} />
              </button>
            )}
            {onToggleStatus && (
              <button
                type="button"
                onClick={() => onToggleStatus(task.id)}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  isCompleted
                    ? "text-emerald-600 bg-emerald-50"
                    : "text-neutral-300 hover:text-neutral-600"
                }`}
                title={isCompleted ? "Mark Pending" : "Mark Completed"}
              >
                <CheckCircle2 size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Task Thumbnail & Title */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl bg-[#F5F3ED] overflow-hidden flex items-center justify-center p-1 sm:p-1.5 shrink-0 shadow-xs">
            <img
              src={task.image || "/assets/dumbbell.jpg"}
              alt={task.title}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold text-neutral-900 leading-snug truncate">
              {task.title}
            </h3>
            <span
              className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold mt-1 inline-block ${priorityBadgeStyle}`}
            >
              {task.priority || "Low Priority"}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-b border-[#F0ECE4] my-3 sm:my-4 lg:my-6" />

        {/* Metadata Details */}
        <div className="space-y-2.5 sm:space-y-3 lg:space-y-4 text-xs sm:text-sm">
          {/* Date */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Calendar size={16} className="text-neutral-800 shrink-0 sm:w-4.5 sm:h-4.5" />
            <span className="text-neutral-500 font-medium w-14 sm:w-16">Date</span>
            <span className="text-neutral-900 font-medium">{task.date || "Today"}</span>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Clock size={16} className="text-neutral-800 shrink-0 sm:w-4.5 sm:h-4.5" />
            <span className="text-neutral-500 font-medium w-14 sm:w-16">Time</span>
            <span className="text-neutral-900 font-medium">{task.time || "6:00 PM – 7:00 PM"}</span>
          </div>

          {/* Repeat */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <RotateCw size={16} className="text-neutral-800 shrink-0 sm:w-4.5 sm:h-4.5" />
            <span className="text-neutral-500 font-medium w-14 sm:w-16">Repeat</span>
            <span className="text-neutral-900 font-medium">{task.repeat || "Daily"}</span>
          </div>

          {/* Goal */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Target size={16} className="text-neutral-800 shrink-0 sm:w-4.5 sm:h-4.5" />
            <span className="text-neutral-500 font-medium w-14 sm:w-16">Goal</span>
            <span className="text-neutral-900 font-medium truncate">{task.goal || "Stay fit and healthy"}</span>
          </div>

          {/* Notes */}
          <div className="flex items-start gap-2.5 sm:gap-3 pt-0.5">
            <FileText size={16} className="text-neutral-800 shrink-0 mt-0.5 sm:w-4.5 sm:h-4.5" />
            <span className="text-neutral-500 font-medium w-14 sm:w-16 shrink-0">Notes</span>
            <div className="flex-1 min-w-0">
              {task.notesHeader && (
                <p className="text-neutral-900 font-bold mb-1 text-xs leading-snug">
                  {task.notesHeader}
                </p>
              )}
              {task.notesMode === "text" ? (
                <p className="text-neutral-800 text-[11px] sm:text-xs whitespace-pre-line leading-relaxed">
                  {task.notes || "No additional notes provided."}
                </p>
              ) : task.bulletPoints && task.bulletPoints.length > 0 ? (
                <ul className="space-y-1 text-[11px] sm:text-xs text-neutral-800">
                  {task.bulletPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 sm:gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 shrink-0 mt-1" />
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-neutral-800 text-[11px] sm:text-xs whitespace-pre-line leading-relaxed">
                  {task.notes || "No additional notes provided."}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons: Focus Timer & Delete */}
      <div className="space-y-2 mt-4 sm:mt-6 lg:mt-8">
        {onStartFocusTimer && !isCompleted && (
          <button
            type="button"
            onClick={() => onStartFocusTimer(task)}
            className="w-full py-2.5 sm:py-3 px-3 bg-neutral-900 hover:bg-black text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs hover:scale-[1.01]"
          >
            <Flame size={15} className="text-amber-400" />
            <span>Start 1-Hour Focus Session</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => onDeleteTask(task.id)}
          className="bg-[#FFEAEA] hover:bg-[#FEDDDD] text-[#EF4444] rounded-xl sm:rounded-2xl py-2.5 sm:py-3.5 px-4 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer w-full shadow-xs"
        >
          <Trash2 size={16} />
          <span>Delete Task</span>
        </button>
      </div>
    </div>
  );
};

export default TaskDetailCard;
