import React from "react";
import StatCard from "./StatCard";
import TaskFocusTimer from "../analytics/TaskFocusTimer";
import {
  ListTodo,
  Clock,
  CheckCircle2,
  CalendarClock,
  TrendingUp,
  Plus,
  Bot
} from "lucide-react";
import { getTodayDateInput } from "../../utils/dateUtils";

const DashboardSummary = ({
  tasks = [],
  focusTimer,
  onStartTimer,
  onPauseTimer,
  onResetTimer,
  onSelectDuration,
  onSelectTimerTask,
  focusStats,
  onCompleteEarly,
  onOpenCreateModal,
  onOpenChatbot,
  onFilterChange,
  onToggleStatus
}) => {
  const todayStr = getTodayDateInput();

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const pending = tasks.filter((t) => t.status !== "Completed").length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const todayCount = tasks.filter(
    (t) => t.dueDate === todayStr && t.status !== "Completed"
  ).length;

  const highPriorityPending = tasks.filter(
    (t) => t.priority?.includes("High") && t.status !== "Completed"
  ).length;

  const mediumPriorityPending = tasks.filter(
    (t) => t.priority?.includes("Medium") && t.status !== "Completed"
  ).length;

  const lowPriorityPending = tasks.filter(
    (t) => (t.priority?.includes("Low") || !t.priority) && t.status !== "Completed"
  ).length;

  return (
    <div className="space-y-6 mb-8">
      {/* 1. PERSISTENT TASK FOCUS TIMER */}
      <TaskFocusTimer
        tasks={tasks}
        onToggleStatus={onToggleStatus}
        focusTimer={focusTimer}
        onStartTimer={onStartTimer}
        onPauseTimer={onPauseTimer}
        onResetTimer={onResetTimer}
        onSelectDuration={onSelectDuration}
        onSelectTimerTask={onSelectTimerTask}
        focusStats={focusStats}
        onCompleteEarly={onCompleteEarly}
      />

      {/* 2. Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={total}
          subtitle="All assignments & tasks"
          icon={ListTodo}
          colorClass="bg-neutral-100 text-neutral-800"
          onClick={() => onFilterChange && onFilterChange("all")}
        />

        <StatCard
          title="Pending Tasks"
          value={pending}
          subtitle={`${highPriorityPending} High • ${mediumPriorityPending} Medium`}
          icon={Clock}
          colorClass="bg-amber-50 text-amber-600"
          onClick={() => onFilterChange && onFilterChange("pending")}
        />

        <StatCard
          title="Completed"
          value={completed}
          subtitle={`${completionRate}% overall rate`}
          icon={CheckCircle2}
          colorClass="bg-emerald-50 text-emerald-600"
          onClick={() => onFilterChange && onFilterChange("completed")}
        />

        <StatCard
          title="Due Today"
          value={todayCount}
          subtitle={todayCount > 0 ? "Requires action today" : "No urgent due today"}
          icon={CalendarClock}
          colorClass="bg-rose-50 text-rose-600"
          onClick={() => onFilterChange && onFilterChange("today")}
        />
      </div>

      {/* 3. Overall Task Completion Progress Banner */}
      <div className="bg-white border border-neutral-200/90 p-6 sm:p-7 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <TrendingUp size={17} className="text-neutral-900" />
              <span className="text-xs font-black text-neutral-900 uppercase tracking-wider">
                Overall Task Completion Progress
              </span>
            </div>
            <span className="text-xs font-black text-neutral-900">
              {completionRate}% ({completed}/{total} Completed)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden p-0.5 border border-neutral-200">
            <div
              className="h-full bg-gradient-to-r from-neutral-900 via-neutral-800 to-emerald-500 rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>

          {/* Priority Breakdown Badges: High, Medium, Low */}
          <div className="mt-4 pt-3.5 border-t border-neutral-150 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-neutral-700">
              Priority Status:
            </span>

            {/* High Priority Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span>High: {highPriorityPending}</span>
              <span className="text-[10px] text-rose-500 font-medium">pending</span>
            </div>

            {/* Medium Priority Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Medium: {mediumPriorityPending}</span>
              <span className="text-[10px] text-amber-500 font-medium">pending</span>
            </div>

            {/* Low Priority Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Low: {lowPriorityPending}</span>
              <span className="text-[10px] text-emerald-500 font-medium">pending</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
          <button
            onClick={onOpenCreateModal}
            className="flex-1 md:flex-none px-5 py-2.5 bg-neutral-900 hover:bg-black text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer hover:scale-102"
          >
            <Plus size={15} />
            <span>Add Task</span>
          </button>

          <button
            onClick={onOpenChatbot}
            className="flex-1 md:flex-none px-4 py-2.5 bg-[#FAF9F6] hover:bg-white border border-neutral-200 text-neutral-800 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <Bot size={15} className="text-neutral-700" />
            <span>Ask Smart Bot</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
