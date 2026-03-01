"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Folder, FolderOpen, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createFolder, deleteFolder } from "@/app/actions/folders";

type FolderWithCount = {
  id: string;
  name: string;
  _count: { longNotes: number };
};

export function FolderList({ folders }: { folders: FolderWithCount[] }) {
  const searchParams = useSearchParams();
  const activeFolderId = searchParams.get("folder");
  const [newFolderName, setNewFolderName] = useState("");
  const [open, setOpen] = useState(false);

  const handleCreate = async () => {
    if (!newFolderName.trim()) return;
    await createFolder(newFolderName.trim());
    setNewFolderName("");
    setOpen(false);
  };

  const linkClass = (isActive: boolean) =>
    `flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-all ${
      isActive
        ? "bg-blue-50 text-blue-700 font-medium shadow-sm"
        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
    }`;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between px-1 pb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Folders
        </h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>New Folder</DialogTitle>
            </DialogHeader>
            <div className="flex gap-2">
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                className="rounded-xl"
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
              <Button onClick={handleCreate} className="rounded-xl">Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Link href="/long-notes" className={linkClass(!activeFolderId)}>
        {!activeFolderId ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
        All Notes
      </Link>

      <Link href="/long-notes?folder=uncategorized" className={linkClass(activeFolderId === "uncategorized")}>
        {activeFolderId === "uncategorized" ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
        Uncategorized
      </Link>

      {folders.map((folder) => {
        const isActive = activeFolderId === folder.id;
        return (
          <div key={folder.id} className={`group ${linkClass(isActive)}`}>
            <Link
              href={`/long-notes?folder=${folder.id}`}
              className="flex flex-1 items-center gap-2.5 min-w-0"
            >
              {isActive ? <FolderOpen className="h-4 w-4 shrink-0" /> : <Folder className="h-4 w-4 shrink-0" />}
              <span className="truncate">{folder.name}</span>
              <span className="ml-auto text-[11px] rounded-full bg-muted px-1.5 py-0.5 tabular-nums">
                {folder._count.longNotes}
              </span>
            </Link>
            <form
              action={async () => {
                await deleteFolder(folder.id);
              }}
            >
              <button
                type="submit"
                className="hidden shrink-0 text-muted-foreground hover:text-destructive group-hover:block"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </form>
          </div>
        );
      })}
    </div>
  );
}
