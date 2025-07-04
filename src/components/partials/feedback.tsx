import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface FeedbackFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackForm({ isOpen, onClose }: FeedbackFormProps) {
  const [feedback, setFeedback] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const VITE_FEEDBACK_URL = import.meta.env.VITE_FEEDBACK_URL;

  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  async function sendFeedback(feedbackMessage: string) {
    try {
      const response = await fetch(`${VITE_FEEDBACK_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: feedbackMessage,
          url: window.location.href,
          title: document.title,
        }),
      });

      let data;
      try {
        data = await response.clone().json();
      } catch {
        data = { detail: await response.text() };
      }

      if (!response.ok) {
        throw new Error(data?.detail || "Failed to send feedback");
      }
      return data;
    } catch (err) {
      console.error("Feedback error:", err);
      throw new Error(
        err instanceof Error
          ? err.message
          : "Network error or server unavailable.",
      );
    }
  }

  async function handleSend() {
    setSending(true);
    setSuccess(false);
    setError("");

    try {
      await sendFeedback(feedback.trim());
      setSuccess(true);
      setFeedback("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send feedback");
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => onClose(), 2000);
      return () => clearTimeout(timer);
    }
  }, [success, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        className="
          fixed z-50 top-1/2 left-1/2
          -translate-x-1/2 -translate-y-1/2
          w-full max-w-md
          bg-white p-6 rounded-2xl
          shadow-2xl border border-gray-200
          animate-fade-in
        "
        onClick={(e) => e.stopPropagation()} // prevent modal click from closing
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              We'd love your feedback!
            </h2>
            <p className="text-xs text-gray-500">
              Let the dev team know what you think.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Feedback Form"
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Textarea */}
        <Textarea
          aria-label="Feedback message"
          placeholder="Type your feedback..."
          value={feedback}
          onChange={(e) => {
            setFeedback(e.target.value);
            setSuccess(false);
            setError("");
          }}
          disabled={sending}
          rows={4}
          className="resize-none w-full"
        />

        {/* Submit Button */}
        <Button
          onClick={handleSend}
          disabled={sending || !feedback.trim()}
          className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 transition text-white"
        >
          {success ? "✅ Sent!" : sending ? "Sending..." : "Send Feedback"}
        </Button>

        {/* Feedback Message */}
        <div aria-live="polite" className="h-6 mt-2 text-center text-sm">
          {success && (
            <p className="text-green-500">🎉 Thanks! Your feedback was sent.</p>
          )}
          {error && <p className="text-red-500">⚠️ {error}</p>}
        </div>
      </div>
    </>
  );
}
