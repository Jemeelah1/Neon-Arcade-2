import React, { useState } from "react";
import SnakeGame from "./components/SnakeGame";
import MusicPlayer from "./components/MusicPlayer";

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen w-full bg-dark-bg flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Background Grid Effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-neon-purple) 1px, transparent 1px), linear-gradient(90deg, var(--color-neon-purple) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          transform:
            "perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)",
        }}
      />

      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-6 text-center z-10">
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink drop-shadow-[0_0_15px_rgba(255,0,255,0.8)] uppercase">
          Neon Snake & Beats
        </h1>
        <p className="text-neon-blue font-mono text-sm mt-2 tracking-widest opacity-80">
          CYBERNETIC ENTERTAINMENT SYSTEM
        </p>
      </header>

      {/* Main Content */}
      <main className="flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-6xl px-6 z-10 mt-24">
        {/* Left/Top: Music Player */}
        <div className="w-full md:w-1/3 flex flex-col items-center justify-center order-2 md:order-1">
          <MusicPlayer />

          {/* Decorative Elements */}
          <div className="mt-12 hidden md:block">
            <div className="flex items-end gap-1 h-16 opacity-50">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 bg-neon-pink rounded-t-sm animate-pulse"
                  style={{
                    height: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 1}s`,
                    animationDuration: `${0.5 + Math.random() * 1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right/Center: Game */}
        <div className="w-full md:w-2/3 flex justify-center order-1 md:order-2">
          <SnakeGame onScoreUpdate={setScore} />
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-4 left-0 w-full text-center z-10">
        <p className="text-gray-500 font-mono text-xs tracking-widest">
          SYS.VER 1.0.0 // ONLINE
        </p>
      </footer>
    </div>
  );
}
