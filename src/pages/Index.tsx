import { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Trash2 } from "lucide-react";
import AiOrb from "@/components/AiOrb";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import StatusBar from "@/components/StatusBar";
import { useChat, useVoice } from "@/hooks/useChatbot";

const Index = () => {
  const { messages, sendMessage, isTyping } = useChat();
  const { isListening, isSpeaking, startListening, stopListening, speak } = useVoice();
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoSpeakRef = useRef(true);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Auto-speak assistant responses
  useEffect(() => {
    if (!autoSpeakRef.current) return;
    const last = messages[messages.length - 1];
    if (last?.role === "assistant" && last.id !== "welcome-1") {
      speak(last.content);
    }
  }, [messages, speak]);

  const handleSend = useCallback(
    (text: string) => {
      sendMessage(text);
    },
    [sendMessage]
  );

  const handleToggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening((text) => {
        sendMessage(text);
      });
    }
  }, [isListening, startListening, stopListening, sendMessage]);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden relative">
      {/* Background grid effect */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-border/50"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center glow-primary">
            <div className="w-3 h-3 rounded-full bg-primary" />
          </div>
          <div>
            <h1 className="text-sm font-display font-bold tracking-wider text-primary glow-text">
              AI VOICE ASSISTANT
            </h1>
            <p className="text-[10px] font-mono text-muted-foreground tracking-widest">
              JARVIS WEB INTERFACE
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => (autoSpeakRef.current = !autoSpeakRef.current)}
            className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            title="Toggle auto-speak"
          >
            {autoSpeakRef.current ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
        </div>
      </motion.header>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row relative z-10 overflow-hidden">
        {/* Left: AI Orb (hidden on mobile, shown on desktop) */}
        <div className="hidden lg:flex lg:w-80 items-center justify-center border-r border-border/30">
          <div className="flex flex-col items-center gap-12">
            <AiOrb isListening={isListening} isSpeaking={isSpeaking} />
            <StatusBar />
          </div>
        </div>

        {/* Right: Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile orb - small */}
          <div className="lg:hidden flex justify-center py-4">
            <div className="scale-50">
              <AiOrb isListening={isListening} isSpeaking={isSpeaking} />
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4 scrollbar-hide"
          >
            {messages.map((msg, i) => (
              <ChatBubble key={msg.id} message={msg} index={i} />
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3 items-center"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
                </div>
                <div className="glass px-4 py-3 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-primary/60"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 rounded-full bg-primary/60"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-2 h-2 rounded-full bg-primary/60"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input area */}
          <div className="p-4 md:p-6">
            <ChatInput
              onSendMessage={handleSend}
              isListening={isListening}
              onToggleListening={handleToggleListening}
              isSpeaking={isSpeaking}
            />
            <p className="text-center text-[10px] font-mono text-muted-foreground mt-2 tracking-wider">
              POWERED BY AI • VOICE ENABLED • WEB DEPLOYED
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
