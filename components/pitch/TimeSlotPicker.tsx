"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TimeSlotPickerProps {
  onSelect: (date: string, timeIST: string, isCustom: boolean) => void;
  onBack: () => void;
}

const PRESET_SLOTS = ["11:00", "12:00", "15:00", "16:00", "21:00", "22:00"];

function getNext7Days(): { iso: string; label: string; dayName: string }[] {
  const days: { iso: string; label: string; dayName: string }[] = [];
  const now = new Date();
  for (let i = 1; i <= 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().split("T")[0];
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    days.push({ iso, label, dayName });
  }
  return days;
}

/** Convert IST hour:minute to user's local time string */
function istToLocal(dateISO: string, timeIST: string): { time: string; dateDiffers: boolean; localDate: string } {
  const [h, m] = timeIST.split(":").map(Number);
  // IST is UTC+5:30
  const utcH = h - 5;
  const utcM = m - 30;
  const [year, month, day] = dateISO.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day, utcH, utcM));

  const localTime = utc.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const localDateStr = utc.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const dateDiffers = utc.toISOString().split("T")[0] !== dateISO;

  return { time: localTime, dateDiffers, localDate: localDateStr };
}

function formatISTTime(time: string): string {
  const [h] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${displayH}:00 ${period}`;
}

export default function TimeSlotPicker({ onSelect, onBack }: TimeSlotPickerProps) {
  const days = useMemo(() => getNext7Days(), []);
  const [selectedDate, setSelectedDate] = useState(days[0].iso);
  const [showCustom, setShowCustom] = useState(false);
  const [customHour, setCustomHour] = useState("10");

  const userTimezone = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, " ");
    } catch {
      return "your local time";
    }
  }, []);

  const handlePresetSelect = (time: string) => {
    onSelect(selectedDate, time, false);
  };

  const handleCustomSelect = () => {
    onSelect(selectedDate, `${customHour.padStart(2, "0")}:00`, true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="text-xs text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to details
      </button>

      {/* Date pills */}
      <div>
        <p className="text-sm font-medium text-text-secondary mb-2.5">Pick a day</p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
          {days.map((day) => (
            <button
              key={day.iso}
              onClick={() => setSelectedDate(day.iso)}
              className={`flex flex-col items-center px-3.5 py-2 rounded-xl border transition-all shrink-0 ${
                selectedDate === day.iso
                  ? "border-accent-blue bg-accent-blue/5 text-accent-blue shadow-sm"
                  : "border-border-color/40 text-text-secondary hover:border-accent-blue/30 hover:text-text-primary"
              }`}
            >
              <span className="text-[10px] font-mono uppercase tracking-wider">{day.dayName}</span>
              <span className="text-sm font-semibold mt-0.5">{day.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Time slots */}
      <div>
        <p className="text-sm font-medium text-text-secondary mb-1">Pick a time</p>
        <p className="text-[11px] text-text-secondary/70 mb-3">
          IST times shown with {userTimezone} equivalent
        </p>

        <div className="grid grid-cols-2 gap-2">
          {PRESET_SLOTS.map((slot) => {
            const local = istToLocal(selectedDate, slot);
            return (
              <button
                key={slot}
                onClick={() => handlePresetSelect(slot)}
                className="group flex flex-col items-center p-3 rounded-xl border border-border-color/40 hover:border-accent-blue hover:bg-accent-blue/5 transition-all text-left"
              >
                <span className="text-sm font-semibold text-text-primary group-hover:text-accent-blue transition-colors">
                  {formatISTTime(slot)} IST
                </span>
                <span className="text-[11px] text-text-secondary mt-0.5">
                  {local.time}{local.dateDiffers ? ` (${local.localDate})` : ""}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom time */}
      <div>
        {!showCustom ? (
          <button
            onClick={() => setShowCustom(true)}
            className="text-xs text-accent-blue hover:text-accent-purple transition-colors"
          >
            None of these work?
          </button>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-2.5"
            >
              <p className="text-xs text-text-secondary">Pick any hour (IST):</p>
              <div className="flex items-center gap-2">
                <select
                  value={customHour}
                  onChange={(e) => setCustomHour(e.target.value)}
                  className="flex-1 p-2.5 bg-surface border border-border-color/40 rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 transition-all"
                >
                  {Array.from({ length: 24 }, (_, i) => {
                    const val = String(i);
                    const local = istToLocal(selectedDate, `${val.padStart(2, "0")}:00`);
                    const period = i >= 12 ? "PM" : "AM";
                    const displayH = i > 12 ? i - 12 : i === 0 ? 12 : i;
                    return (
                      <option key={i} value={val}>
                        {displayH}:00 {period} IST — {local.time}
                      </option>
                    );
                  })}
                </select>
                <button
                  onClick={handleCustomSelect}
                  className="shrink-0 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-5 py-2.5 text-sm font-semibold text-white shadow-cta hover:-translate-y-0.5 hover:shadow-cta-hover transition-all duration-300"
                >
                  Book It
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
