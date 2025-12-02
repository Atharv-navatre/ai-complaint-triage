"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const DEMO_EMAIL = "admin@example.com";
    const DEMO_PASSWORD = "admin123";

    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      if (typeof window !== "undefined") {
        localStorage.setItem("authToken", "demo-token");
      }
      router.push("/dashboard");
    } else {
      setError("Invalid credentials. Try admin@example.com / admin123.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 p-6">
      <div className="w-full max-w-sm bg-slate-900/60 border border-slate-800 p-6 rounded-xl shadow-lg space-y-4">
        <h1 className="text-xl font-bold">Admin Login</h1>
        <p className="text-xs text-slate-400">
          Demo login only – no real user accounts.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-sm outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-xs mb-1">Password</label>
            <input
              type="password"
              className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-sm outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-semibold py-2 rounded-lg"
          >
            Login
          </button>

          {error && (
            <p className="text-xs text-red-400 mt-2">{error}</p>
          )}
        </form>
      </div>
    </main>
  );
}
