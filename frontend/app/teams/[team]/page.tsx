"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthGuard } from "../../hooks/useAuthGuard";

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

const API_BASE = "http://localhost:8000";

export default function TeamComplaintsPage() {
  useAuthGuard();

  const params = useParams();
  const teamParam = params?.team as string;
  const teamName = decodeURIComponent(teamParam);

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/complaints`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (c: Complaint) =>
            (c.assigned_team || "General Support Team") === teamName
        );
        setComplaints(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching complaints:", err);
        setLoading(false);
      });
  }, [teamName]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-6 space-y-4">
      <button
        onClick={() => history.back()}
        className="text-xs text-slate-400 hover:text-slate-200"
      >
        ← Back to teams
      </button>

      <h1 className="text-2xl font-bold">Complaints for {teamName}</h1>

      {loading ? (
        <p>Loading complaints...</p>
      ) : complaints.length === 0 ? (
        <p>No complaints assigned to this team.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-xs">
            <thead className="bg-slate-900">
              <tr>
                <th className="p-3 border border-slate-800">ID</th>
                <th className="p-3 border border-slate-800">Email</th>
                <th className="p-3 border border-slate-800">Complaint</th>
                <th className="p-3 border border-slate-800">Category</th>
                <th className="p-3 border border-slate-800">Priority</th>
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
                      className="line-clamp-3 hover:text-emerald-400"
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
