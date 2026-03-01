"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { format, getMonth, getYear } from "date-fns";
import { getDatesWithContent } from "@/app/actions/daily-notes";

export function DailyCalendar({ selectedDate }: { selectedDate: string }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [datesWithContent, setDatesWithContent] = useState<string[]>([]);
  const [month, setMonth] = useState(new Date(selectedDate + "T12:00:00"));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    getDatesWithContent(getYear(month), getMonth(month)).then(
      setDatesWithContent
    );
  }, [month]);

  const modifiers = {
    hasContent: datesWithContent.map((d) => new Date(d + "T12:00:00")),
  };

  const modifiersStyles = {
    hasContent: {
      position: "relative" as const,
    },
  };

  if (!mounted) {
    return <div className="h-[300px] w-[280px]" />;
  }

  return (
    <div>
      <Calendar
        mode="single"
        selected={new Date(selectedDate + "T12:00:00")}
        onSelect={(date) => {
          if (date) {
            router.push(`/daily-notes/${format(date, "yyyy-MM-dd")}`);
          }
        }}
        onMonthChange={setMonth}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        modifiersClassNames={{
          hasContent: "daily-has-content",
        }}
      />
      <style jsx global>{`
        .daily-has-content::after {
          content: "";
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: var(--primary);
        }
      `}</style>
    </div>
  );
}
