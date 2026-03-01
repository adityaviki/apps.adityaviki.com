"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteShortNote } from "@/app/actions/short-notes";

type Tag = { id: string; name: string };

function hashColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 6;
}

export function NoteCard({
  note,
}: {
  note: {
    id: string;
    title: string | null;
    content: string;
    updatedAt: Date;
    tags: Tag[];
  };
}) {
  return (
    <div className="group relative rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/short-notes/${note.id}`} className="flex-1 min-w-0">
          <h3 className="font-medium text-[15px] truncate">
            {note.title || "Untitled"}
          </h3>
        </Link>
        <form
          action={async () => {
            await deleteShortNote(note.id);
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
            type="submit"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </form>
      </div>
      <Link href={`/short-notes/${note.id}`}>
        <p className="mt-1.5 line-clamp-3 text-sm text-muted-foreground leading-relaxed">
          {note.content}
        </p>
      </Link>
      {note.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {note.tags.map((tag) => (
            <span
              key={tag.id}
              className={`tag-color-${hashColor(tag.name)} inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium`}
              style={{
                backgroundColor: `var(--tag-bg)`,
                color: `var(--tag-fg)`,
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
