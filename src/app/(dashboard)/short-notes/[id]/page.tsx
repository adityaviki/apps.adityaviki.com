"use client";

import { useActionState, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getShortNote, updateShortNote } from "@/app/actions/short-notes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/tag-input";
import Link from "next/link";

type Tag = { id: string; name: string };

export default function EditShortNotePage() {
  const params = useParams<{ id: string }>();
  const [tags, setTags] = useState<Tag[]>([]);
  const [note, setNote] = useState<{
    title: string | null;
    content: string;
    tags: Tag[];
  } | null>(null);

  useEffect(() => {
    getShortNote(params.id).then((n) => {
      if (n) {
        setNote(n);
        setTags(n.tags);
      }
    });
  }, [params.id]);

  const [state, action, pending] = useActionState(
    async (_prev: { error?: string } | undefined, formData: FormData) => {
      return await updateShortNote(params.id, formData);
    },
    undefined
  );

  if (!note) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Short Note</h1>
        <p className="text-sm text-muted-foreground">Update your note</p>
      </div>
      <form action={action} className="space-y-5">
        {state?.error && (
          <div className="rounded-xl bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
            {state.error}
          </div>
        )}
        <div className="rounded-2xl border bg-card p-5 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title (optional)</Label>
            <Input
              id="title"
              name="title"
              defaultValue={note.title ?? ""}
              placeholder="Give it a name..."
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              defaultValue={note.content}
              placeholder="What's on your mind?"
              rows={6}
              required
              className="rounded-xl resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label>Tags</Label>
            <TagInput selectedTags={tags} onChange={setTags} />
          </div>
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={pending} className="rounded-xl">
            {pending ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant="outline" asChild className="rounded-xl">
            <Link href="/short-notes">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
