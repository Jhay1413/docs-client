import FormTextArea from "@/components/formTextArea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { tsr } from "@/services/tsr";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

export const InboxUpdateForm = ({ id }: { id: string }) => {
  const tsrQueryClient = tsr.useQueryClient();
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [open, setOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams({
    currentPage: "1",
    search: "",
  });
  const searchQuery = searchParams.get("search") || "";
  const page = searchParams.get("currentPage") || "1";
  const { mutate } = tsr.ticketing.updateTicketOnInboxRoutes.useMutation({
    onMutate: () => {
      toast.success("Ticket updated");
      const lastGoodKnown = tsrQueryClient.ticketing.getTickets.getQueryData(["tickets-inbox", page, searchQuery]);
      tsrQueryClient.ticketing.getTickets.setQueryData(["tickets-inbox", page, searchQuery], (old) => {
        if (!old) return old;
        return {
          ...old,
          body: {
            ...old.body,
            data: old.body.data.map((item) => {
              if (item.id === id) return { ...item, remarks: remarks, status: status };
              return item;
            }),
          },
        };
      });
      setOpen(!open);
      return { lastGoodKnown };
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong !");
    },
    onSettled: () => {
      tsrQueryClient.invalidateQueries({ queryKey: ["tickets-inbox", page, searchQuery] });
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="Update ticket">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mark as Ongoing</DialogTitle>
          <DialogDescription>Make changes to your ticket here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Status
            </Label>
            <div className="col-span-3">
              <Select onValueChange={(e) => setStatus(e)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ROUTING">For Routing</SelectItem>
                  <SelectItem value="ON_PROCESS">On Process</SelectItem>
                  <SelectItem value="ON_GOING">On Going</SelectItem>
                  <SelectItem value="ON_PROCESS">On Process</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="SIGN_AND_SEAL">For Sign and Seal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Remarks
            </Label>
            <Textarea onChange={(e) => setRemarks(e.target.value)} placeholder="Enter remarks" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              mutate({
                body: {
                  status: status,
                  remarks: remarks,
                },
                params: {
                  id: id,
                },
              });
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
