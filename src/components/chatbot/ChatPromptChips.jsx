import React from "react";
import { QUICK_PROMPTS } from "../../utils/chatbotLogic";

const ChatPromptChips = ({ onSelectPrompt }) => {
  return (
    <div className="p-2.5 bg-[#FAF9F6] border-t border-neutral-150 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
      {QUICK_PROMPTS.map((chip, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onSelectPrompt(chip.query)}
          className="px-3 py-1.5 rounded-full bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-800 text-[11px] font-bold shrink-0 transition-all cursor-pointer shadow-2xs hover:scale-102"
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
};

export default ChatPromptChips;
