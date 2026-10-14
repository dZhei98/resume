"use client";

import { useHydrated } from "@/hooks/useHydrated";
import { motion } from "framer-motion";
import React, { useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface Spark {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  size: number;
  duration: number;
  delay: number;
}

const generateParticles = (): Particle[] =>
  // Generate slow floating particles
  Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.3 + 0.1,
  }));

const generateSparks = (): Spark[] =>
  // Generate fast-moving sparks
  Array.from({ length: 25 }, (_, i) => ({
    id: i,
    startX: Math.random() * 100,
    startY: Math.random() * 100,
    endX: Math.random() * 100,
    endY: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 3 + 2, // 2-5 seconds (fast!)
    delay: Math.random() * 8,
  }));

const AnimatedBackground: React.FC = () => {
  const hydrated = useHydrated();
  const [particles] = useState(generateParticles);
  const [sparks] = useState(generateSparks);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[#141414]" />

      {/* Stationary gradient orbs */}
      <div
        className="absolute -top-[10%] -left-[5%] w-[70%] h-[70%] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(229, 9, 20, 0.35) 0%, transparent 60%)",
          filter: "blur(100px)",
        }}
      />

      <div
        className="absolute -bottom-[15%] -right-[10%] w-[65%] h-[65%] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(229, 9, 20, 0.3) 0%, transparent 60%)",
          filter: "blur(120px)",
        }}
      />

      <div
        className="absolute top-[40%] left-[50%] w-[50%] h-[50%] rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          background: "radial-gradient(circle, rgba(255, 80, 80, 0.2) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
      />

      {/* Floating particles */}
      {hydrated && particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-red-500/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.sin(particle.id) * 20, 0],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Fast-moving sparks */}
      {hydrated && sparks.map((spark) => (
        <motion.div
          key={`spark-${spark.id}`}
          className="absolute rounded-full"
          style={{
            width: spark.size,
            height: spark.size,
            background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(229,9,20,0.6) 50%, transparent 100%)",
            boxShadow: "0 0 4px rgba(229,9,20,0.5), 0 0 8px rgba(255,255,255,0.3)",
          }}
          initial={{
            left: `${spark.startX}%`,
            top: `${spark.startY}%`,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            left: [`${spark.startX}%`, `${spark.endX}%`],
            top: [`${spark.startY}%`, `${spark.endY}%`],
            opacity: [0, 0.9, 0.9, 0],
            scale: [0, 1, 1, 0],
          }}
          transition={{
            duration: spark.duration,
            repeat: Infinity,
            delay: spark.delay,
            ease: "linear",
          }}
        />
      ))}

      {/* Shooting stars */}
      <motion.div
        className="absolute w-[2px] h-[2px] bg-white rounded-full"
        style={{
          boxShadow: "0 0 6px 2px rgba(255,255,255,0.6), -20px 0 15px rgba(255,255,255,0.3), -40px 0 10px rgba(255,255,255,0.1)",
        }}
        initial={{ left: "10%", top: "20%", opacity: 0 }}
        animate={{
          left: ["10%", "60%"],
          top: ["20%", "40%"],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 8,
          ease: "easeOut",
        }}
      />
      <motion.div
        className="absolute w-[2px] h-[2px] bg-white rounded-full"
        style={{
          boxShadow: "0 0 6px 2px rgba(255,255,255,0.6), -20px 0 15px rgba(255,255,255,0.3), -40px 0 10px rgba(255,255,255,0.1)",
        }}
        initial={{ left: "70%", top: "10%", opacity: 0 }}
        animate={{
          left: ["70%", "95%"],
          top: ["10%", "35%"],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          repeatDelay: 12,
          delay: 4,
          ease: "easeOut",
        }}
      />
      <motion.div
        className="absolute w-[1px] h-[1px] bg-white rounded-full"
        style={{
          boxShadow: "0 0 4px 1px rgba(255,255,255,0.5), -15px 0 10px rgba(255,255,255,0.2)",
        }}
        initial={{ left: "30%", top: "60%", opacity: 0 }}
        animate={{
          left: ["30%", "70%"],
          top: ["60%", "75%"],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatDelay: 15,
          delay: 7,
          ease: "easeOut",
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Vignette effect */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)",
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
