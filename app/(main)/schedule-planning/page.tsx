// app/page.tsx or wherever you use it

"use client";

import { useState } from "react";
import { PromptChatBox } from "@/components/custom-ui/prompt-chat-box";
import { CalendarView } from "@/components/custom-ui/doctor-calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-4xl space-y-6">
        <PromptChatBox />
        <CalendarView onSelectEvent={setSelectedEvent} />

        {/* Event Detail Dialog */}
        {selectedEvent && (
          <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedEvent.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 text-sm text-muted-foreground">
                {Object.entries(selectedEvent).map(([key, value]) => {
                  if (["id", "title"].includes(key)) return null;
                  const formattedValue =
                    value instanceof Date ? value.toLocaleString() : String(value);
                  return (
                    <div key={key}>
                      <strong className="capitalize">{key}:</strong> {formattedValue}
                    </div>
                  );
                })}
              </div>
              <Button onClick={() => setSelectedEvent(null)} className="mt-4">
                Close
              </Button>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
