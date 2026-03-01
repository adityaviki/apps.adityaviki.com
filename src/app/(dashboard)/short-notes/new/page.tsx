"use client";

import { useActionState, useState } from "react";
import { createShortNote } from "@/app/actions/short-notes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/tag-input";
import Link from "next/link";

type Tag = { id: string; name: string };

export default function NewShortNotePage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [state, action, pending] = useActionState(
    async (_prev: { error?: string } | undefined, formData: FormData) => {
      return await createShortNote(formData);
    },
    undefined
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New Short Note</h1>
        <p className="text-sm text-muted-foreground">Capture a quick thought</p>
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
            <Input id="title" name="title" placeholder="Give it a name..." className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
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
            {pending ? "Creating..." : "Create Note"}
          </Button>
          <Button variant="outline" asChild className="rounded-xl">
            <Link href="/short-notes">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
