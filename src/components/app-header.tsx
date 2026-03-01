"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { StickyNote, FileText, CalendarDays, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Short Notes",
    href: "/short-notes",
    icon: StickyNote,
    color: "text-amber-500",
    activeColor: "text-amber-600 border-amber-500",
  },
  {
    title: "Long Notes",
    href: "/long-notes",
    icon: FileText,
    color: "text-blue-500",
    activeColor: "text-blue-600 border-blue-500",
  },
  {
    title: "Daily Notes",
    href: "/daily-notes",
    icon: CalendarDays,
    color: "text-emerald-500",
    activeColor: "text-emerald-600 border-emerald-500",
  },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-8">
        <div className="flex items-center">
          <nav className="flex items-center">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 border-b-2 px-3 py-4 text-sm font-medium transition-colors",
                    isActive
                      ? item.activeColor
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", isActive ? "" : item.color)} />
                  <span className="hidden sm:inline">{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
