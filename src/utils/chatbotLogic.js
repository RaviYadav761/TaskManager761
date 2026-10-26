/**
 * Intelligent Client-Side NLP Engine for Smart Chatbot
 * Analyzes active task list in memory and supports queries, filters,
 * day planning recommendations, and instant task creation without paid external APIs.
 */

export const QUICK_PROMPTS = [
  { label: "📋 Pending Tasks", query: "Show my pending tasks" },
  { label: "📅 Due Today", query: "What tasks are due today?" },
  { label: "🔥 High Priority", query: "Show urgent high priority tasks" },
  { label: "📊 Progress", query: "Show my task progress summary" },
  { label: "💡 Plan Day", query: "Give me a task planning recommendation for today" },
];

export const generateBotResponse = (rawQuery, taskList = [], onAddTask = null) => {
  const q = rawQuery.toLowerCase();
  const todayStr = new Date().toISOString().split("T")[0];

  const pendingTasks = taskList.filter((t) => t.status !== "Completed");
  const completedTasks = taskList.filter((t) => t.status === "Completed");
  const todayTasks = taskList.filter((t) => t.dueDate === todayStr && t.status !== "Completed");
  const highPriorityTasks = pendingTasks.filter((t) => t.priority?.includes("High"));

  // Command to add a task: "add <task name>" or "create <task name>"
  if (q.startsWith("add ") || q.startsWith("create ")) {
    const taskTitle = rawQuery.replace(/^(add|create)\s*(task)?/i, "").trim();
    if (taskTitle) {
      let image = "/assets/dumbbell.jpg";
      let category = "Personal";
      const lower = taskTitle.toLowerCase();
      if (lower.includes("shop") || lower.includes("buy")) {
        image = "/assets/shopping.jpg";
        category = "Shopping";
      } else if (lower.includes("read") || lower.includes("book") || lower.includes("study")) {
        image = "/assets/books.jpg";
        category = "Personal Growth";
      } else if (lower.includes("code") || lower.includes("project") || lower.includes("work")) {
        image = "/assets/laptop.jpg";
        category = "Work & Projects";
      }

      const newTask = {
        id: `task-${Date.now()}`,
        pillTitle: taskTitle.length > 15 ? taskTitle.substring(0, 14) + "..." : taskTitle,
        title: taskTitle,
        category: category,
        priority: "Medium Priority",
        status: "Pending",
        date: "Today",
        dueDate: todayStr,
        time: "6:00 PM – 7:00 PM",
        repeat: "Daily",
        goal: `Complete ${taskTitle}`,
        notesHeader: "Task objectives",
        bulletPoints: [
          "Track progress carefully",
          "Complete core action items",
          "Mark completed when finished",
        ],
        image: image,
        createdAt: new Date().toISOString(),
      };

      if (onAddTask) {
        onAddTask(newTask);
      }

      return {
        text: `✅ Task created successfully!\n\nI have added "${taskTitle}" to your workspace with Medium priority due today.`,
        taskCard: newTask,
      };
    }
  }

  // Pending tasks
  if (
    q.includes("pending") ||
    q.includes("remaining") ||
    q.includes("unfinished") ||
    q.includes("incomplete") ||
    q.includes("left")
  ) {
    if (pendingTasks.length === 0) {
      return {
        text: "🎉 Outstanding! You have 0 pending tasks. Everything on your list is completed!",
      };
    }
    const listSummary = pendingTasks
      .map(
        (t, idx) =>
          `${idx + 1}. **${t.title}** • ${t.priority || "Pending"} (${t.dueDate || "Today"})`
      )
      .join("\n\n");
    return {
      text: `You have **${pendingTasks.length} pending task(s)** in your workspace:\n\n${listSummary}`,
    };
  }

  // Completed tasks
  if (q.includes("completed") || q.includes("finished") || q.includes("done")) {
    const pct = taskList.length > 0 ? Math.round((completedTasks.length / taskList.length) * 100) : 0;
    if (completedTasks.length === 0) {
      return {
        text: `You haven't completed any tasks yet (${pct}% completion rate). Pick an urgent task to get started!`,
      };
    }
    const listSummary = completedTasks
      .map((t, idx) => `${idx + 1}. ✓ **${t.title}** (${t.category})`)
      .join("\n");
    return {
      text: `Great progress! You have completed **${completedTasks.length} out of ${taskList.length} tasks (${pct}%)**:\n\n${listSummary}`,
    };
  }

  // Today's tasks
  if (q.includes("today") || q.includes("today's")) {
    if (todayTasks.length === 0) {
      return {
        text: "📅 You have no pending tasks scheduled for today. You are all caught up!",
      };
    }
    const listSummary = todayTasks
      .map(
        (t, idx) =>
          `${idx + 1}. 📌 **${t.title}** [${t.priority || "Medium"}] - ${t.category}`
      )
      .join("\n\n");
    return {
      text: `Here are your **${todayTasks.length} task(s) for today**:\n\n${listSummary}`,
    };
  }

  // High priority tasks
  if (q.includes("high") || q.includes("urgent") || q.includes("priority")) {
    if (highPriorityTasks.length === 0) {
      return {
        text: "Good news! You have no High Priority pending tasks right now.",
      };
    }
    const listSummary = highPriorityTasks
      .map(
        (t, idx) =>
          `${idx + 1}. 🔥 **${t.title}** (Due: ${t.dueDate || "Today"}) - ${t.category}`
      )
      .join("\n\n");
    return {
      text: `Here are your **${highPriorityTasks.length} High-Priority task(s)** requiring focus:\n\n${listSummary}`,
    };
  }

  // Task planning / recommendations
  if (
    q.includes("plan") ||
    q.includes("planning") ||
    q.includes("schedule") ||
    q.includes("suggest") ||
    q.includes("routine")
  ) {
    if (pendingTasks.length === 0) {
      return {
        text: "All your tasks are completed! Enjoy your day or create a new goal.",
      };
    }
    const urgent = pendingTasks.find((t) => t.priority?.includes("High")) || pendingTasks[0];
    const secondary = pendingTasks.find((t) => t.id !== urgent.id) || pendingTasks[1];

    return {
      text: `💡 **Smart Task Planning Strategy for Today:**\n\n` +
        `1. **Top Priority:** Start with *"${urgent.title}"* to build early momentum.\n\n` +
        (secondary ? `2. **Secondary Goal:** Follow up with *"${secondary.title}"*.\n\n` : "") +
        `3. **Review:** Check off deliverables and review remaining items in My Tasks!`,
    };
  }

  // Progress / statistics
  if (
    q.includes("progress") ||
    q.includes("stat") ||
    q.includes("dashboard") ||
    q.includes("summary")
  ) {
    const pct = taskList.length > 0 ? Math.round((completedTasks.length / taskList.length) * 100) : 0;
    return {
      text: `📊 **Workspace Performance Summary:**\n\n` +
        `• Total Tasks: **${taskList.length}**\n` +
        `• Completed Tasks: **${completedTasks.length}**\n` +
        `• Pending Tasks: **${pendingTasks.length}**\n` +
        `• High Priority Pending: **${highPriorityTasks.length}**\n` +
        `• Overall Completion: **${pct}%**`,
    };
  }

  // Help
  if (q.includes("help") || q.includes("hi") || q.includes("hello")) {
    return {
      text: `Hello! I can assist you with:\n\n` +
        `• Showing pending and completed tasks\n` +
        `• Checking tasks due today\n` +
        `• Highlighting urgent high priority tasks\n` +
        `• Creating tasks on the fly (type "create <task title>")\n` +
        `• Task planning recommendations\n\n` +
        `Try clicking one of the quick prompt chips below!`,
    };
  }

  // Generic intelligent fallback
  return {
    text: `I understood your message regarding "${rawQuery}". Currently you have **${pendingTasks.length} pending task(s)** and **${completedTasks.length} completed task(s)**.\n\nAsk me "Show pending tasks", "Tasks due today", or "Create [task title]".`,
  };
};
