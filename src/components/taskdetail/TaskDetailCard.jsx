import React from "react";
import {
  Calendar,
  Clock,
  RotateCw,
  Target,
  FileText,
  Trash2,
  CheckCircle2
} from "lucide-react";

const TaskDetailCard = ({ task, onDeleteTask, onToggleStatus }) => {
  if (!task) {
    return (
      <div className="bg-white rounded-[32px] p-7 shadow-xl shadow-neutral-900/5 w-full max-w-[390px] border border-white/80 flex flex-col items-center justify-center text-center min-h-[460px]">
        <p className="text-neutral-400 text-sm font-medium">Select a task stack to view details</p>
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
    <div className="bg-white rounded-[32px] p-7 shadow-xl shadow-neutral-900/5 w-full max-w-[390px] border border-white/80 flex flex-col justify-between min-h-[580px] transition-all duration-200">
      <div>
        {/* Card Header Title */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
            {task.pillTitle || task.title} Task Detail
          </h2>
          {onToggleStatus && (
            <button
              onClick={() => onToggleStatus(task.id)}
              className={`p-1.5 rounded-full transition-colors ${
                isCompleted
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-neutral-300 hover:text-neutral-500"
              }`}
              title={isCompleted ? "Mark Pending" : "Mark Completed"}
            >
              <CheckCircle2 size={20} />
            </button>
          )}
        </div>

        {/* Task Thumbnail & Title */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-[#F5F3ED] overflow-hidden flex items-center justify-center p-1.5 shrink-0 shadow-xs">
            <img
              src={task.image || "/assets/dumbbell.jpg"}
              alt={task.title}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900 leading-snug">
              {task.title}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold mt-1.5 inline-block ${priorityBadgeStyle}`}
            >
              {task.priority || "Low Priority"}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-b border-[#F0ECE4] my-6" />

        {/* Metadata Details */}
        <div className="space-y-4 text-sm">
          {/* Date */}
          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-neutral-800 shrink-0" />
            <span className="text-neutral-500 font-medium w-16">Date</span>
            <span className="text-neutral-900 font-medium">{task.date || "Today"}</span>
          </div>

          {/* Time */}
          <div className="flex items-center gap-3">
            <Clock size={18} className="text-neutral-800 shrink-0" />
            <span className="text-neutral-500 font-medium w-16">Time</span>
            <span className="text-neutral-900 font-medium">{task.time || "6:00 PM – 7:00 PM"}</span>
          </div>

          {/* Repeat */}
          <div className="flex items-center gap-3">
            <RotateCw size={18} className="text-neutral-800 shrink-0" />
            <span className="text-neutral-500 font-medium w-16">Repeat</span>
            <span className="text-neutral-900 font-medium">{task.repeat || "Daily"}</span>
          </div>

          {/* Goal */}
          <div className="flex items-center gap-3">
            <Target size={18} className="text-neutral-800 shrink-0" />
            <span className="text-neutral-500 font-medium w-16">Goal</span>
            <span className="text-neutral-900 font-medium truncate">{task.goal || "Stay fit and healthy"}</span>
          </div>

          {/* Notes */}
          <div className="flex items-start gap-3 pt-1">
            <FileText size={18} className="text-neutral-800 shrink-0 mt-0.5" />
            <span className="text-neutral-500 font-medium w-16 shrink-0">Notes</span>
            <div className="flex-1 min-w-0">
              {task.notesHeader && (
                <p className="text-neutral-900 font-bold mb-1.5 text-xs leading-snug">
                  {task.notesHeader}
                </p>
              )}
              {task.notesMode === "text" ? (
                <p className="text-neutral-800 text-xs whitespace-pre-line leading-relaxed">
                  {task.notes || "No additional notes provided."}
                </p>
              ) : task.bulletPoints && task.bulletPoints.length > 0 ? (
                <ul className="space-y-1.5 text-xs text-neutral-800">
                  {task.bulletPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 shrink-0 mt-1.5" />
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-neutral-800 text-xs whitespace-pre-line leading-relaxed">
                  {task.notes || "No additional notes provided."}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Task Button */}
      <button
        onClick={() => onDeleteTask(task.id)}
        className="bg-[#FFEAEA] hover:bg-[#FEDDDD] text-[#EF4444] rounded-2xl py-3.5 px-4 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer w-full mt-8 shadow-xs"
      >
        <Trash2 size={18} />
        <span>Delete Task</span>
      </button>
    </div>
  );
};

export default TaskDetailCard;
