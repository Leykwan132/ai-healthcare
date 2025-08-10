"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

import { FiChevronRight } from "react-icons/fi";

export function PromptChatBox() {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const samplePrescriptions = [
    "Take 1 tablet of Amlodipine 5mg once daily in the morning. Light exercise 30 minutes daily.",
    "Ventolin inhaler 2 puffs as needed for asthma. Flixotide 250mcg inhaler twice daily morning and evening. Avoid dust and smoke.",
    "Simvastatin 20mg once daily in the evening with food. Walking exercise 45 minutes daily. Follow up in 2 weeks.",
    "Novorapid insulin 10 units before breakfast and dinner. Metformin 1000mg twice daily with meals. Check blood sugar daily.",
    "Take Paracetamol 500mg three times daily for 5 days. Rest and drink plenty of fluids."
  ];

  // Helper: filter out suggestions exactly matching input (case insensitive)
  const filterExactMatch = (list: string[]) =>
    list.filter(
      (s) => s.toLowerCase() !== input.trim().toLowerCase()
    );

  // Filter samplePrescriptions based on input (case insensitive)
  const filteredLocalSuggestions = input.trim()
    ? filterExactMatch(
      samplePrescriptions.filter(p =>
        p.toLowerCase().includes(input.toLowerCase())
      )
    )
    : filterExactMatch(samplePrescriptions); // show all except exact match if input empty

  // Debounced API call for suggestions
  useEffect(() => {
    if (!input.trim()) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const debounce = setTimeout(() => {
      axios
        .get(`/api/suggestions?query=${encodeURIComponent(input)}`)
        .then((res) => {
          const apiSugs = res.data.suggestions || [];
          setSuggestions(filterExactMatch(apiSugs));
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
      textareaRef.current.style.height = "auto";
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

  // Determine which suggestions to show:
  // if loading, show filtered local suggestions (already filtered for exact matches)
  // else show API suggestions (filtered) or fallback to filtered local suggestions
  const showSuggestions =
    isFocused
      ? (loading
        ? filteredLocalSuggestions
        : (suggestions.length > 0 ? suggestions : filteredLocalSuggestions))
      : [];

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
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setTimeout(() => setIsFocused(false), 150);
            }}
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
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md bg-blue-600 dark:bg-black text-white hover:bg-blue-700 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>

        {showSuggestions.length > 0 && (
          <div
            className="mt-2 p-2 border rounded bg-muted text-sm max-h-48 overflow-y-auto shadow-md"
            role="listbox"
          >
            <ul className="list-none space-y-1">
              {showSuggestions.map((s, i) => (
                <li
                  key={i}
                  role="option"
                  tabIndex={-1}
                  className="cursor-pointer rounded px-2 py-1 hover:bg-blue-200"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setInput(s);
                  }}
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
