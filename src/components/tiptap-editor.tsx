"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExtension from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef, useCallback } from "react";
import { TiptapToolbar } from "./tiptap-toolbar";

export function TiptapEditor({
  content,
  onSave,
  placeholder = "Start writing...",
}: {
  content: string;
  onSave: (html: string) => void;
  placeholder?: string;
}) {
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const debouncedSave = useCallback(
    (html: string) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        onSave(html);
      }, 1500);
    },
    [onSave]
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
      Placeholder.configure({ placeholder }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      debouncedSave(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert max-w-none min-h-[350px] p-5 outline-none prose-headings:tracking-tight",
      },
    },
  });

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <TiptapToolbar editor={editor} />
      <div className="border-t">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
