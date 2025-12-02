"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";

// --- Simple auth store using localStorage + events ---

function getAuthSnapshot() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("auth") === "true";
}

function subscribeAuth(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const handler = () => callback();

  // Trigger when localStorage changes in this tab or other tabs
  window.addEventListener("storage", handler);
  // Custom event we'll fire on login/logout
  window.addEventListener("auth-change", handler as EventListener);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("auth-change", handler as EventListener);
  };
}

export function NavBar() {
  const router = useRouter();

  // React-19 friendly: no setState in effect, we subscribe to an external store
  const isAuthed = useSyncExternalStore(
    subscribeAuth,
    getAuthSnapshot,
    () => false // server snapshot
  );

  const handleLogout = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("auth");
    // notify subscribers (NavBar, etc.)
    window.dispatchEvent(new Event("auth-change"));
    router.push("/login");
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <nav className="w-full p-4 bg-slate-900 border-b border-slate-800 flex gap-6 text-slate-200 items-center justify-between">
      <div className="flex gap-6 items-center">
        <Link href="/" className="hover:text-white">
          Home
        </Link>
        <Link href="/dashboard" className="hover:text-white">
          Dashboard
        </Link>
        <Link href="/submit" className="hover:text-white">
          Submit Complaint
        </Link>
<Link href="/complaints" className="hover:text-white">
  View Complaints
</Link>
<Link href="/teams" className="hover:text-white">
  Teams
</Link>

      </div>

      <div className="text-sm">
        {isAuthed ? (
          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded-lg border border-slate-600 hover:bg-slate-800"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={handleLoginClick}
            className="px-3 py-1 rounded-lg border border-emerald-500 text-emerald-300 hover:bg-emerald-500/10"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
