"use client";

import { useId } from "react";

export default function FormField({
  name,
  label,
  type = "text",
  required = false,
  as = "input",
  rows,
  maxLength,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  as?: "input" | "textarea";
  rows?: number;
  maxLength?: number;
}) {
  const id = useId();
  const fieldClass =
    "mt-2 w-full rounded-xl border border-paper-line bg-paper-soft px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ink";
  return (
    <label className={as === "textarea" ? "mt-4 block" : "block"} htmlFor={id}>
      <span className="eyebrow">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      {as === "textarea" ? (
        <textarea
          id={id}
          name={name}
          required={required}
          rows={rows}
          maxLength={maxLength}
          className={`${fieldClass} resize-none`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          maxLength={maxLength}
          className={fieldClass}
        />
      )}
    </label>
  );
}
