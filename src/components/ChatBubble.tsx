import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatBubbleProps {
  message: ChatMessage;
  index: number;
}

const ChatBubble = ({ message, index }: ChatBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? "bg-accent/20 border border-accent/40" : "bg-primary/20 border border-primary/40"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-accent" />
        ) : (
          <Bot className="w-4 h-4 text-primary" />
        )}
      </div>

      {/* Message */}
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl ${
          isUser
            ? "bg-accent/15 border border-accent/20 rounded-tr-sm"
            : "glass rounded-tl-sm"
        }`}
      >
        <p className="text-sm leading-relaxed text-foreground">{message.content}</p>
        <span className="text-[10px] text-muted-foreground mt-1 block font-mono">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
