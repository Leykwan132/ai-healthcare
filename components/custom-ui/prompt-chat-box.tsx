"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import axios from "axios";

export function PromptChatBox() {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Set up patient's schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="mb-2"
        />

        {loading && (
          <p className="text-xs text-muted-foreground">Loading suggestions...</p>
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