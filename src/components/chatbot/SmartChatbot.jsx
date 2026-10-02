import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  RotateCcw,
  Minimize2,
  Maximize2,
  CheckCircle2,
  Clock,
  ListTodo
} from "lucide-react";

const SmartChatbot = ({
  tasks = [],
  isOpen,
  onClose,
  onAddTask,
}) => {
  const [messages, setMessages] = useState([
    {
      id: "msg-welcome",
      sender: "bot",
      text: "Hello! 👋 I am TaskBot AI, your personal task and productivity assistant.\n\nAsk me about your pending tasks, deadlines, progress, or tell me to create a task by typing \"Create <task title>\".",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  // Process user prompt and answer using current real-time task data
  const handleSend = (textToSend = input) => {
    const query = (textToSend || "").trim();
    if (!query) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: time,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate smart thinking and respond
    setTimeout(() => {
      const botResponse = generateBotResponse(query, tasks);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: botResponse.text,
          taskCard: botResponse.taskCard,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 300);
  };

  const generateBotResponse = (rawQuery, taskList) => {
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

  const quickPrompts = [
    { label: "📋 Pending Tasks", query: "Show my pending tasks" },
    { label: "📅 Due Today", query: "What tasks are due today?" },
    { label: "🔥 High Priority", query: "Show urgent high priority tasks" },
    { label: "📊 Progress", query: "Show my task progress summary" },
    { label: "💡 Plan Day", query: "Give me a task planning recommendation for today" },
  ];

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex flex-col bg-white border border-neutral-200 rounded-[28px] shadow-2xl overflow-hidden transition-all duration-300 ${
        isMinimized ? "w-80 h-14" : "w-[92vw] sm:w-96 md:w-[420px] h-[550px] max-h-[85vh]"
      }`}
    >
      {/* Chatbot Header */}
      <div className="bg-[#1C1D1F] p-4 flex items-center justify-between text-white shrink-0 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white">
            <Bot size={18} className="text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight">TaskBot AI</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-neutral-400">Personal Productivity Assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setMessages([
              {
                id: "msg-welcome",
                sender: "bot",
                text: "Chat cleared! Ask me anything about your tasks, deadlines, or daily planning.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }
            ])}
            title="Reset Chat"
            className="p-1.5 hover:bg-white/10 rounded-lg text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw size={15} />
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? "Expand" : "Minimize"}
            className="p-1.5 hover:bg-white/10 rounded-lg text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            {isMinimized ? <Maximize2 size={15} /> : <Minimize2 size={15} />}
          </button>
          <button
            onClick={onClose}
            title="Close Assistant"
            className="p-1.5 hover:bg-white/10 rounded-lg text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-[#FAF9F6]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="w-7 h-7 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Bot size={13} className="text-emerald-400" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-neutral-900 text-white rounded-br-none shadow-sm"
                      : "bg-white text-neutral-900 border border-neutral-200/90 rounded-bl-none shadow-2xs"
                  }`}
                >
                  <div className="font-normal text-xs">{msg.text}</div>

                  {/* Render task preview card if task was created */}
                  {msg.taskCard && (
                    <div className="mt-2.5 p-2.5 bg-[#FAF9F6] border border-neutral-200 rounded-xl flex items-center gap-2.5">
                      {msg.taskCard.image && (
                        <div className="w-9 h-9 rounded-lg bg-white p-1 shrink-0 border border-neutral-200">
                          <img
                            src={msg.taskCard.image}
                            alt={msg.taskCard.title}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="block font-bold text-neutral-900 text-[11px] truncate">
                          {msg.taskCard.title}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-medium">
                          {msg.taskCard.priority} • {msg.taskCard.category}
                        </span>
                      </div>
                    </div>
                  )}

                  <span
                    className={`block text-[10px] mt-1.5 text-right font-medium ${
                      msg.sender === "user" ? "text-neutral-400" : "text-neutral-400"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-white border-t border-neutral-200/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles size={11} className="text-amber-500" />
              Quick:
            </span>
            {quickPrompts.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.query)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#FAF9F6] hover:bg-neutral-100 border border-neutral-200 text-[11px] font-semibold text-neutral-700 transition-all cursor-pointer shadow-2xs"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything or type 'Create <task>'..."
              className="flex-1 bg-[#FAF9F6] focus:bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/10 transition-colors shadow-2xs font-medium"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 bg-neutral-900 hover:bg-black disabled:opacity-30 text-white rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <Send size={14} />
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default SmartChatbot;
