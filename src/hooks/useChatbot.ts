import { useState, useCallback, useRef } from "react";
import { ChatMessage } from "@/components/ChatBubble";

/* ---------------- BACKEND API ---------------- */

const sendMessageToBackend = async (message: string): Promise<string> => {
  const response = await fetch("http://127.0.0.1:5000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  const data = await response.json();
  return data.response;
};

/* ---------------- WELCOME MESSAGE ---------------- */

const WELCOME_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-1",
    role: "assistant",
    content: "Hello! I'm Jarvis. Say 'Hey Jarvis' to talk to me.",
    timestamp: new Date(),
  },
];

/* ---------------- CHAT HOOK ---------------- */

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(WELCOME_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);

  const { speak } = useVoice();

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      try {
        const aiReply = await sendMessageToBackend(content);

        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: aiReply,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        speak(aiReply);
      } catch {
        const errorMsg = "Backend server error.";

        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: errorMsg,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        speak(errorMsg);
      }

      setIsTyping(false);
    },
    [speak]
  );

  return { messages, sendMessage, isTyping };
}

/* ---------------- VOICE HOOK (STABLE JARVIS MODE) ---------------- */

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef<any>(null);
  const jarvisActiveRef = useRef(false);
  const onResultRef = useRef<(text: string) => void>(() => {});

  /* ✅ Prevent Chrome crash */
  const safeStart = (recognition: any) => {
    try {
      recognition.start();
    } catch (err) {
      console.log("⚠ Start prevented:", err);
    }
  };

  const createRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Use Google Chrome for voice features.");
      return null;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      console.log("🎤 Listening...");
    };

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript.toLowerCase();
      console.log("🗣 Heard:", text);

      if (text.includes("hey jarvis")) {
        const cleaned = text.replace("hey jarvis", "").trim();

        if (cleaned) {
          onResultRef.current(cleaned);
        }
      }
    };

    recognition.onend = () => {
      setIsListening(false);

      if (jarvisActiveRef.current) {
        console.log("🔁 Restarting safely...");
        safeStart(recognition);
      }
    };

    recognition.onerror = (event: any) => {
      console.log("❌ Speech error:", event.error);
      setIsListening(false);
    };

    return recognition;
  };

  const startListening = useCallback((onResult: (text: string) => void) => {
    if (jarvisActiveRef.current) return;

    jarvisActiveRef.current = true;
    onResultRef.current = onResult;

    const recognition = createRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;
    safeStart(recognition);
  }, []);

  const stopListening = useCallback(() => {
    jarvisActiveRef.current = false;
    recognitionRef.current?.stop();
    setIsListening(false);
    console.log("🛑 Stopped");
  }, []);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  return {
    isListening,
    isSpeaking,
    startListening,
    stopListening,
    speak,
  };
}