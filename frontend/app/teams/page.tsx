"use client";

import { useEffect, useState } from "react";
import { useAuthGuard } from "../hooks/useAuthGuard";

type Complaint = {
  id: number;
  assigned_team: string | null;
};

const API_BASE = "http://localhost:8000"; // we’ll make this env-based later when deploying

const TEAMS = [
  "Billing / Refunds Team",
  "Payments Team",
  "Logistics Team",
  "Technical Support Team",
  "Quality & Returns Team",
  "Customer Support QA Team",
  "General Support Team",
];

export default function TeamsPage() {
  useAuthGuard();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/complaints`)
      .then((res) => res.json())
      .then((data) => {
        setComplaints(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching complaints:", err);
        setLoading(false);
      });
  }, []);

  const counts: Record<string, number> = {};
  TEAMS.forEach((team) => {
    counts[team] = complaints.filter(
      (c) => (c.assigned_team || "General Support Team") === team
    ).length;
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-6 space-y-4">
      <h1 className="text-3xl font-bold">Teams Overview</h1>
      <p className="text-slate-400 text-sm">
        Each team can see how many complaints are currently assigned to them.
      </p>

      {loading ? (
        <p>Loading team data...</p>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TEAMS.map((team) => (
            <a
              key={team}
              href={`/teams/${encodeURIComponent(team)}`}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-emerald-500/60 hover:bg-slate-900 transition"
            >
              <h2 className="text-sm font-semibold mb-1">{team}</h2>
              <p className="text-3xl font-bold">
                {counts[team] ?? 0}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Open complaints assigned by AI.
              </p>
            </a>
          ))}
        </section>
      )}
    </main>
  );
}
