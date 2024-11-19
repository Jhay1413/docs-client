import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import TicketForm from "./ticket-form";
import { ticketingMutationSchema } from "shared-contract";
import { getCurrentUserId, useCurrentUserRole } from "@/hooks/use-user-hook";
import { useState } from "react";
import { tsr } from "@/services/tsr";
import { toast } from "react-toastify";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const AddTicketComponent = () => {
  const userId = getCurrentUserId();
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const role = useCurrentUserRole();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectectedType, setSelectedType] = useState("");
  const navigate = useNavigate();

  const { mutate,isPending } = tsr.ticketing.createTickets.useMutation({
    onMutate: () => {},
    onSuccess: () => {
      toast.success("Ticket Created !");
      navigate("/dashboard/tickets/list");
    },
    onError: (error) => {
      console.error("Error creating ticket:", error);
      toast.error("Failed to create ticket. Please try again.");
    },
  });

  const { data, isError, error } = tsr.userAccounts.getUsersForTickets.useQuery({
    queryKey: ["usersForTicket", selectedDivision, selectedSection, selectectedType],
    queryData: {
      query: {
        division: selectedDivision,
        section: selectedSection,
        role: role,
        mode: "insert",
      },
    },
  });

  const mutateFn = async (data: z.infer<typeof ticketingMutationSchema>) => {
    console.log(data);
    mutate({ body: data });
  };

  return (
    <div className="flex flex-col gap-4 p-4 w-full h-full bs-white">
      <h1 className="text-4xl">Add Ticket</h1>

      {/* The form */}

      <TicketForm
        selectedDivision={selectedDivision}
        setSelectedDivision={setSelectedDivision}
        setSelectedSection={setSelectedSection}
        selectedSection={selectedSection}
        receiver={data ? data.body : []}
        mutateFn={mutateFn}
        isPending={isPending}
      />
    </div>
  );
};

export default AddTicketComponent;
