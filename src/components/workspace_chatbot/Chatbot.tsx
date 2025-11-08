import { Send } from "lucide-react";

const Chatbot = () => {
  return (
    <div className="flex flex-col h-screen bg-white px-10 py-3">
      {/* Chatbot frame */}
      <div className="flex flex-col flex-1 justify-between">
        {/* Conversation frame */}
        <div className="flex-1 bg-white rounded-xl mb-3"></div>

        {/* Chat bar */}
        <div className="flex items-center rounded-xl border-2 border-[#5757F5] px-2 py-1">
          <input
            type="text"
            placeholder="Ask me anything..."
            className="flex-1 border-none outline-none px-3 py-2 text-sm"
          />
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#5757F5] text-white text-xs cursor-pointer hover:bg-[#4747e0]">
            <Send className="w-4 h-4" />
          </div>
        </div>
        <div className="flex justify-center text-xs mt-1 text-[#627193]">
          NecoAI có thể mắc sai sót, vì vậy, nhớ xác minh câu trả lời của
          NecoAI.
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
