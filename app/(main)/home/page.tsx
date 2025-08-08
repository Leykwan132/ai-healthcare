"use client";

import { useState } from "react";
import { CalendarView } from "@/components/custom-ui/patient-calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [selectedReminder, setSelectedReminder] = useState<any>(null);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-4xl space-y-6">
        <CalendarView onSelectEvent={setSelectedReminder} />

        {/* Event Detail Dialog */}
        {selectedReminder && (
          <Dialog open={!!selectedReminder} onOpenChange={() => setSelectedReminder(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedReminder.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 text-sm text-muted-foreground">
                {Object.entries(selectedReminder).map(([key, value]) => {
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
              <Button onClick={() => setSelectedReminder(null)} className="mt-4">
                Close
              </Button>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
