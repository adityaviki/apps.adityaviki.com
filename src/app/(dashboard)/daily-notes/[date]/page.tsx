"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { format, parse, isToday } from "date-fns";
import { DailyCalendar } from "@/components/daily-calendar";
import { TiptapEditor } from "@/components/tiptap-editor";
import {
  upsertDailyNote,
  updateDailyNoteContent,
} from "@/app/actions/daily-notes";

export default function DailyNoteDatePage() {
  const params = useParams<{ date: string }>();
  const [content, setContent] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    upsertDailyNote(params.date).then((note) => {
      setContent(note.content);
    });
  }, [params.date]);

  const handleSave = useCallback(
    async (html: string) => {
      setSaving(true);
      await updateDailyNoteContent(params.date, html);
      setSaving(false);
    },
    [params.date]
  );

  const parsedDate = parse(params.date, "yyyy-MM-dd", new Date());
  const isTodayDate = isToday(parsedDate);
  const displayDate = format(parsedDate, "EEEE, MMMM d, yyyy");

  return (
    <div className="flex gap-8">
      <aside className="hidden shrink-0 md:block">
        <DailyCalendar selectedDate={params.date} />
      </aside>

      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{displayDate}</h1>
              {isTodayDate && (
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                  Today
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Daily journal entry</p>
          </div>
          {saving && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Saving...
            </span>
          )}
        </div>

        {content === null ? (
          <div className="flex items-center justify-center rounded-2xl border border-dashed py-20">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <TiptapEditor
            key={params.date}
            content={content}
            onSave={handleSave}
            placeholder="Write about your day..."
          />
        )}
      </div>
    </div>
  );
}
