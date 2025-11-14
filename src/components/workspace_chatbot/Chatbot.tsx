import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

// Định nghĩa kiểu message
type Message = {
  sender: "user" | "bot";
  text: string;
};

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll xuống cuối
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Mock bot trả lời
    setTimeout(() => {
      const botMessage: Message = {
        sender: "bot",
        text: `Bạn vừa nói: "${userMessage.text}"`,
      };

      setMessages((prev) => [...prev, botMessage]);
    }, 600);
  };

  return (
    <div className="flex flex-col flex-1 px-10 py-3 overflow-x-hidden">
      {/* Chat frame */}
      <div className="flex flex-col flex-1 justify-between">
        {/* Conversation */}
        <div className="flex-1 rounded-xl mb-3 p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`w-fit max-w-[70%] p-2 rounded-lg mb-2 shadow text-sm break-words whitespace-pre-wrap ${
                msg.sender === "user"
                  ? "bg-[#5757F5] text-white ml-auto"
                  : "bg-white text-black"
              }`}
            >
              {msg.text}
            </div>
          ))}

          {/* Scroll anchor */}
          <div ref={scrollRef}></div>
        </div>

        {/* Bottom chat bar */}
        <div className="flex items-center rounded-xl border-2 border-[#5757F5] px-2 py-1">
          <input
            type="text"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 border-none outline-none px-3 py-2 text-sm"
          />
          <div
            onClick={handleSend}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#5757F5] text-white cursor-pointer hover:bg-[#4747e0]"
          >
            <Send className="w-4 h-4" />
          </div>
        </div>

        <div className="flex justify-center text-xs mt-1 text-[#627193]">
          NecoAI có thể mắc sai sót, vì vậy hãy xác minh câu trả lời.
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
