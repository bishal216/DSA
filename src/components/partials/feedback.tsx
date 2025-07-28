import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FeedbackFormProps {
  isOpen: boolean;
  onClose: () => void;
}

type FeedbackType = "bug" | "feature" | "general" | "other"; // Added "other" to match Select options

export function FeedbackForm({ isOpen, onClose }: FeedbackFormProps) {
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("general");
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

  async function sendFeedback(
    feedbackMessage: string,
    type: FeedbackType = "general",
  ) {
    try {
      const response = await fetch(`${VITE_FEEDBACK_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: feedbackMessage,
          url: window.location.href,
          type: type,
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
      await sendFeedback(feedback.trim(), feedbackType); // Pass feedbackType here
      setSuccess(true);
      setFeedback("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send feedback");
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    setSuccess(false);
  }, [onClose]);

  // Add scroll lock when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollBarWidth}px`;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.paddingRight = "";
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop*/}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-out"
        onClick={onClose}
        style={{
          width: "calc(100vw)",
          right: "0",
        }}
      />

      {/* Modal container */}
      <div
        role="dialog"
        aria-modal="true"
        className={`
      fixed z-50 top-1/2 left-1/2
      -translate-x-1/2 -translate-y-1/2
      w-full max-w-md max-h-[90vh]  // Added max height
      bg-white p-6 rounded-xl
      shadow-lg border border-gray-100
      transform transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
      ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}
      overflow-y-auto  // Make modal content scrollable if needed
    `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with better visual hierarchy */}
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-900">
              Share Your Feedback
            </h2>
            <p className="text-sm text-gray-500">
              Help us improve your experience
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Feedback Form"
            className="text-gray-400 hover:text-gray-600 transition-colors duration-150 p-1 -mr-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Feedback Type Dropdown with better styling */}
        <div className="mb-5">
          <Label
            htmlFor="feedback-type"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            What type of feedback do you have?
          </Label>
          <Select
            value={feedbackType}
            onValueChange={(value) => setFeedbackType(value as FeedbackType)}
          >
            <SelectTrigger id="feedback-type" className="w-full">
              <SelectValue placeholder="Select feedback type" />
            </SelectTrigger>
            <SelectContent className="rounded-lg shadow-lg">
              <SelectItem value="bug" className="hover:bg-red-50">
                <span className="flex items-center gap-2">Bug Report</span>
              </SelectItem>
              <SelectItem value="feature" className="hover:bg-green-50">
                <span className="flex items-center gap-2">Feature Request</span>
              </SelectItem>
              <SelectItem value="general" className="hover:bg-blue-50">
                <span className="flex items-center gap-2">
                  General Feedback
                </span>
              </SelectItem>
              <SelectItem value="other" className="hover:bg-purple-50">
                <span className="flex items-center gap-2">Other</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Textarea with better styling */}
        <Textarea
          aria-label="Feedback message"
          placeholder={
            feedbackType === "bug"
              ? "Describe the bug (what happened, steps to reproduce)..."
              : feedbackType === "feature"
                ? "What feature would you like? How would you use it?..."
                : "Share your thoughts with us..."
          }
          value={feedback}
          onChange={(e) => {
            setFeedback(e.target.value);
            setSuccess(false);
            setError("");
          }}
          disabled={sending}
          rows={5}
          className={`
        resize-none w-full transition-all duration-200
        border-gray-300 hover:border-gray-700 focus:border-indigo-400
        ${feedbackType === "bug" ? "focus:ring-red-100" : ""}
        ${feedbackType === "feature" ? "focus:ring-green-100" : ""}
        ${feedbackType === "general" ? "focus:ring-blue-100" : ""}
        ${feedbackType === "other" ? "focus:ring-purple-100" : ""}
      `}
        />

        {/* Character counter (optional) */}
        <div className="text-xs text-gray-400 text-right mt-1">
          {feedback.length}/500
        </div>

        {/* Submit Button with better visual feedback */}
        <Button
          onClick={handleSend}
          disabled={sending || !feedback.trim()}
          className={`
        mt-5 w-full transition-all duration-200
        ${feedbackType === "bug" ? "bg-linear-to-r from-red-500 to-rose-500 hover:shadow-red-200" : ""}
        ${feedbackType === "feature" ? "bg-linear-to-r from-green-500 to-emerald-500 hover:shadow-green-200" : ""}
        ${feedbackType === "general" ? "bg-linear-to-r from-blue-500 to-indigo-500 hover:shadow-blue-200" : ""}
        ${feedbackType === "other" ? "bg-linear-to-r from-purple-500 to-violet-500 hover:shadow-purple-200" : ""}
        shadow-md hover:shadow-lg
        text-white font-medium
      `}
        >
          {success ? (
            <span className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <path d="m9 11 3 3L22 4" />
              </svg>
              Feedback Sent!
            </span>
          ) : sending ? (
            <span className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-spin"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Sending...
            </span>
          ) : (
            "Send Feedback"
          )}
        </Button>

        {/* Feedback Message with better transitions */}
        <div
          aria-live="polite"
          className={`mt-3 text-center text-sm transition-all duration-300 overflow-hidden ${
            success || error ? "max-h-20" : "max-h-0"
          }`}
        >
          {success && (
            <p className="text-green-600 bg-green-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <path d="m9 11 3 3L22 4" />
              </svg>
              Thank you! We've received your feedback.
            </p>
          )}
          {error && (
            <p className="text-red-600 bg-red-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m15 9-6 6" />
                <path d="m9 9 6 6" />
              </svg>
              {error}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
