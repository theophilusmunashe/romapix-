"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, User } from "lucide-react";

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-card shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white shadow">
            <Image
              src="/romapix-logo.jpg"
              alt="Romapix Logo"
              fill
              className="object-cover"
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-foreground">Romapix Construction</h1>
            <p className="text-xs text-muted-foreground">Client Management</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{user}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
