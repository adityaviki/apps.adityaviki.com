"use client";

import { useActionState, useEffect, useState } from "react";
import { createLongNote } from "@/app/actions/long-notes";
import { getFolders } from "@/app/actions/folders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

type Folder = { id: string; name: string };

export default function NewLongNotePage() {
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    getFolders().then(setFolders);
  }, []);

  const [state, action, pending] = useActionState(
    async (_prev: { error?: string } | undefined, formData: FormData) => {
      return await createLongNote(formData);
    },
    undefined
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New Long Note</h1>
        <p className="text-sm text-muted-foreground">Start writing something great</p>
      </div>
      <form action={action} className="space-y-5">
        {state?.error && (
          <div className="rounded-xl bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
            {state.error}
          </div>
        )}
        <div className="rounded-2xl border bg-card p-5 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="What are you writing about?" required className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="folderId">Folder (optional)</Label>
            <Select name="folderId">
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="No folder" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {folders.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={pending} className="rounded-xl">
            {pending ? "Creating..." : "Create Note"}
          </Button>
          <Button variant="outline" asChild className="rounded-xl">
            <Link href="/long-notes">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
