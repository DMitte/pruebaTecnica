"use client";

import { motion } from "framer-motion";

export function AnimatedLine({ children }: { children: React.ReactNode }) {
  const strokeDashValue = 1000; // For really long lines, you might need to increase this value

  return (
    <motion.g
      initial={{ strokeDashoffset: strokeDashValue }}
      animate={{ strokeDashoffset: 0 }}
      transition={{
        strokeDashoffset: { type: "spring", duration: 1.5, bounce: 0 },
      }}
      style={{ strokeDasharray: strokeDashValue }}
    >
      {children}
    </motion.g>
  );
}
