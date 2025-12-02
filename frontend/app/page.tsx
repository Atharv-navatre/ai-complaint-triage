// frontend/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { SplineHero } from "./components/SplineHero";
import { apiFetch } from "@/lib/api";

export default function HomePage() {
  const [backendStatus, setBackendStatus] = useState("Checking...");

  useEffect(() => {
    apiFetch("/health")
      .then((data) => {
        if (data && data.status) setBackendStatus(data.status);
        else setBackendStatus("error");
      })
      .catch(() => setBackendStatus("error"));
  }, []);

  // TODO: replace this with your actual Spline URL if you want
  const splineUrl =
    "https://app.spline.design/file/46c28a00-7826-45fe-ad67-941f81672a58";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-4 py-8 md:px-10 md:py-12">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Top section: 3D + intro */}
        <section className="grid gap-8 md:grid-cols-[1.3fr,minmax(0,1fr)] items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              AI-Powered Complaint Triage
            </div>

            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Turn chaotic customer complaints into{" "}
              <span className="text-emerald-400">clear, actionable insights.</span>
            </h1>

            <p className="text-slate-300 text-sm md:text-base">
              This system automatically categorizes, prioritizes, and routes
              customer complaints using AI — helping support teams focus on
              what matters most: critical issues and unhappy customers.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="/submit"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition"
              >
                Submit a test complaint
              </a>
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition"
              >
                View AI dashboard
              </a>
            </div>

            <div className="mt-3 text-xs text-slate-400 flex items-center gap-2">
              <span className="font-medium">Backend status:</span>
              <span
                className={
                  backendStatus === "ok"
                    ? "text-emerald-400"
                    : backendStatus === "error"
                    ? "text-red-400"
                    : "text-amber-300"
                }
              >
                {backendStatus}
              </span>
            </div>
          </div>

          <SplineHero src={splineUrl} />
        </section>

        {/* Feature strip */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-sm font-semibold mb-1">Smart Categorization</h2>
            <p className="text-xs text-slate-400">
              Automatically detects if the complaint is about refunds, delivery,
              payments, login, or product quality.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-sm font-semibold mb-1">Sentiment & Priority</h2>
            <p className="text-xs text-slate-400">
              Estimates customer mood and assigns Low / Medium / High priority
              based on anger, urgency, and risk.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-sm font-semibold mb-1">Auto Team Routing</h2>
            <p className="text-xs text-slate-400">
              Maps each complaint to Billing, Logistics, Tech Support, or
              General Support automatically.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
