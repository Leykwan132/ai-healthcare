"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

export function PromptChatBox() {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    const debounce = setTimeout(() => {
      setLoading(true);
      axios
        .get(`/api/suggestions?query=${encodeURIComponent(input)}`)
        .then((res) => {
          setSuggestions(res.data.suggestions || []);
        })
        .catch(() => {
          setSuggestions([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 300);

    return () => clearTimeout(debounce);
  }, [input]);

  // Auto grow textarea height based on scrollHeight
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset height to auto to recalc
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const sendMessage = () => {
    if (!input.trim()) return;
    console.log("Send message:", input);
    // TODO: your send logic here

    setInput("");
    setSuggestions([]);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Set up patient's schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative flex items-center">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            className="resize-none w-full rounded-md border border-gray-300 p-2 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-hidden"
            style={{ maxHeight: "200px" }}
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={!input.trim()}
            aria-label="Send message"
            className="
            absolute right-3 top-1/2 -translate-y-1/2
            w-8 h-8
            rounded-md
            bg-blue-600 dark:bg-black
            text-white
            hover:bg-blue-700 dark:hover:bg-gray-800
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center
            shadow-md
          "
          >
            <span className="text-2xl leading-none select-none">&gt;</span>
          </button>
        </div>

        {loading && (
          <p className="text-xs text-muted-foreground mt-1">
            Loading suggestions...
          </p>
        )}

        {suggestions.length > 0 && (
          <div className="mt-2 p-2 border rounded bg-muted text-sm">
            <p className="text-muted-foreground mb-1">Suggestions:</p>
            <ul className="list-disc list-inside space-y-1">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  className="cursor-pointer hover:underline"
                  onClick={() => setInput(s)}
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}