/* Thin client for the ARACANA AI FastAPI backend.
   Content pages render from local data for instant, offline-friendly loads;
   these helpers cover the live, dynamic calls (intake + optional fetches). */

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export type Ack = {
  ok: boolean;
  id: string;
  received_at: string;
  message: string;
};

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.detail || `Request failed (${res.status})`);
  }
  return res.json();
}

export function sendContact(input: {
  name: string;
  email: string;
  organization?: string;
  subject: string;
  message: string;
}): Promise<Ack> {
  return post<Ack>("/api/contact", input);
}

export function requestEarlyAccess(input: {
  email: string;
  product_slug: string;
  organization?: string;
  use_case?: string;
}): Promise<Ack> {
  return post<Ack>("/api/early-access", input);
}

export function applyToRole(input: {
  name: string;
  email: string;
  role: string;
  links?: string;
  note?: string;
}): Promise<Ack> {
  return post<Ack>("/api/careers/apply", input);
}
