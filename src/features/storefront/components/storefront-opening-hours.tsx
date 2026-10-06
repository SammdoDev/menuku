"use client";

import { useEffect, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Clock3, X } from "lucide-react";
import { getContrastTextColor } from "../helpers";
import {
  formatStorefrontMessage,
  useStorefrontLocale,
} from "../storefront-locale";
import {
  formatOpeningTime,
  openingHourDays,
  parseOpeningHours,
} from "@/features/stores/opening-hours";

export default function StorefrontOpeningHours({
  openingHours,
  storeName,
  primaryColor,
  backgroundColor,
  open,
  onClose,
}: {
  openingHours: unknown;
  storeName: string;
  primaryColor: string;
  backgroundColor: string;
  open: boolean;
  onClose: () => void;
}) {
  const { messages } = useStorefrontLocale();
  const hours = parseOpeningHours(openingHours);
  const configured = Object.keys(hours).length > 0;
  const todayKey = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
  })
    .format(new Date())
    .toLocaleLowerCase("en-US");
  const todayIndex = openingHourDays.findIndex(({ key }) => key === todayKey);
  const today = openingHourDays[todayIndex];
  const todayHours = today ? hours[today.key] : undefined;

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  const sheetStyle = {
    "--color-brand": primaryColor,
    backgroundColor: `color-mix(in srgb, ${backgroundColor} 22%, white)`,
  } as CSSProperties;
  const accentStyle = {
    color: getContrastTextColor(primaryColor),
    backgroundColor: primaryColor,
  } as CSSProperties;
  const sheet = (
    <AnimatePresence>
      {open && (
        <motion.section
          data-storefront-nav-panel
          className="text-ink fixed inset-x-0 bottom-[calc(4.3125rem+env(safe-area-inset-bottom))] z-[90] mx-auto h-fit max-h-[min(72dvh,38rem)] min-h-[min(40dvh,24rem)] w-full max-w-md overflow-y-auto overscroll-contain rounded-3xl rounded-b-none shadow-[0_16px_70px_rgba(25,22,18,.24)] sm:inset-x-auto sm:bottom-[5.75rem] sm:left-1/2 sm:w-[calc(100vw_-_2rem)] sm:-translate-x-1/2 sm:rounded-b-none sm:shadow-2xl"
          style={sheetStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          role="dialog"
          aria-labelledby="storefront-hours-title"
        >
          <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-black/15" />
          <header className="flex items-center gap-3 px-5 pt-4 pb-4">
            <span
              className="grid size-11 shrink-0 place-items-center rounded-2xl"
              style={accentStyle}
            >
              <Clock3 size={20} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="storefront-hours-title" className="display-font truncate text-lg font-black">
                {messages.hours.title}
              </h2>
              <p className="text-muted truncate text-xs">{storeName}</p>
            </div>
            <button
              type="button"
              className="focus-visible:outline-brand grid size-10 shrink-0 place-items-center rounded-full bg-white/75 text-[#5b554d] transition hover:bg-white hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2"
              onClick={onClose}
              aria-label={messages.hours.close}
            >
              <X size={18} />
            </button>
          </header>

          <div className="px-5 pb-4">
            {today && (
              <div
                className="mb-3 flex items-center justify-between gap-3 rounded-2xl border px-4 py-3"
                style={{
                  borderColor: `color-mix(in srgb, ${primaryColor} 25%, transparent)`,
                  backgroundColor: `color-mix(in srgb, ${primaryColor} 9%, white)`,
                }}
              >
                <span className="text-sm font-extrabold">
                  {formatStorefrontMessage(messages.hours.today, {
                    day: messages.hours.days[today.key],
                  })}
                </span>
                <span className="text-brand text-xs font-bold">
                  {todayHours?.closed
                    ? messages.hours.closed
                    : todayHours
                      ? `${formatOpeningTime(todayHours.open)}–${formatOpeningTime(todayHours.close)}`
                      : messages.hours.unset}
                </span>
              </div>
            )}

            {configured ? (
              <div className="grid gap-1 rounded-2xl border border-black/5 bg-white/70 p-2">
                {openingHourDays.map(({ key }, index) => {
                  const day = hours[key];
                  const isToday = index === todayIndex;
                  const schedule = day?.closed
                    ? messages.hours.closed
                    : day
                      ? `${formatOpeningTime(day.open)}–${formatOpeningTime(day.close)}`
                      : messages.hours.unset;

                  return (
                    <div
                      key={key}
                      className={`flex min-h-10 items-center justify-between gap-4 rounded-xl px-3 text-xs ${isToday ? "bg-brand/8" : ""}`}
                      aria-current={isToday ? "date" : undefined}
                    >
                      <span
                        className={`font-semibold ${isToday ? "text-brand" : "text-[#565149]"}`}
                      >
                        {messages.hours.days[key]}
                      </span>
                      <span className={day?.closed ? "text-muted" : "text-ink font-bold"}>
                        {schedule}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed border-black/15 bg-white/60 px-4 py-6 text-center text-sm text-[#625d54]">
                {messages.hours.empty}
              </p>
            )}
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );

  return typeof document === "undefined" ? null : createPortal(sheet, document.body);
}
