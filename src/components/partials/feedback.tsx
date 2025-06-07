import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function FeedbackForm() {
  const [feedback, setFeedback] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const VITE_FEEDBACK_URL = import.meta.env.VITE_FEEDBACK_URL;

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

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Failed to send feedback");
      }
      return data;
    } catch (err) {
      console.error("Feedback error:", err);
      throw new Error(
        err instanceof Error
          ? err.message
          : "Network error or server unavailable."
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

  // Auto-close form after success (optional)
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setIsOpen(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Feedback Form"
        className="
          fixed bottom-4 right-4 z-50
          w-12 h-12 rounded-full
          bg-gray-700
          flex items-center justify-center
          text-white text-xl
        "
      >
        📝
      </button>

      {/* Feedback Form Popup */}
      {isOpen && (
        <div
          className="
            animate-fade-in
            fixed bottom-20 right-6 z-50
            w-80 max-w-full
            bg-white
            rounded-2xl
            p-5 shadow-2xl
            border border-gray-200
            flex flex-col gap-4
          "
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm font-medium text-gray-700">
                We'd love your feedback!
              </h2>
              <p className="text-xs text-gray-400">
                This sends a message to the dev team.
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close Feedback Form"
              className="text-gray-400 hover:text-gray-600 text-xl"
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
            className="resize-none"
          />

          {/* Submit Button */}
          <Button
            onClick={handleSend}
            disabled={sending || !feedback.trim()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 transition text-white"
          >
            {success ? "✅ Sent!" : sending ? "Sending..." : "Send Feedback"}
          </Button>

          {/* Message Feedback */}
          <div aria-live="polite" className="min-h-[1.5rem] text-center">
            {success && (
              <p role="alert" className="text-sm text-green-500">
                🎉 Thanks! Your feedback was sent.
              </p>
            )}
            {error && (
              <p role="alert" className="text-sm text-red-500">
                ⚠️ {error}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default FeedbackForm;
