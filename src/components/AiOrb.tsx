import { motion } from "framer-motion";

interface AiOrbProps {
  isListening: boolean;
  isSpeaking: boolean;
}

const AiOrb = ({ isListening, isSpeaking }: AiOrbProps) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer rotating ring */}
      <motion.div
        className="absolute w-40 h-40 rounded-full border border-primary/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-48 h-48 rounded-full border border-accent/20"
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      {/* Middle pulsing ring */}
      <motion.div
        className="absolute w-32 h-32 rounded-full"
        style={{
          background: `radial-gradient(circle, hsl(var(--glow-primary) / 0.15) 0%, transparent 70%)`,
        }}
        animate={{
          scale: isListening ? [1, 1.3, 1] : isSpeaking ? [1, 1.15, 1] : [1, 1.05, 1],
        }}
        transition={{
          duration: isListening ? 0.8 : isSpeaking ? 1.2 : 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Core orb */}
      <motion.div
        className={`relative w-24 h-24 rounded-full glow-primary ${
          isListening ? "bg-primary/40" : isSpeaking ? "bg-accent/40" : "bg-primary/20"
        }`}
        style={{
          background: isListening
            ? `radial-gradient(circle, hsl(var(--glow-primary) / 0.6), hsl(var(--glow-primary) / 0.1))`
            : isSpeaking
            ? `radial-gradient(circle, hsl(var(--glow-accent) / 0.6), hsl(var(--glow-accent) / 0.1))`
            : `radial-gradient(circle, hsl(var(--glow-primary) / 0.3), hsl(var(--glow-primary) / 0.05))`,
        }}
        animate={{
          scale: isListening ? [1, 1.1, 1] : [1, 1.02, 1],
        }}
        transition={{
          duration: isListening ? 0.5 : 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Inner glow dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-4 h-4 rounded-full bg-primary"
            animate={{
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Status label */}
      <motion.span
        className="absolute -bottom-8 text-xs font-mono tracking-widest uppercase text-muted-foreground"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {isListening ? "Listening..." : isSpeaking ? "Speaking..." : "Ready"}
      </motion.span>
    </div>
  );
};

export default AiOrb;
