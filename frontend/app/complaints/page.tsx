// frontend/app/complaints/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuthGuard } from "../hooks/useAuthGuard";
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

export default function ComplaintsPage() {
  useAuthGuard(); // safe no-op

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/complaints")
      .then((data) => {
        setComplaints(data as Complaint[]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading complaints:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-50 p-6">
        <p>Loading complaints...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-2">All Complaints</h1>

      {complaints.length === 0 ? (
        <p className="text-sm text-slate-400">No complaints yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-xs">
            <thead className="bg-slate-900">
              <tr>
                <th className="p-3 border border-slate-800">ID</th>
                <th className="p-3 border border-slate-800">Email</th>
                <th className="p-3 border border-slate-800">Text</th>
                <th className="p-3 border border-slate-800">Category</th>
                <th className="p-3 border border-slate-800">Priority</th>
                <th className="p-3 border border-slate-800">Sentiment</th>
                <th className="p-3 border border-slate-800">Team</th>
                <th className="p-3 border border-slate-800">Status</th>
                <th className="p-3 border border-slate-800">Created</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.id} className="odd:bg-slate-900">
                  <td className="p-3 border border-slate-800">{c.id}</td>
                  <td className="p-3 border border-slate-800">
                    {c.user_email || "Anonymous"}
                  </td>
                  <td className="p-3 border border-slate-800 max-w-xs">
                    <a
                      href={`/complaints/${c.id}`}
                      className="line-clamp-2 hover:text-emerald-400"
                    >
                      {c.text}
                    </a>
                  </td>
                  <td className="p-3 border border-slate-800">
                    {c.category || "-"}
                  </td>
                  <td className="p-3 border border-slate-800">
                    {c.priority || "-"}
                  </td>
                  <td className="p-3 border border-slate-800">
                    {c.sentiment || "-"}
                  </td>
                  <td className="p-3 border border-slate-800">
                    {c.assigned_team || "-"}
                  </td>
                  <td className="p-3 border border-slate-800">
                    {c.status}
                  </td>
                  <td className="p-3 border border-slate-800">
                    {new Date(c.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
