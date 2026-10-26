import React, { useState, useMemo } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import TaskStackCanvas from "../components/canvas/TaskStackCanvas";
import TaskDetailCard from "../components/taskdetail/TaskDetailCard";
import SmartChatbot from "../components/chatbot/SmartChatbot";
import ProjectSynopsisModal from "../components/common/ProjectSynopsisModal";
import CreateTaskModal from "../components/modal/CreateTaskModal";
import EditTaskModal from "../components/modal/EditTaskModal";
import TaskFilters from "../components/tasks/TaskFilters";
import TaskList from "../components/tasks/TaskList";
import DashboardSummary from "../components/dashboard/DashboardSummary";
import CalendarView from "../components/calendar/CalendarView";
import Notes from "./Notes";
import Settings from "./Settings";
import { useTasks } from "../hooks/useTasks";
import { useFocusTimer } from "../hooks/useFocusTimer";
import { useTheme } from "../hooks/useTheme";
import { getTodayDateInput } from "../utils/dateUtils";
import { Bot, Info, Plus, Menu, Flame } from "lucide-react";

const Homepage = () => {
  // Navigation & UI state
  const [activeTab, setActiveTab] = useState("home");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isSynopsisOpen, setIsSynopsisOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Filter & Search state for "My Tasks"
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("dueDateAsc");

  // Custom Hooks for Modular Architecture
  const { showFloatingBot } = useTheme();

  // Tasks hook
  const {
    tasks,
    selectedTaskId,
    setSelectedTaskId,
    handleAddTask,
    handleDeleteTask,
    handleUpdateTask,
    handleToggleTaskStatus,
  } = useTasks();

  const {
    focusTimer,
    focusStats,
    handleStartTimer,
    handlePauseTimer,
    handleResetTimer,
    handleSelectDuration,
    handleSelectTimerTask,
    handleCompleteEarly,
  } = useFocusTimer(tasks, handleToggleTaskStatus);

  // Active (pending) tasks for 3D homepage stack
  const activeHomeTasks = useMemo(
    () => tasks.filter((t) => t.status !== "Completed"),
    [tasks]
  );

  // Current selected task
  const selectedTask = useMemo(
    () =>
      tasks.find((t) => t.id === selectedTaskId) ||
      activeHomeTasks[0] ||
      tasks[0] ||
      null,
    [tasks, selectedTaskId, activeHomeTasks]
  );

  const todayStr = useMemo(() => getTodayDateInput(), []);

  // Compute counts for dashboard and filters
  const taskCounts = useMemo(
    () => ({
      all: tasks.length,
      pending: tasks.filter((t) => t.status !== "Completed").length,
      completed: tasks.filter((t) => t.status === "Completed").length,
      today: tasks.filter((t) => t.dueDate === todayStr && t.status !== "Completed").length,
    }),
    [tasks, todayStr]
  );

  // Filter tasks for "My Tasks" view
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (statusFilter === "pending" && t.status === "Completed") return false;
      if (statusFilter === "completed" && t.status !== "Completed") return false;
      if (
        statusFilter === "today" &&
        (t.dueDate !== todayStr || t.status === "Completed")
      ) {
        return false;
      }
      if (priorityFilter !== "All" && !t.priority?.includes(priorityFilter)) {
        return false;
      }
      if (categoryFilter !== "All" && t.category !== categoryFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          (t.notesHeader && t.notesHeader.toLowerCase().includes(q)) ||
          (t.goal && t.goal.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [tasks, statusFilter, priorityFilter, categoryFilter, searchQuery, todayStr]);

  return (
    <div className="min-h-screen w-full bg-[#F5F3ED] text-[#1E2022] flex flex-col lg:flex-row overflow-x-hidden lg:overflow-x-auto">
      {/* 1. Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSynopsis={() => setIsSynopsisOpen(true)}
        onOpenChatbot={() => setIsChatbotOpen(true)}
        focusTimer={focusTimer}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Mobile Top Navigation Header (< lg screens) */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#F5F3ED] border-b border-[#EAE5DC]/80 sticky top-0 z-30 shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-1.5 -ml-1 text-neutral-800 hover:bg-neutral-200/60 rounded-xl transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-black text-xs shadow-xs">
              T
            </div>
            <span className="font-black text-base tracking-tight text-neutral-900">
              Taskly
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {focusTimer?.isRunning && (
            <div
              onClick={() => setActiveTab("analytics")}
              className="px-2.5 py-1 rounded-full bg-neutral-900 text-amber-300 flex items-center gap-1.5 cursor-pointer text-xs font-bold font-mono shadow-2xs"
            >
              <Flame size={12} className="text-amber-400" />
              <span>{Math.floor(focusTimer.timeLeft / 60)}m</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="p-2 rounded-xl bg-neutral-900 text-white hover:bg-black transition-colors cursor-pointer shadow-2xs flex items-center gap-1 text-xs font-bold"
            title="Create Task"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>
      </header>

      {/* 3. Main Work Area */}
      {activeTab === "home" ? (
        <div className="flex-1 w-full min-w-0 lg:min-w-[700px] flex flex-col lg:flex-row items-center justify-start lg:justify-between p-3 sm:p-4 lg:p-6 gap-6 min-h-[calc(100vh-57px)] lg:h-screen overflow-y-auto lg:overflow-hidden">
          {/* Center 3D Stack */}
          <div className="w-full lg:flex-1 flex flex-col justify-between items-center min-h-[380px] lg:h-full shrink-0 lg:overflow-y-auto no-scrollbar">
            <TaskStackCanvas
              tasks={activeHomeTasks}
              selectedTaskId={selectedTaskId}
              onSelectTask={setSelectedTaskId}
              onAddTask={handleAddTask}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
            />
          </div>

          {/* Right Task Detail Card */}
          <div className="w-full max-w-md lg:max-w-none lg:w-[370px] xl:w-[390px] shrink-0 pb-10 lg:pb-0 lg:h-full lg:py-4 lg:pr-3 flex flex-col justify-center">
            <TaskDetailCard
              task={selectedTask}
              onDeleteTask={handleDeleteTask}
              onToggleStatus={handleToggleTaskStatus}
              onEditTask={(task) => setEditingTask(task)}
              onStartFocusTimer={(task) => {
                handleSelectTimerTask(task.id);
                handleStartTimer(task.id);
              }}
            />
          </div>
        </div>
      ) : activeTab === "my-tasks" ? (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto overflow-y-auto min-h-[calc(100vh-57px)] lg:h-screen">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                All Tasks & Assignments
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Organize, track, and manage your daily tasks and priorities
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Plus size={16} />
              <span>Create Task</span>
            </button>
          </div>

          <TaskFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeTab={statusFilter}
            setActiveTab={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            taskCounts={taskCounts}
          />

          <TaskList
            tasks={filteredTasks}
            onToggleStatus={handleToggleTaskStatus}
            onEdit={(task) => setEditingTask(task)}
            onDelete={handleDeleteTask}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onSelectTask={(id) => {
              setSelectedTaskId(id);
              setActiveTab("home");
            }}
          />
        </div>
      ) : activeTab === "calendar" ? (
        <CalendarView
          tasks={tasks}
          onToggleStatus={handleToggleTaskStatus}
          onAddTask={handleAddTask}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onSelectTask={(id) => {
            setSelectedTaskId(id);
            setActiveTab("home");
          }}
        />
      ) : activeTab === "notes" ? (
        <Notes
          embedded={true}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSynopsis={() => setIsSynopsisOpen(true)}
          onOpenChatbot={() => setIsChatbotOpen(true)}
        />
      ) : activeTab === "settings" ? (
        <Settings
          embedded={true}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSynopsis={() => setIsSynopsisOpen(true)}
          onOpenChatbot={() => setIsChatbotOpen(true)}
        />
      ) : (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto overflow-y-auto min-h-[calc(100vh-57px)] lg:h-screen">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                Project Dashboard & Analytics
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Performance metrics and task progress tracking
              </p>
            </div>
            <button
              onClick={() => setIsSynopsisOpen(true)}
              className="px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-all"
            >
              <Info size={16} />
              <span>Workspace Info</span>
            </button>
          </div>

          <DashboardSummary
            tasks={tasks}
            focusTimer={focusTimer}
            onStartTimer={handleStartTimer}
            onPauseTimer={handlePauseTimer}
            onResetTimer={handleResetTimer}
            onSelectDuration={handleSelectDuration}
            onSelectTimerTask={handleSelectTimerTask}
            focusStats={focusStats}
            onCompleteEarly={handleCompleteEarly}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onOpenChatbot={() => setIsChatbotOpen(true)}
            onFilterChange={() => setActiveTab("my-tasks")}
            onToggleStatus={handleToggleTaskStatus}
          />
        </div>
      )}

      {/* Floating Smart Chatbot Button */}
      {showFloatingBot && !isChatbotOpen && (
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#1C1D1F] hover:bg-black text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 transition-all duration-300 hover:scale-105 cursor-pointer animate-in fade-in"
          title="Open Smart Task Assistant"
        >
          <Bot size={18} />
          <span className="text-xs font-bold">Ask TaskBot</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      )}

      {/* Modals */}
      <SmartChatbot
        tasks={tasks}
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        onAddTask={handleAddTask}
      />

      <ProjectSynopsisModal
        isOpen={isSynopsisOpen}
        onClose={() => setIsSynopsisOpen(false)}
      />

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAddTask={handleAddTask}
      />

      <EditTaskModal
        isOpen={Boolean(editingTask)}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onUpdateTask={handleUpdateTask}
      />
    </div>
  );
};

export default Homepage;