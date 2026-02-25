import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Send, Search, Volume2 } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isListening: boolean;
  onToggleListening: () => void;
  isSpeaking: boolean;
  disabled?: boolean;
}

const ChatInput = ({
  onSendMessage,
  isListening,
  onToggleListening,
  disabled,
}: ChatInputProps) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInput("");
    inputRef.current?.focus();
  }, [input, onSendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-2 flex items-center gap-2"
    >
      {/* Mic button */}
      <button
        onClick={onToggleListening}
        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
          isListening
            ? "bg-primary/30 glow-primary text-primary"
            : "bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground"
        }`}
        title={isListening ? "Stop listening" : "Start voice input"}
      >
        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </button>

      {/* Text input */}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isListening ? "Listening..." : "Type a message or use voice..."}
        disabled={disabled}
        className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground font-mono"
      />

      {/* Send button */}
      <button
        onClick={handleSend}
        disabled={!input.trim() || disabled}
        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-primary/20 text-primary hover:bg-primary/30 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Send className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default ChatInput;
