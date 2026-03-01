import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh">
      <AppSidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-5xl p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
