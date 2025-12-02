// frontend/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { apiFetch } from "@/lib/api";

type StatsSummary = {
  total_complaints: number;
  by_category: Record<string, number>;
  by_priority: Record<string, number>;
  by_sentiment: Record<string, number>;
};

export default function DashboardPage() {
  useAuthGuard(); // no-op

  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/stats/summary")
      .then((data) => {
        setStats(data as StatsSummary);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Stats fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-50 p-6">
        <p>Loading stats...</p>
      </main>
    );
  }

  if (!stats) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-50 p-6">
        <p className="text-red-400">Failed to load stats.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-6 space-y-6">
      <h1 className="text-2xl font-bold">AI Dashboard</h1>

      {/* TOP CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <h2 className="text-sm text-slate-400">Total Complaints</h2>
          <p className="text-3xl font-bold mt-2">
            {stats.total_complaints}
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <h2 className="text-sm text-slate-400">Categories</h2>
          <div className="text-sm mt-2 text-slate-200 space-y-1">
            {Object.entries(stats.by_category).map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span>{k}</span>
                <span className="font-semibold">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <h2 className="text-sm text-slate-400">Priority Levels</h2>
          <div className="text-sm mt-2 text-slate-200 space-y-1">
            {Object.entries(stats.by_priority).map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span>{k}</span>
                <span className="font-semibold">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SENTIMENT BOX */}
      <section className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl max-w-md">
        <h2 className="text-sm text-slate-400 mb-2">Sentiment Distribution</h2>
        <div className="text-sm text-slate-200 space-y-1">
          {Object.entries(stats.by_sentiment).map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span>{k}</span>
              <span className="font-semibold">{v}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
