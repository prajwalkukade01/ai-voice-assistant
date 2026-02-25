import { motion } from "framer-motion";
import { Cpu, Wifi, Shield, Zap } from "lucide-react";

const StatusBar = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground uppercase tracking-widest"
    >
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
        <span>Online</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Cpu className="w-3 h-3" />
        <span>AI Core</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Wifi className="w-3 h-3" />
        <span>Connected</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Shield className="w-3 h-3" />
        <span>Secure</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Zap className="w-3 h-3" />
        <span>v2.0</span>
      </div>
    </motion.div>
  );
};

export default StatusBar;
