import { ChevronDown, Clock3 } from "lucide-react";
import {
  formatOpeningTime,
  openingHourDays,
  parseOpeningHours,
} from "@/features/stores/opening-hours";

function StorefrontOpeningHours({ openingHours }: { openingHours: unknown }) {
  const hours = parseOpeningHours(openingHours);
  const configured = Object.keys(hours).length > 0;

  return (
    <details className="group min-w-0 text-xs">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-lg py-1 text-left marker:hidden">
        <Clock3 size={14} className="shrink-0" aria-hidden="true" />
        <span className="font-semibold">Jam operasional</span>
        <span className="text-muted">{configured ? "Lihat jadwal" : "Belum diatur"}</span>
        <ChevronDown
          size={13}
          className="text-muted transition-transform duration-200 group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="border-line mt-1 grid min-w-56 gap-1 rounded-xl border bg-white p-3 text-[11px] shadow-sm sm:absolute sm:z-20">
        {openingHourDays.map(({ key, label }) => {
          const day = hours[key];
          const schedule = day?.closed
            ? "Tutup"
            : day
              ? `${formatOpeningTime(day.open)}–${formatOpeningTime(day.close)}`
              : "Belum diatur";

          return (
            <div key={key} className="flex items-center justify-between gap-6">
              <span className="font-semibold">{label}</span>
              <span className={day?.closed ? "text-muted" : "text-ink"}>{schedule}</span>
            </div>
          );
        })}
      </div>
    </details>
  );
}

export default StorefrontOpeningHours;
