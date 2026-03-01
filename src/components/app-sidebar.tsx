"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  StickyNote,
  FileText,
  CalendarDays,
  LogOut,
  PanelLeft,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

const navItems = [
  {
    title: "Short Notes",
    href: "/short-notes",
    icon: StickyNote,
    color: "text-amber-500",
    activeBg: "bg-amber-50 dark:bg-amber-500/10",
    activeText: "text-amber-700 dark:text-amber-400",
  },
  {
    title: "Long Notes",
    href: "/long-notes",
    icon: FileText,
    color: "text-blue-500",
    activeBg: "bg-blue-50 dark:bg-blue-500/10",
    activeText: "text-blue-700 dark:text-blue-400",
  },
  {
    title: "Daily Notes",
    href: "/daily-notes",
    icon: CalendarDays,
    color: "text-emerald-500",
    activeBg: "bg-emerald-50 dark:bg-emerald-500/10",
    activeText: "text-emerald-700 dark:text-emerald-400",
  },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </div>
        <span className="text-lg font-semibold tracking-tight">Notes</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? cn(item.activeBg, item.activeText)
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-[18px] w-[18px]",
                  isActive ? "" : item.color
                )}
              />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="border-t p-3">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export function AppSidebar() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        <div className="sticky top-0 z-30 flex h-14 items-center border-b bg-background/80 px-4 backdrop-blur-sm md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                <PanelLeft className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[260px] p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarContent onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="ml-3 text-sm font-semibold">Notes</span>
        </div>
      </>
    );
  }

  return (
    <aside className="sticky top-0 hidden h-svh w-[240px] shrink-0 border-r bg-sidebar md:block">
      <SidebarContent />
    </aside>
  );
}
