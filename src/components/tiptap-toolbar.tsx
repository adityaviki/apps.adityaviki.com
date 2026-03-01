"use client";

import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function TiptapToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const items = [
    {
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
    },
    {
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
    },
    {
      icon: Underline,
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive("underline"),
    },
    {
      icon: Strikethrough,
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive("strike"),
    },
    { separator: true },
    {
      icon: Heading1,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: Heading3,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive("heading", { level: 3 }),
    },
    { separator: true },
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
    },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
    },
    { separator: true },
    {
      icon: Undo,
      action: () => editor.chain().focus().undo().run(),
      isActive: false,
    },
    {
      icon: Redo,
      action: () => editor.chain().focus().redo().run(),
      isActive: false,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-0.5 bg-muted/30 px-2 py-1.5">
      {items.map((item, i) =>
        "separator" in item ? (
          <div key={i} className="mx-1.5 h-5 w-px bg-border" />
        ) : (
          <Button
            key={i}
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-lg transition-colors ${
              item.isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={item.action}
            type="button"
          >
            <item.icon className="h-4 w-4" />
          </Button>
        )
      )}
    </div>
  );
}
