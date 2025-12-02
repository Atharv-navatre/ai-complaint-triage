// frontend/lib/api.ts

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const url = `${API_BASE}${path}`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error: ${res.status} - ${text}`);
  }

  // Some endpoints might return empty body
  try {
    return await res.json();
  } catch {
    return null;
  }
}
