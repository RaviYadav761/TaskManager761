import React from "react";
import TaskCard from "./TaskCard";
import { ClipboardList, Plus } from "lucide-react";

const TaskList = ({
  tasks,
  onToggleStatus,
  onEdit,
  onDelete,
  onOpenCreateModal,
  onSelectTask,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-dashed border-neutral-200 p-12 text-center my-6 flex flex-col items-center justify-center shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-500 mb-4 shadow-2xs">
          <ClipboardList size={26} />
        </div>
        <h3 className="text-base font-bold text-neutral-900 mb-1">No tasks found</h3>
        <p className="text-xs text-neutral-400 max-w-sm mb-5 font-medium">
          There are no tasks matching your selected filters or search query. Create a new task to get started!
        </p>
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="px-5 py-2.5 bg-neutral-900 hover:bg-black text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer hover:scale-105"
        >
          <Plus size={16} />
          <span>Create New Task</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-12">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onDelete={onDelete}
          onSelectTask={onSelectTask}
        />
      ))}
    </div>
  );
};

export default TaskList;
