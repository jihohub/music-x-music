"use client";

import { motion } from "framer-motion";

interface LoadingIndicatorProps {
  size?: "small" | "medium" | "large";
}

export function LoadingIndicator({ size = "medium" }: LoadingIndicatorProps) {
  const sizeClasses = {
    small: "h-4 w-4 border-b-1",
    medium: "h-6 w-6 border-b-2",
    large: "h-8 w-8 border-b-2",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex justify-center items-center py-4"
    >
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} border-primary`}
      ></div>
    </motion.div>
  );
}

export default LoadingIndicator;
