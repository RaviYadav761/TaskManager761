import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import TaskStackCanvas from "../components/canvas/TaskStackCanvas";
import TaskDetailCard from "../components/taskdetail/TaskDetailCard";
import SmartChatbot from "../components/chatbot/SmartChatbot";
import ProjectSynopsisModal from "../components/common/ProjectSynopsisModal";
import CreateTaskModal from "../components/modal/CreateTaskModal";
import TaskFilters from "../components/tasks/TaskFilters";
import TaskList from "../components/tasks/TaskList";
import DashboardSummary from "../components/dashboard/DashboardSummary";
import CalendarView from "../components/calendar/CalendarView";
import EditTaskModal from "../components/modal/EditTaskModal";
import AuthModal from "../components/auth/AuthModal";
import Notes from "./Notes";
import Settings from "./Settings";
import { INITIAL_TASKS } from "../data/initialTasks";
import { Bot, Info, Plus, Menu, Check, Flame } from "lucide-react";
import { playVictoryChime } from "../utils/audio";

const LOCAL_STORAGE_KEY = "ravi_taskly_tasks_v3";
const AUTH_STORAGE_KEY = "taskly_auth_user";

const Homepage = () => {
  // Current logged in user session (Auth modal is first screen if not authenticated)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return !saved; // First screen is Sign In / Create Account if not signed in!
    } catch (e) {}
    return true;
  });

  // Load tasks from LocalStorage or user workspace
  const [tasks, setTasks] = useState(() => {
    try {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser?.email) {
          const userTasks = localStorage.getItem(`taskly_tasks_${parsedUser.email.toLowerCase()}`);
          if (userTasks) {
            return JSON.parse(userTasks);
          }
        }
      }
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load tasks:", e);
    }
    return INITIAL_TASKS;
  });

  // Sync to LocalStorage and user-specific key
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
      if (currentUser?.email) {
        localStorage.setItem(`taskly_tasks_${currentUser.email.toLowerCase()}`, JSON.stringify(tasks));
      }
    } catch (e) {
      console.error("Failed to save tasks:", e);
    }
  }, [tasks, currentUser]);

  // Selected task in the 3D row
  const [selectedTaskId, setSelectedTaskId] = useState(() => {
    return tasks[0]?.id || "";
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState("home"); // 'home' | 'my-tasks' | 'calendar' | 'notes' | 'analytics' | 'settings'

  // Mobile drawer open state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isSynopsisOpen, setIsSynopsisOpen] = useState(false);

  // Floating AI Bot visibility controlled by Settings (default: false / hidden)
  const [showFloatingBot, setShowFloatingBot] = useState(() => {
    try {
      const saved = localStorage.getItem("taskly_profile_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        return Boolean(parsed.showFloatingBot);
      }
    } catch (e) {}
    return false;
  });

  // Edit Task modal state
  const [editingTask, setEditingTask] = useState(null);

  // Focus Timer persistent state
  const [focusTimer, setFocusTimer] = useState(() => {
    try {
      const saved = localStorage.getItem("taskly_active_timer");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.isRunning && parsed.targetEndTime) {
          const remaining = Math.max(0, Math.round((parsed.targetEndTime - Date.now()) / 1000));
          return {
            ...parsed,
            timeLeft: remaining,
            isRunning: remaining > 0,
          };
        }
        return parsed;
      }
    } catch (e) {}
    return {
      taskId: tasks[0]?.id || "",
      durationMinutes: 60,
      timeLeft: 3600,
      targetEndTime: null,
      isRunning: false,
      isCompleted: false,
    };
  });

  // Focus stats in localStorage
  const [focusStats, setFocusStats] = useState(() => {
    try {
      const saved = localStorage.getItem("taskly_focus_stats");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { sessionsCompleted: 0, totalMinutesFocused: 0 };
  });

  // Keep focusTimer selected task valid if tasks change
  useEffect(() => {
    if (!focusTimer.taskId && tasks.length > 0) {
      setFocusTimer((prev) => ({ ...prev, taskId: tasks[0].id }));
    }
  }, [tasks, focusTimer.taskId]);

  // Global Timer background ticking that NEVER dies during tab switching
  useEffect(() => {
    let interval = null;
    if (focusTimer.isRunning && focusTimer.targetEndTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.round((focusTimer.targetEndTime - now) / 1000));

        if (remaining <= 0) {
          clearInterval(interval);
          playVictoryChime();

          if (focusTimer.taskId) {
            handleToggleTaskStatus(focusTimer.taskId);
          }

          setFocusStats((prev) => {
            const updated = {
              sessionsCompleted: prev.sessionsCompleted + 1,
              totalMinutesFocused: prev.totalMinutesFocused + (focusTimer.durationMinutes || 60),
            };
            localStorage.setItem("taskly_focus_stats", JSON.stringify(updated));
            return updated;
          });

          setFocusTimer((prev) => {
            const next = {
              ...prev,
              timeLeft: 0,
              isRunning: false,
              isCompleted: true,
              targetEndTime: null,
            };
            localStorage.setItem("taskly_active_timer", JSON.stringify(next));
            return next;
          });
        } else {
          setFocusTimer((prev) => {
            const next = { ...prev, timeLeft: remaining };
            localStorage.setItem("taskly_active_timer", JSON.stringify(next));
            return next;
          });
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [focusTimer.isRunning, focusTimer.targetEndTime, focusTimer.taskId, focusTimer.durationMinutes]);

  const handleStartTimer = (taskIdToFocus) => {
    const tid = taskIdToFocus || focusTimer.taskId || tasks.find((t) => t.status !== "Completed")?.id || "";
    const targetEndTime = Date.now() + focusTimer.timeLeft * 1000;
    const updated = {
      ...focusTimer,
      taskId: tid,
      isRunning: true,
      isCompleted: false,
      targetEndTime: targetEndTime,
    };
    setFocusTimer(updated);
    localStorage.setItem("taskly_active_timer", JSON.stringify(updated));
  };

  const handlePauseTimer = () => {
    const updated = {
      ...focusTimer,
      isRunning: false,
      targetEndTime: null,
    };
    setFocusTimer(updated);
    localStorage.setItem("taskly_active_timer", JSON.stringify(updated));
  };

  const handleResetTimer = () => {
    const totalSecs = (focusTimer.durationMinutes || 60) * 60;
    const updated = {
      ...focusTimer,
      timeLeft: totalSecs,
      isRunning: false,
      isCompleted: false,
      targetEndTime: null,
    };
    setFocusTimer(updated);
    localStorage.setItem("taskly_active_timer", JSON.stringify(updated));
  };

  const handleSelectDuration = (minutes) => {
    const totalSecs = minutes * 60;
    const targetEndTime = focusTimer.isRunning ? Date.now() + totalSecs * 1000 : null;
    const updated = {
      ...focusTimer,
      durationMinutes: minutes,
      timeLeft: totalSecs,
      targetEndTime: targetEndTime,
      isCompleted: false,
    };
    setFocusTimer(updated);
    localStorage.setItem("taskly_active_timer", JSON.stringify(updated));
  };

  const handleSelectTimerTask = (taskId) => {
    const updated = { ...focusTimer, taskId: taskId, isCompleted: false };
    setFocusTimer(updated);
    localStorage.setItem("taskly_active_timer", JSON.stringify(updated));
  };

  const handleCompleteEarly = () => {
    if (focusTimer.taskId) {
      handleToggleTaskStatus(focusTimer.taskId);
    }
    playVictoryChime();
    setFocusStats((prev) => {
      const updated = {
        sessionsCompleted: prev.sessionsCompleted + 1,
        totalMinutesFocused: prev.totalMinutesFocused + (focusTimer.durationMinutes || 60),
      };
      localStorage.setItem("taskly_focus_stats", JSON.stringify(updated));
      return updated;
    });
    setFocusTimer((prev) => {
      const next = {
        ...prev,
        timeLeft: 0,
        isRunning: false,
        isCompleted: true,
        targetEndTime: null,
      };
      localStorage.setItem("taskly_active_timer", JSON.stringify(next));
      return next;
    });
  };

  // Auth Handlers
  const handleSignUp = (newUser) => {
    // 1. Initialize completely empty clean workspace for new user as requested
    const emptyTasks = [];
    setTasks(emptyTasks);
    setSelectedTaskId("");
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(emptyTasks));
    localStorage.setItem("taskly_notes_v2", JSON.stringify([]));

    // 2. Set profile info
    const newProfile = {
      fullName: newUser.fullName,
      email: newUser.email,
      role: "Personal Workspace",
      avatar: "/assets/avatar.jpg",
      theme: "normal",
      accentColor: "emerald",
      showFloatingBot: false,
    };
    localStorage.setItem("taskly_profile_v1", JSON.stringify(newProfile));
    window.dispatchEvent(new CustomEvent("taskly_settings_updated", { detail: newProfile }));

    // 3. Set auth session
    setCurrentUser(newUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    setIsAuthModalOpen(false);
    setActiveTab("home");
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));

    const email = user.email ? user.email.toLowerCase() : "";
    let userTasks = null;
    let userNotes = null;

    if (email) {
      try {
        const savedT = localStorage.getItem(`taskly_tasks_${email}`);
        if (savedT) userTasks = JSON.parse(savedT);
      } catch (e) {}

      try {
        const savedN = localStorage.getItem(`taskly_notes_${email}`);
        if (savedN) userNotes = JSON.parse(savedN);
      } catch (e) {}
    }

    if (userTasks !== null && Array.isArray(userTasks)) {
      setTasks(userTasks);
      setSelectedTaskId(userTasks[0]?.id || "");
    } else {
      // Clean workspace for new user
      const cleanTasks = [];
      setTasks(cleanTasks);
      setSelectedTaskId("");
      localStorage.setItem(`taskly_tasks_${email}`, JSON.stringify(cleanTasks));
    }

    if (userNotes !== null && Array.isArray(userNotes)) {
      localStorage.setItem("taskly_notes_v2", JSON.stringify(userNotes));
    } else {
      localStorage.setItem("taskly_notes_v2", JSON.stringify([]));
    }

    const currentProf = {
      fullName: user.fullName || email.split("@")[0] || "User",
      email: user.email,
      role: user.role || "Personal Workspace",
      avatar: user.avatar || "/assets/avatar.jpg",
      theme: "normal",
      accentColor: "emerald",
      showFloatingBot: false,
    };
    localStorage.setItem("taskly_profile_v1", JSON.stringify(currentProf));
    window.dispatchEvent(new CustomEvent("taskly_settings_updated", { detail: currentProf }));

    setIsAuthModalOpen(false);
    setActiveTab("home");
  };

  const handleContinueDemo = () => {
    const demoUser = {
      id: "demo-alex",
      fullName: "Alex Morgan",
      email: "alex.morgan@taskly.io",
      role: "Product Designer",
      avatar: "/assets/avatar.jpg",
    };
    setCurrentUser(demoUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoUser));
    setTasks(INITIAL_TASKS);
    setSelectedTaskId(INITIAL_TASKS[0]?.id || "");
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_TASKS));

    const demoProf = {
      fullName: "Alex Morgan",
      email: "alex.morgan@taskly.io",
      role: "Product Designer",
      avatar: "/assets/avatar.jpg",
      theme: "normal",
      accentColor: "emerald",
      showFloatingBot: false,
    };
    localStorage.setItem("taskly_profile_v1", JSON.stringify(demoProf));
    window.dispatchEvent(new CustomEvent("taskly_settings_updated", { detail: demoProf }));

    setIsAuthModalOpen(false);
    setActiveTab("home");
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setCurrentUser(null);
    setIsAuthModalOpen(true);
    setActiveTab("home");
  };

  // Synchronize settings & theme
  useEffect(() => {
    const applySettingsAndTheme = () => {
      try {
        const saved = localStorage.getItem("taskly_profile_v1");
        if (saved) {
          const parsed = JSON.parse(saved);
          setShowFloatingBot(Boolean(parsed.showFloatingBot));
          const currentTheme = parsed.theme || "normal";
          document.body.className = `theme-${currentTheme}`;
        } else {
          document.body.className = "theme-normal";
        }
      } catch (e) {
        document.body.className = "theme-normal";
      }
    };

    applySettingsAndTheme();
    window.addEventListener("taskly_settings_updated", applySettingsAndTheme);
    window.addEventListener("storage", applySettingsAndTheme);
    return () => {
      window.removeEventListener("taskly_settings_updated", applySettingsAndTheme);
      window.removeEventListener("storage", applySettingsAndTheme);
    };
  }, []);

  // Filters for "My Tasks" view
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'pending' | 'completed' | 'today'
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("dueDateAsc");

  // Only active (Pending) tasks show on Home 3D line stack
  const activeHomeTasks = tasks.filter((t) => t.status !== "Completed");

  // Selected task object
  const selectedTask =
    tasks.find((t) => t.id === selectedTaskId) ||
    activeHomeTasks[0] ||
    tasks[0] ||
    null;

  // Actions
  const handleAddTask = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
    setSelectedTaskId(newTask.id);
  };

  const handleDeleteTask = (taskId) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    if (selectedTaskId === taskId && updated.length > 0) {
      setSelectedTaskId(updated[0].id);
    }
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    if (selectedTaskId === updatedTask.id) {
      setSelectedTaskId(updatedTask.id);
    }
  };

  const handleToggleTaskStatus = (taskId) => {
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id === taskId) {
          const nextStatus = t.status === "Completed" ? "Pending" : "Completed";
          return { ...t, status: nextStatus };
        }
        return t;
      });
      return updated;
    });

    const remainingPending = tasks.filter(
      (t) => t.id !== taskId && t.status !== "Completed"
    );
    if (selectedTaskId === taskId && remainingPending.length > 0) {
      setSelectedTaskId(remainingPending[0].id);
    }
  };

  // Compute counts for dashboard tabs
  const todayStr = new Date().toISOString().split("T")[0];
  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status !== "Completed").length,
    completed: tasks.filter((t) => t.status === "Completed").length,
    today: tasks.filter(
      (t) => t.dueDate === todayStr && t.status !== "Completed"
    ).length,
  };

  // Filter tasks for "My Tasks" view
  const filteredTasks = tasks.filter((t) => {
    if (statusFilter === "pending" && t.status === "Completed") return false;
    if (statusFilter === "completed" && t.status !== "Completed") return false;
    if (
      statusFilter === "today" &&
      (t.dueDate !== todayStr || t.status === "Completed")
    )
      return false;
    if (priorityFilter !== "All" && !t.priority?.includes(priorityFilter))
      return false;
    if (categoryFilter !== "All" && t.category !== categoryFilter) return false;
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

  return (
    <div className="min-h-screen w-full bg-[#F5F3ED] text-[#1E2022] flex flex-col lg:flex-row overflow-x-hidden lg:overflow-x-auto">
      {/* 1. Left Sidebar (Taskly) with Live Timer Pill (Hidden on mobile, drawer when isMobileOpen) */}
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
            <span className="font-black text-base tracking-tight text-neutral-900">Taskly</span>
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
        // EXACT SCREENSHOT 3-COLUMN VIEW ON LAPTOP: Sidebar + Center Line Stack (Active pending tasks) + Right Task Detail Panel
        // BEAUTIFUL RESPONSIVE COMPACT VIEW ON MOBILE: Stacked with scaled 3D icons, compact pills, detail card below
        <div className="flex-1 w-full min-w-0 lg:min-w-[700px] flex flex-col lg:flex-row items-center justify-start lg:justify-between p-3 sm:p-4 lg:p-6 gap-6 min-h-[calc(100vh-57px)] lg:h-screen overflow-y-auto lg:overflow-hidden">
          {/* Center 3D Stack (Active Pending Tasks - completed tasks are removed) */}
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
        // "My Tasks" View with In-place Edit and Filters
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
            onEdit={(task) => {
              setEditingTask(task);
            }}
            onDelete={handleDeleteTask}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onSelectTask={(id) => {
              setSelectedTaskId(id);
              setActiveTab("home");
            }}
          />
        </div>
      ) : activeTab === "calendar" ? (
        // CALENDAR VIEW: Calendar Grid Card + Daily Tasks Notebook Card + Bottom Bar
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
        // TWO-COLUMN NOTES PAGE matching Image 2 with optional closing remarks and lightbox zoom
        <Notes
          embedded={true}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSynopsis={() => setIsSynopsisOpen(true)}
          onOpenChatbot={() => setIsChatbotOpen(true)}
        />
      ) : activeTab === "settings" ? (
        // PROFILE & SETTINGS PAGE with theme toggle and Sign Out session card
        <Settings
          embedded={true}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSynopsis={() => setIsSynopsisOpen(true)}
          onOpenChatbot={() => setIsChatbotOpen(true)}
          onLogout={handleLogout}
          currentUser={currentUser}
        />
      ) : (
        // Glassmorphic Analytics & Overview with persistent focus timer and priority breakdown
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

      {/* Floating Smart Chatbot Toggle - Only visible when enabled in Settings */}
      {showFloatingBot && !isChatbotOpen && (
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#1C1D1F] hover:bg-black text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 transition-all duration-300 hover:scale-105 cursor-pointer animate-in fade-in"
          title="Open Smart Task Assistant"
        >
          <Bot size={18} />
          <span className="text-xs font-bold">Ask TaskBot</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>
      )}

      {/* Smart Chatbot Widget */}
      <SmartChatbot
        tasks={tasks}
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        onAddTask={handleAddTask}
      />

      {/* Project Synopsis Modal */}
      <ProjectSynopsisModal
        isOpen={isSynopsisOpen}
        onClose={() => setIsSynopsisOpen(false)}
      />

      {/* Create Task Modal matching Image 2 */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAddTask={handleAddTask}
      />

      {/* Edit Task Modal - Opens in-place on My Tasks without redirecting to Home */}
      <EditTaskModal
        isOpen={!!editingTask}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onUpdateTask={handleUpdateTask}
      />

      {/* Auth Modal for Sign In, Create Account (clean workspace) & Demo */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onLogin={handleLogin}
        onSignUp={handleSignUp}
        onContinueDemo={handleContinueDemo}
      />
    </div>
  );
};

export default Homepage;