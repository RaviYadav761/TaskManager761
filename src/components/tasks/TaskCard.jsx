import React from "react";
import { Check, Edit3, Trash2, Tag, AlertCircle, Clock, Calendar, ArrowUpRight } from "lucide-react";
import { formatDateLabel } from "../../utils/dateUtils";

const TaskCard = ({ task, onToggleStatus, onEdit, onDelete, onSelectTask }) => {
  const isCompleted = task.status === "Completed";
  const dateInfo = formatDateLabel(task.dueDate);

  // Priority color styles for Taskly light aesthetic
  const priorityStyles = {
    High: "bg-[#FEECEB] text-[#DC2626] border-[#FCA5A5]/40",
    "High Priority": "bg-[#FEECEB] text-[#DC2626] border-[#FCA5A5]/40",
    Medium: "bg-[#FFF5E6] text-[#D97706] border-[#FCD34D]/40",
    "Medium Priority": "bg-[#FFF5E6] text-[#D97706] border-[#FCD34D]/40",
    Low: "bg-[#EAF7EE] text-[#22864E] border-[#86EFAC]/40",
    "Low Priority": "bg-[#EAF7EE] text-[#22864E] border-[#86EFAC]/40",
  }[task.priority] || "bg-[#EAF7EE] text-[#22864E] border-[#86EFAC]/40";

  return (
    <div
      onClick={() => onSelectTask && onSelectTask(task.id)}
      className={`group relative bg-white rounded-3xl p-5 border transition-all duration-200 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] cursor-pointer hover:border-neutral-900/40 hover:-translate-y-0.5 ${
        isCompleted
          ? "border-neutral-200 bg-neutral-50/70 opacity-85"
          : dateInfo.isOverdue
          ? "border-rose-300 hover:border-rose-400"
          : "border-[#E2DDD3] hover:border-neutral-400"
      }`}
      title="Click to view task details on Homepage"
    >
      <div className="flex items-start gap-3.5">
        {/* Toggle Checkbox Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus(task.id);
          }}
          className={`w-6 h-6 mt-0.5 rounded-xl border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
            isCompleted
              ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
              : "border-neutral-300 hover:border-neutral-900 bg-white text-transparent"
          }`}
          title={isCompleted ? "Mark as pending" : "Mark as completed"}
        >
          <Check size={14} strokeWidth={3} className={isCompleted ? "opacity-100" : "opacity-0"} />
        </button>

        {/* 3D Image Thumbnail */}
        {task.image && (
          <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] overflow-hidden flex items-center justify-center p-1.5 shrink-0 border border-[#E2DDD3] shadow-2xs">
            <img
              src={task.image}
              alt={task.title}
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3
              className={`font-bold text-sm text-neutral-900 tracking-tight transition-all truncate group-hover:text-black ${
                isCompleted ? "line-through text-neutral-400 font-medium" : ""
              }`}
              title={task.title}
            >
              {task.title}
            </h3>

            {/* Actions (visible on hover & mobile) */}
            <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                title="Edit task"
              >
                <Edit3 size={14} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Delete task"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Goal / Notes Preview */}
          {(task.goal || task.notesHeader || task.description) && (
            <p
              className={`text-xs text-neutral-500 line-clamp-2 mb-3 leading-relaxed ${
                isCompleted ? "line-through text-neutral-400" : ""
              }`}
            >
              {task.goal || task.notesHeader || task.description}
            </p>
          )}

          {/* Badges / Metadata Row */}
          <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-neutral-100 text-[11px]">
            {/* Priority Badge */}
            {task.priority && (
              <span
                className={`px-2.5 py-0.5 rounded-md font-bold border text-[10px] ${priorityStyles}`}
              >
                {task.priority}
              </span>
            )}

            {/* Category Badge */}
            {task.category && (
              <span className="px-2 py-0.5 rounded-md bg-[#F5F3ED] text-neutral-700 font-bold text-[10px]">
                {task.category}
              </span>
            )}

            {/* Due Date Indicator */}
            {task.dueDate && (
              <span
                className={`flex items-center gap-1 font-semibold text-[10px] ml-auto ${
                  dateInfo.isOverdue
                    ? "text-rose-600 font-bold"
                    : isCompleted
                    ? "text-neutral-400"
                    : "text-neutral-500"
                }`}
              >
                <Clock size={11} />
                <span>{dateInfo.label}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
