import { Clock3 } from "lucide-react";
import { Input } from "@/components/ui/text-input";
import { openingHourDays, parseOpeningHours } from "../../opening-hours";

function StoreOpeningHoursSection({ openingHours }: { openingHours: unknown }) {
  const hours = parseOpeningHours(openingHours);

  return (
    <section className="border-line rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex items-start gap-3">
        <span className="text-brand grid size-10 shrink-0 place-items-center rounded-xl bg-orange-50">
          <Clock3 size={19} />
        </span>
        <div>
          <h2 className="display-font text-xl font-black">Jam operasional</h2>
          <p className="text-muted mt-1 text-xs">
            Atur waktu buka setiap hari. Kosongkan jam untuk menandai hari yang belum diatur.
          </p>
        </div>
      </div>

      <div className="grid gap-2">
        {openingHourDays.map(({ key, label }) => {
          const schedule = hours[key];

          return (
            <div
              key={key}
              className="border-line grid grid-cols-[4.25rem_minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-2 rounded-xl border p-2"
            >
              <span className="text-xs font-bold">{label}</span>
              <Input
                type="time"
                name={`openingHours_${key}_open`}
                defaultValue={schedule && !schedule.closed ? schedule.open : ""}
                aria-label={`${label}: jam buka`}
                className="h-10 min-w-0 px-2 text-xs"
              />
              <Input
                type="time"
                name={`openingHours_${key}_close`}
                defaultValue={schedule && !schedule.closed ? schedule.close : ""}
                aria-label={`${label}: jam tutup`}
                className="h-10 min-w-0 px-2 text-xs"
              />
              <label className="flex items-center gap-1 text-[11px] font-semibold text-[#605b54]">
                <Input
                  type="checkbox"
                  name={`openingHours_${key}_closed`}
                  defaultChecked={schedule?.closed === true}
                  className="accent-brand size-4"
                />
                Tutup
              </label>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default StoreOpeningHoursSection;
