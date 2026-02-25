import React from "react";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-primary)",
        zIndex: 2000,
      }}
    >
      <motion.div
        animate={{
          rotate: 360,
          borderRadius: ["20%", "20%", "50%", "50%", "20%"],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        style={{
          width: 60,
          height: 60,
          border: "4px solid var(--primary)",
          borderTopColor: "transparent",
        }}
      />
    </div>
  );
};

export default Loader;
