import Link from "next/link";
import { Plus, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FolderList } from "@/components/folder-list";
import { getLongNotes, deleteLongNote } from "@/app/actions/long-notes";
import { getFolders } from "@/app/actions/folders";
import { format } from "date-fns";

export default async function LongNotesPage({
  searchParams,
}: {
  searchParams: Promise<{ folder?: string }>;
}) {
  const { folder } = await searchParams;
  const [notes, folders] = await Promise.all([
    getLongNotes(folder),
    getFolders(),
  ]);

  return (
    <div className="flex gap-8">
      <aside className="hidden w-52 shrink-0 md:block">
        <FolderList folders={folders} />
      </aside>

      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Long Notes</h1>
          <Button asChild size="sm" className="rounded-xl">
            <Link href="/long-notes/new">
              <Plus className="mr-1.5 h-4 w-4" />
              New Note
            </Link>
          </Button>
        </div>

        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-400 mb-3">
              <FileText className="h-6 w-6" />
            </div>
            <p className="font-medium text-foreground">No long notes yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Create your first long note to start writing.</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {notes.map((note: { id: string; title: string; updatedAt: Date; folder: { name: string } | null }) => (
              <div
                key={note.id}
                className="group flex items-center justify-between rounded-xl border bg-card px-4 py-3 transition-colors hover:bg-muted/50"
              >
                <Link
                  href={`/long-notes/${note.id}`}
                  className="flex-1 space-y-0.5 min-w-0"
                >
                  <h3 className="font-medium text-[15px] truncate">{note.title}</h3>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    {note.folder && (
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-blue-600 font-medium dark:bg-blue-500/10 dark:text-blue-400">
                        {note.folder.name}
                      </span>
                    )}
                    <span>{format(note.updatedAt, "MMM d, yyyy")}</span>
                  </div>
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await deleteLongNote(note.id);
                  }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                    type="submit"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
