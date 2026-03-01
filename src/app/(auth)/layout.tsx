import { Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-accent/40 px-4">
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
          <Sparkles className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Notes</h1>
      </div>
      {children}
    </div>
  );
}
