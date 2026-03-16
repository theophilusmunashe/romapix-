"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SplashScreen } from "@/components/splash-screen";
import { LoginForm } from "@/components/login-form";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return null;
  }

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return <LoginForm />;
}
