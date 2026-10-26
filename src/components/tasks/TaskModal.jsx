import React from "react";
import CreateTaskModal from "../modal/CreateTaskModal";
import EditTaskModal from "../modal/EditTaskModal";

/**
 * TaskModal wrapper component for backwards compatibility.
 * Delegates to CreateTaskModal or EditTaskModal depending on taskToEdit prop.
 */
const TaskModal = ({ isOpen, onClose, onSave, taskToEdit = null }) => {
  if (taskToEdit) {
    return (
      <EditTaskModal
        isOpen={isOpen}
        onClose={onClose}
        task={taskToEdit}
        onUpdateTask={onSave}
      />
    );
  }

  return (
    <CreateTaskModal
      isOpen={isOpen}
      onClose={onClose}
      onAddTask={onSave}
    />
  );
};

export default TaskModal;
