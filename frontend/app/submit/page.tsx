// frontend/app/submit/page.tsx
"use client";

import { useState } from "react";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { apiFetch } from "@/lib/api";

export default function SubmitComplaintPage() {
  useAuthGuard(); // currently no-op

  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      await apiFetch("/complaints", {
        method: "POST",
        body: JSON.stringify({
          text,
          user_email: email === "" ? null : email,
        }),
      });

      setMessage("Complaint submitted successfully!");
      setEmail("");
      setText("");
    } catch (err) {
      console.error(err);
      setMessage("Error submitting complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-6 flex justify-center">
      <div className="w-full max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold">Submit a Complaint</h1>
        <p className="text-xs text-slate-400">
          The AI will categorize, prioritize, and route this complaint.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs mb-1">Customer Email (optional)</label>
            <input
              type="email"
              className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-sm outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@example.com"
            />
          </div>

          <div>
            <label className="block text-xs mb-1">Complaint Text</label>
            <textarea
              className="w-full p-3 rounded bg-slate-900 border border-slate-700 text-sm outline-none min-h-[160px]"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              placeholder="Describe the issue in detail..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 text-sm font-semibold hover:bg-emerald-400 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>

        {message && (
          <p className="text-xs mt-2 text-slate-200">{message}</p>
        )}
      </div>
    </main>
  );
}
