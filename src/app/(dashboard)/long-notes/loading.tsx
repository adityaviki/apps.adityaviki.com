import { Skeleton } from "@/components/ui/skeleton";

export default function LongNotesLoading() {
  return (
    <div className="flex gap-8">
      <aside className="hidden w-52 shrink-0 md:block space-y-2">
        <Skeleton className="h-5 w-16 mb-3" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-full rounded-xl" />
        ))}
      </aside>
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
