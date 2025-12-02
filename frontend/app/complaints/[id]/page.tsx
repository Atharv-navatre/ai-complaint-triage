// frontend/app/complaints/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import { apiFetch } from "@/lib/api";

type Complaint = {
  id: number;
  user_email: string | null;
  text: string;
  category: string | null;
  sentiment: string | null;
  priority: string | null;
  assigned_team: string | null;
  status: string;
  created_at: string;
};

export default function ComplaintDetailPage() {
  useAuthGuard(); // no-op

  const params = useParams();
  const id = params?.id as string;

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    apiFetch("/complaints")
      .then((data) => {
        const list = data as Complaint[];
        const found = list.find((c) => String(c.id) === id) || null;
        setComplaint(found);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading complaint:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-50 p-6">
        <p>Loading complaint...</p>
      </main>
    );
  }

  if (!complaint) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-50 p-6">
        <button
          onClick={() => history.back()}
          className="text-xs text-slate-400 hover:text-slate-200 mb-2"
        >
          ← Back
        </button>
        <p>Complaint not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <button
          onClick={() => history.back()}
          className="text-xs text-slate-400 hover:text-slate-200"
        >
          ← Back to complaints
        </button>

        <h1 className="text-2xl font-bold">Complaint #{complaint.id}</h1>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-xs text-slate-400">Customer Email</h2>
            <p className="text-sm">
              {complaint.user_email || "Anonymous"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-xs text-slate-400">Created At</h2>
            <p className="text-sm">
              {new Date(complaint.created_at).toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-xs text-slate-400">Category (AI)</h2>
            <p className="text-sm font-medium">{complaint.category}</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-xs text-slate-400">Sentiment (AI)</h2>
            <p className="text-sm font-medium">{complaint.sentiment}</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-xs text-slate-400">Priority (AI)</h2>
            <p className="text-sm font-medium">{complaint.priority}</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-xs text-slate-400">Assigned Team</h2>
            <p className="text-sm font-medium">{complaint.assigned_team}</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-xs text-slate-400 mb-2">Full Complaint Text</h2>
          <p className="text-sm whitespace-pre-wrap">{complaint.text}</p>
        </div>
      </div>
    </main>
  );
}
