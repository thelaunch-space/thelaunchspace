"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

const STATUSES = ["new", "contacted", "scheduled", "completed"] as const;

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: "bg-accent-blue/10 text-accent-blue",
    contacted: "bg-accent-amber/10 text-accent-amber",
    scheduled: "bg-accent-purple/10 text-accent-purple",
    completed: "bg-accent-emerald/10 text-accent-emerald",
  };
  return (
    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${colors[status] ?? "bg-surface-alt text-text-secondary"}`}>
      {status}
    </span>
  );
}

function formatSlot(date: string, time: string): string {
  const [year, month, day] = date.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  const [h] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${displayH}:00 ${period} IST`;
}

export default function MeetingsPanel() {
  const bookings = useQuery(api.pitchBookings.list);
  const updateStatus = useMutation(api.pitchBookings.updateStatus);

  if (bookings === undefined) {
    return (
      <div className="space-y-2 animate-pulse p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 bg-surface-alt rounded" />
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <p className="text-xs text-text-secondary italic text-center py-8">
        No meeting bookings yet
      </p>
    );
  }

  const handleStatusChange = (id: Id<"pitchBookings">, status: string) => {
    updateStatus({ id, status });
  };

  // Mobile cards
  const MobileCards = () => (
    <div className="md:hidden space-y-3 p-3">
      {bookings.map((b) => (
        <div key={b._id} className="rounded-xl border border-border-color/30 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-primary">{b.companyName}</span>
            <StatusBadge status={b.status} />
          </div>
          <div className="space-y-1 text-[11px] text-text-secondary">
            <p>{b.email}</p>
            {b.whatsappNumber && (
              <p>{b.whatsappCountryCode} {b.whatsappNumber} {b.whatsappConsent ? "" : "(no consent)"}</p>
            )}
            <a href={b.websiteUrl.startsWith("http") ? b.websiteUrl : `https://${b.websiteUrl}`} target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline block truncate">
              {b.websiteUrl}
            </a>
            {b.contentChallenge && <p className="italic">{b.contentChallenge}</p>}
            <p className="font-mono">
              {formatSlot(b.selectedDate, b.selectedTimeIST)}
              {b.isCustomTime && " (custom)"}
            </p>
            <p className="text-text-secondary/60">{new Date(b.createdAt).toLocaleDateString()}</p>
          </div>
          <select
            value={b.status}
            onChange={(e) => handleStatusChange(b._id, e.target.value)}
            className="w-full text-[11px] px-2 py-1.5 rounded-lg border border-border-color/40 bg-surface text-text-primary"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-[10px] font-mono text-text-secondary">
          {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Mobile cards */}
      <MobileCards />

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto scrollbar-hide">
        <table className="w-full text-xs min-w-[900px]">
          <thead>
            <tr className="border-b border-border-color/30 bg-surface-alt/50">
              <th className="text-left px-3 py-2.5 font-medium text-text-secondary">Company</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-secondary">Email</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-secondary">WhatsApp</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-secondary">Website</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-secondary">Challenge</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-secondary">Slot</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-secondary">Submitted</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-secondary">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="border-b border-border-color/10 hover:bg-surface-alt/30 transition-colors">
                <td className="px-3 py-2.5 font-medium text-text-primary whitespace-nowrap">{b.companyName}</td>
                <td className="px-3 py-2.5 text-text-secondary">{b.email}</td>
                <td className="px-3 py-2.5 text-text-secondary whitespace-nowrap">
                  {b.whatsappNumber ? (
                    <span>
                      {b.whatsappCountryCode} {b.whatsappNumber}
                      {!b.whatsappConsent && <span className="text-accent-amber ml-1">(no consent)</span>}
                    </span>
                  ) : (
                    <span className="text-text-secondary/40">—</span>
                  )}
                </td>
                <td className="px-3 py-2.5 max-w-[150px]">
                  <a
                    href={b.websiteUrl.startsWith("http") ? b.websiteUrl : `https://${b.websiteUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-blue hover:underline truncate block"
                  >
                    {b.websiteUrl}
                  </a>
                </td>
                <td className="px-3 py-2.5 text-text-secondary whitespace-nowrap">
                  {b.contentChallenge || <span className="text-text-secondary/40">—</span>}
                </td>
                <td className="px-3 py-2.5 text-text-secondary whitespace-nowrap font-mono">
                  {formatSlot(b.selectedDate, b.selectedTimeIST)}
                  {b.isCustomTime && <span className="ml-1 text-accent-purple text-[10px]">custom</span>}
                </td>
                <td className="px-3 py-2.5 text-text-secondary font-mono whitespace-nowrap">
                  {new Date(b.createdAt).toLocaleDateString()}
                </td>
                <td className="px-3 py-2.5">
                  <select
                    value={b.status}
                    onChange={(e) => handleStatusChange(b._id, e.target.value)}
                    className="text-[11px] px-2 py-1 rounded-lg border border-border-color/40 bg-surface text-text-primary"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
