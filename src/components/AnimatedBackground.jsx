import React from "react";
import { motion } from "framer-motion";

const AnimatedBackground = () => {
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: -1, overflow: "hidden" }}
    >
      {/* Gradient Orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          position: "absolute",
          top: "10%",
          right: "10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <motion.div
        animate={{
          x: [0, -150, 0],
          y: [0, 150, 0],
          rotate: [0, -360],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          position: "absolute",
          bottom: "20%",
          left: "5%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(236, 72, 153, 0.12), transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
          style={{
            position: "absolute",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.4)",
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
