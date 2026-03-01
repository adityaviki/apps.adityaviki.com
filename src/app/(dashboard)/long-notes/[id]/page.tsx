"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getLongNote, updateLongNoteContent, updateLongNote, deleteLongNote } from "@/app/actions/long-notes";
import { getFolders } from "@/app/actions/folders";
import { TiptapEditor } from "@/components/tiptap-editor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";

type Folder = { id: string; name: string };

export default function EditLongNotePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [note, setNote] = useState<{
    title: string;
    content: string;
    folderId: string | null;
  } | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([getLongNote(params.id), getFolders()]).then(([n, f]) => {
      if (n) setNote({ title: n.title, content: n.content, folderId: n.folderId });
      setFolders(f);
    });
  }, [params.id]);

  const handleContentSave = useCallback(
    async (html: string) => {
      setSaving(true);
      await updateLongNoteContent(params.id, html);
      setSaving(false);
    },
    [params.id]
  );

  const handleMetaUpdate = async (formData: FormData) => {
    await updateLongNote(params.id, formData);
  };

  const handleDelete = async () => {
    await deleteLongNote(params.id);
    router.push("/long-notes");
  };

  if (!note) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form action={handleMetaUpdate} className="flex flex-1 items-center gap-2">
          <Input
            name="title"
            defaultValue={note.title}
            className="text-lg font-semibold rounded-xl border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:bg-muted/50 focus-visible:px-3 transition-all"
          />
          <Select name="folderId" defaultValue={note.folderId ?? ""}>
            <SelectTrigger className="w-[160px] rounded-xl">
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
          <Button type="submit" variant="outline" size="sm" className="rounded-xl">
            Save
          </Button>
        </form>
        <div className="flex items-center gap-2">
          {saving && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Saving...
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl text-muted-foreground hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <TiptapEditor content={note.content} onSave={handleContentSave} />
    </div>
  );
}
