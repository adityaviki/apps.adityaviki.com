import { redirect } from "next/navigation";
import { format } from "date-fns";

export default function DailyNotesPage() {
  redirect(`/daily-notes/${format(new Date(), "yyyy-MM-dd")}`);
}
