"use client";

import { useState } from "react";
import { sendContact } from "@/lib/api";
import { SITE } from "@/lib/site";

type State = "idle" | "sending" | "done" | "error";

export default function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const fd = new FormData(e.currentTarget);
    try {
      const ack = await sendContact({
        name: String(fd.get("name") || ""),
        email: String(fd.get("email") || ""),
        organization: String(fd.get("organization") || "") || undefined,
        subject: String(fd.get("subject") || "General enquiry"),
        message: String(fd.get("message") || ""),
      });
      setMsg(ack.message);
      setState("done");
    } catch {
      // Backend offline? Fall back gracefully to email so the user is never stuck.
      setMsg(
        `Our API is unreachable right now — please email us directly at ${SITE.email}.`
      );
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-paper-line bg-paper-raised p-8 text-center">
        <div className="text-2xl">✓</div>
        <p className="mt-3 font-display text-lg text-ink">Message sent</p>
        <p className="mt-1 text-sm text-ink-muted">{msg}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-paper-line bg-paper-raised p-6 md:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Name" required />
        <Field name="email" label="Email" type="email" required />
        <Field name="organization" label="Organization" />
        <Field name="subject" label="Subject" required />
      </div>
      <label className="mt-4 block">
        <span className="eyebrow">Message</span>
        <textarea
          name="message"
          required
          rows={5}
          className="mt-2 w-full resize-none rounded-xl border border-paper-line bg-paper-soft px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ink"
        />
      </label>

      {state === "error" && (
        <p className="mt-4 text-sm text-accent">{msg}</p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="btn-dark mt-6 w-full sm:w-auto"
      >
        {state === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="eyebrow">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded-xl border border-paper-line bg-paper-soft px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ink"
      />
    </label>
  );
}
