import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useCalendarFormState } from "../states/calendar-form-state-store";
import { ConferenceSchedForm } from "./conference-sched-form";

export const CalendarFormDialog = () => {
  const { isOpen, setIsOpen } = useCalendarFormState();
  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogContent className="sm:max-w-[425px] ">
        <DialogHeader>
          <DialogTitle>Conference Schedule Form</DialogTitle>
          <DialogDescription>
            Make changes to conference schedule. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="z-100">
          <ConferenceSchedForm />
        </div>
      </DialogContent>
    </Dialog>
  );
};
