import React from "react";
import { Bot, User, Clock, Tag } from "lucide-react";

const ChatMessage = ({ message }) => {
  const isBot = message.sender === "bot";

  return (
    <div className={`flex gap-3 ${isBot ? "items-start" : "items-start flex-row-reverse"}`}>
      {/* Avatar Icon */}
      <div
        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
          isBot ? "bg-neutral-900 text-white" : "bg-neutral-200 text-neutral-800"
        }`}
      >
        {isBot ? <Bot size={15} /> : <User size={15} />}
      </div>

      {/* Bubble Content */}
      <div className={`max-w-[85%] space-y-2 ${isBot ? "text-left" : "text-right"}`}>
        <div
          className={`inline-block p-3.5 rounded-2xl text-xs leading-relaxed font-normal shadow-2xs ${
            isBot
              ? "bg-[#FAF9F6] text-neutral-900 border border-neutral-200/90 whitespace-pre-wrap"
              : "bg-neutral-900 text-white"
          }`}
        >
          {message.text}
        </div>

        {/* Optional Task Card if created via bot */}
        {message.taskCard && (
          <div className="bg-white rounded-2xl p-3 border border-neutral-200 shadow-sm flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-[#F5F3ED] overflow-hidden flex items-center justify-center p-1 shrink-0">
              <img
                src={message.taskCard.image || "/assets/dumbbell.jpg"}
                alt={message.taskCard.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-neutral-900 truncate block">
                {message.taskCard.title}
              </span>
              <div className="flex items-center gap-2 text-[10px] text-neutral-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <Tag size={10} /> {message.taskCard.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={10} /> {message.taskCard.dueDate || "Today"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div className="text-[10px] text-neutral-400 font-medium px-1">
          {message.timestamp}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
