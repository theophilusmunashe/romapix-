"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out after 2 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    // Complete after fade animation (2.5 seconds total)
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#3B82F6] transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="animate-in fade-in zoom-in duration-700">
        <div className="relative h-40 w-40 overflow-hidden rounded-full bg-white shadow-2xl">
          <Image
            src="/romapix-logo.jpg"
            alt="Romapix Construction Logo"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
      <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Romapix Construction
        </h1>
        <p className="mt-2 text-center text-white/80">
          Client Management System
        </p>
      </div>
      <div className="mt-12 animate-in fade-in duration-1000 delay-500">
        <div className="h-1 w-32 overflow-hidden rounded-full bg-white/30">
          <div className="h-full animate-pulse rounded-full bg-white" style={{ width: "60%" }} />
        </div>
      </div>
    </div>
  );
}
