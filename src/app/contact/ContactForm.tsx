"use client";

import { useState, FormEvent } from "react";
import styles from "./ContactForm.module.css";

type FormState = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [state, setState] = useState<FormState>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: data.get("name") as string,
      email: data.get("email") as string,
      company: data.get("company") as string,
      budget: data.get("budget") as string,
      subject: data.get("subject") as string,
      message: data.get("message") as string,
    };

    try {
      const subject = payload.subject || "New project inquiry";
      const body = [
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        `Company: ${payload.company || "Not provided"}`,
        `Budget: ${payload.budget || "Not provided"}`,
        "",
        payload.message,
      ].join("\n");

      window.location.href = `mailto:hello@mehrozgfx.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setState("success");
      form.reset();
    } catch {
      setState("error");
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      aria-label="Contact form"
    >
      {/* Row 1: Name + Email */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="cf-name">Name</label>
          <input
            id="cf-name"
            name="name"
            type="text"
            placeholder="Your name"
            required
            autoComplete="name"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="cf-email">Email</label>
          <input
            id="cf-email"
            name="email"
            type="email"
            placeholder="you@brand.com"
            required
            autoComplete="email"
          />
        </div>
      </div>

      {/* Row 2: Company + Budget */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="cf-company">Company</label>
          <input
            id="cf-company"
            name="company"
            type="text"
            placeholder="Brand / company"
            autoComplete="organization"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="cf-budget">Budget</label>
          <input
            id="cf-budget"
            name="budget"
            type="text"
            placeholder="Estimated budget"
          />
        </div>
      </div>

      {/* Row 3: Subject */}
      <div className={styles.fieldFull}>
        <label htmlFor="cf-subject">Subject</label>
        <input
          id="cf-subject"
          name="subject"
          type="text"
          placeholder="What's this about?"
        />
      </div>

      {/* Row 4: Message */}
      <div className={styles.fieldFull}>
        <label htmlFor="cf-message">Message</label>
        <textarea
          id="cf-message"
          name="message"
          rows={8}
          placeholder="Tell me about your brand and goals..."
          required
        />
      </div>

      {/* Feedback */}
      {state === "success" && (
        <p className={styles.feedback} role="status" aria-live="polite">
          Your email client should open with the message ready to send.
        </p>
      )}
      {state === "error" && (
        <p className={`${styles.feedback} ${styles.feedbackError}`} role="alert">
          Something went wrong. Please email me directly at hello@mehrozgfx.com
        </p>
      )}

      <button
        id="cf-submit"
        className={styles.submit}
        type="submit"
        disabled={state === "sending"}
      >
        {state === "sending" ? "Sending…" : "Send message ↗"}
      </button>
    </form>
  );
}
