import { useState } from "react";
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
        body: JSON.stringify({ message: feedbackMessage }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Failed to send feedback");
      }
      return data;
    } catch (err) {
      throw new Error("Network error or server unavailable" + err);
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
            bg-white dark:bg-gray-900
            rounded-2xl
            p-5 shadow-2xl
            border border-gray-200 dark:border-gray-700
            flex flex-col gap-4
          "
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                We'd love your feedback!
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-400">
                This sends a message to the dev team.
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close Feedback Form"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              &times;
            </button>
          </div>

          {/* Textarea */}
          <Textarea
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
            {sending ? "Sending..." : "Send Feedback"}
          </Button>

          {/* Message Feedback */}
          <div aria-live="polite" className="min-h-[1.5rem] text-center">
            {success && (
              <p className="text-sm text-green-500 dark:text-green-400">
                🎉 Thanks! Your feedback was sent.
              </p>
            )}
            {error && (
              <p className="text-sm text-red-500 dark:text-red-400">
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
