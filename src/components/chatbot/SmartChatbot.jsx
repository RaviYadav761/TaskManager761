import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  X,
  Send,
  RotateCcw,
  Minimize2,
  Maximize2,
  Sparkles,
} from "lucide-react";
import { generateBotResponse, QUICK_PROMPTS } from "../../utils/chatbotLogic";

const getCurrentTimeStr = () => {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const SmartChatbot = ({
  tasks = [],
  isOpen,
  onClose,
  onAddTask,
}) => {
  const [messages, setMessages] = useState(() => [
    {
      id: "msg-welcome",
      sender: "bot",
      text: 'Hello! 👋 I am TaskBot AI, your personal task and productivity assistant.\n\nAsk me about your pending tasks, deadlines, progress, or tell me to create a task by typing "Create <task title>".',
      timestamp: getCurrentTimeStr(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  if (!isOpen) return null;

  const handleSend = (textToSend = input) => {
    const query = (textToSend || "").trim();
    if (!query) return;

    const time = getCurrentTimeStr();
    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: time,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate smart client-side analysis and respond
    setTimeout(() => {
      const botResponse = generateBotResponse(query, tasks, onAddTask);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: botResponse.text,
          taskCard: botResponse.taskCard,
          timestamp: getCurrentTimeStr(),
        },
      ]);
    }, 300);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "msg-welcome",
        sender: "bot",
        text: "Chat cleared! Ask me anything about your tasks, deadlines, or daily planning.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex flex-col bg-white border border-neutral-200 rounded-[28px] shadow-2xl overflow-hidden transition-all duration-300 ${
        isMinimized ? "w-80 h-14" : "w-[92vw] sm:w-96 md:w-[420px] h-[550px] max-h-[85vh]"
      }`}
    >
      {/* Header */}
      <div className="bg-[#1C1D1F] p-4 flex items-center justify-between text-white shrink-0 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white">
            <Bot size={18} className="text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight">TaskBot AI</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-neutral-400">Personal Productivity Assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleResetChat}
            title="Reset Chat"
            className="p-1.5 hover:bg-white/10 rounded-lg text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw size={15} />
          </button>
          <button
            type="button"
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? "Expand" : "Minimize"}
            className="p-1.5 hover:bg-white/10 rounded-lg text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            {isMinimized ? <Maximize2 size={15} /> : <Minimize2 size={15} />}
          </button>
          <button
            type="button"
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

                  <span className="block text-[10px] mt-1.5 text-right font-medium text-neutral-400">
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
            {QUICK_PROMPTS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
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
