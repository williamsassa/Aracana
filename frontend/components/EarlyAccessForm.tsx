"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { requestEarlyAccess } from "@/lib/api";
import { SITE } from "@/lib/site";
import Field from "./FormField";
import type { Product } from "@/lib/products";

type State = "idle" | "invalid" | "sending" | "done" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EarlyAccessForm({ product }: { product: Product }) {
  const t = useTranslations("earlyAccessForm");
  const [state, setState] = useState<State>("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();

    if (!EMAIL_RE.test(email)) {
      setState("invalid");
      return;
    }

    setState("sending");
    try {
      const ack = await requestEarlyAccess({
        email,
        product_slug: product.slug,
        organization: String(fd.get("organization") || "") || undefined,
        use_case: String(fd.get("use_case") || "") || undefined,
      });
      setMsg(ack.message);
      setState("done");
    } catch {
      setMsg(t("errorFallback", { email: SITE.email }));
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div
        className="rounded-2xl border border-paper-line bg-paper-raised p-8 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="text-2xl">✓</div>
        <p className="mt-3 font-display text-lg text-ink">{t("sentTitle")}</p>
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
        <Field name="email" label={t("email")} type="email" required />
        <Field name="organization" label={t("organization")} maxLength={160} />
      </div>
      <Field
        name="use_case"
        label={t("useCase")}
        as="textarea"
        rows={4}
        maxLength={2000}
      />

      {state === "invalid" && (
        <p className="mt-4 text-sm text-accent" role="status" aria-live="polite">
          {t("invalid")}
        </p>
      )}
      {state === "error" && (
        <p className="mt-4 text-sm text-accent" role="status" aria-live="polite">
          {msg}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="btn-dark mt-6 w-full sm:w-auto"
      >
        {state === "sending" ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
