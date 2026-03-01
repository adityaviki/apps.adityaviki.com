import { Skeleton } from "@/components/ui/skeleton";

export default function DailyNotesLoading() {
  return (
    <div className="flex gap-8">
      <aside className="hidden shrink-0 md:block">
        <Skeleton className="h-[300px] w-[280px] rounded-2xl" />
      </aside>
      <div className="flex-1 space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-1.5 h-4 w-36" />
        </div>
        <Skeleton className="h-10 w-full rounded-2xl" />
        <Skeleton className="h-[350px] w-full rounded-2xl" />
      </div>
    </div>
  );
}
