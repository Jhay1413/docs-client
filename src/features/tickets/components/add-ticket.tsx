import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import TicketForm from "./ticket-form";
import { ticketingMutationSchema } from "shared-contract";
import { getCurrentUserId, useCurrentUserRole } from "@/hooks/use-user-hook";
import { useState } from "react";
import { tsr } from "@/services/tsr";
import { toast } from "react-toastify";
import { useMutation } from "react-query";

export const AddTicketComponent = () => {
  const userId = getCurrentUserId();
  const [ selectedDivision, setSelectedDivision ] = useState("");
  const [ selectedSection, setSelectedSection ] = useState("");
  const role = useCurrentUserRole();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isError, error } = tsr.userAccounts.getUsersForTickets.useQuery({
    queryKey: ["usersForTicket", selectedDivision, selectedSection],
    queryData: {
      query: {
        division: selectedDivision,
        section: selectedSection,
        role: role,
        mode: "insert",
      },
    },
  });

  const form = useForm<z.infer<typeof ticketingMutationSchema>>({
    resolver: zodResolver(ticketingMutationSchema),
    mode:"onSubmit",
    defaultValues: {
      ticketId: "",
      requestType: "",
      subject: "",
      section: "",
      division: "",
      status: "",
      requestDetails: "",
      priority: "",
      dueDate: "", 
      dateForwarded: new Date().toISOString(),
      dateReceived: null,
      senderId: userId,
      receiverId: "",
      requesteeId: userId,
      remarks: null,
      projectId: null,
      transactionId: null,
      attachments: null,
      file: undefined,
    },
  });

  const mutateFn = async (data: z.infer<typeof ticketingMutationSchema>, setSubmitting: (value: boolean) => void) => {
    try {
      setSubmitting(true);
      await tsr.ticketing.createTickets.mutate({body: data});
      toast.success("Ticket created successfully!");
      form.reset();
    } catch (error) {
      toast.error("Failed to create ticket. Please try again.");
      console.error("Error creating ticket:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit: SubmitHandler<z.infer<typeof ticketingMutationSchema>> = async (data) => {
    mutateFn(data, setIsSubmitting);
  };
  
  return (
    <div className="flex flex-col gap-4 p-4 w-full h-full bs-white">
      <h1 className="text-4xl">Add Ticket</h1>

      {/* The form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Ticket Form Fields */}
          <TicketForm selectedDivision={selectedDivision} setSelectedDivision={setSelectedDivision} setSelectedSection={setSelectedSection} receiver={data ? data.body : []}/>

          {/* Submit Button */}
          <Button type="submit" onClick={()=>console.log(form.formState.errors)}>Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default AddTicketComponent;
