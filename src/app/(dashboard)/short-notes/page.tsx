import Link from "next/link";
import { Plus, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoteCard } from "@/components/note-card";
import { getShortNotes } from "@/app/actions/short-notes";
import { getTags } from "@/app/actions/tags";

export default async function ShortNotesPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const [notes, tags] = await Promise.all([
    getShortNotes(tag),
    getTags(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Short Notes</h1>
        <Button asChild size="sm" className="rounded-xl">
          <Link href="/short-notes/new">
            <Plus className="mr-1.5 h-4 w-4" />
            New Note
          </Link>
        </Button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <Link href="/short-notes">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                !tag
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              All
            </span>
          </Link>
          {tags.map((t: { id: string; name: string }) => (
            <Link key={t.id} href={`/short-notes?tag=${encodeURIComponent(t.name)}`}>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  tag === t.name
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {t.name}
              </span>
            </Link>
          ))}
        </div>
      )}

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-400 mb-3">
            <StickyNote className="h-6 w-6" />
          </div>
          <p className="font-medium text-foreground">
            {tag ? `No notes tagged "${tag}"` : "No short notes yet"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {tag ? "Try a different tag or create a new note." : "Create your first short note to get started!"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note: { id: string; title: string | null; content: string; updatedAt: Date; tags: { id: string; name: string }[] }) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
