import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import TicketForm from "./ticket-form";
import { ticketEditSchema, ticketingMutationSchema } from "shared-contract";
import { useState, useEffect } from "react";
import { tsr } from "@/services/tsr";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";
import { useParams, useNavigate } from "react-router-dom";
import { getCurrentUserId, useCurrentUserRole } from "@/hooks/use-user-hook";

export const ForwardTicketComponent = () => {
  const { id } = useParams();
  const role = useCurrentUserRole();
  const currentUserId = getCurrentUserId();
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [isForwarding, setIsForwarding] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectectedType, setSelectedType] = useState("");
  const navigate = useNavigate();

  // Fetch the existing ticket details
  const { data: ticketData, isLoading: isLoadingTicket } = tsr.ticketing.getTicketsById.useQuery({
    queryKey: ["ticket", id],
    queryData: { params: { id: id! } },
  });

  const form = useForm<z.infer<typeof ticketEditSchema>>({
    resolver: zodResolver(ticketingMutationSchema),
    mode: "onSubmit",
    defaultValues: {
      id: ticketData?.body.id || "",
      ticketId: ticketData?.body.ticketId || "",
      requestType: ticketData?.body.requestType || "",
      subject: ticketData?.body.subject || "",
      section: ticketData?.body.section || "",
      division: ticketData?.body.division || "",
      status: ticketData?.body.status,
      requestDetails: ticketData?.body.requestDetails || "",
      priority: ticketData?.body.priority || "",
      dueDate: ticketData?.body.dueDate || "", 
      dateForwarded: ticketData?.body.dateForwarded,
      dateReceived: null,
      senderId: currentUserId,
      requesteeId: ticketData?.body.requestee.id,
      remarks: ticketData?.body.remarks,
      projectId: ticketData?.body.project?.id || null,
      transactionId: ticketData?.body.transactionId,
      attachments: ticketData?.body.attachments,
    },
  });

  const { data, isError, error } = tsr.userAccounts.getUsersForTickets.useQuery({
    queryKey: ["usersForTicket"],
    queryData: {
      query: {
        division: ticketData?.body.division!,
        section: ticketData?.body.section!,
        role: role,
        mode: "forward",
        type: ticketData?.body.requestType || '',
        requesteedId:  ticketData?.body.requestee.id,
      },
    },
  });

  const { mutate } = tsr.ticketing.forwardTickets.useMutation({
    onMutate: () => { },
    onSuccess: () => {
      form.reset();
      toast.success("Ticket Forwarded !");
      navigate("/dashboard/tickets/list");
    },
    onError: (error) => {
      console.error("Error forwarding ticket:", error);
      toast.error("Failed to forward ticket. Please try again.");
    },
  });

  console.log("Ticket data:", ticketData);
  const onSubmit: SubmitHandler<z.infer<typeof ticketEditSchema>> = async (data) => {
    setIsSubmitting(true);
    mutate({ 
      body: data, 
      params: { id: id! }
    });
  };

  if (isLoadingTicket) {
    return <div>Loading ticket details...</div>;
  }

  return (
    <div className="flex flex-col gap -4 p-4 w-full h-full bs-white">
      <h1 className="text-4xl">Forward Ticket</h1>

      {/* The form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Ticket Form Fields */}
          <TicketForm 
            selectedDivision={selectedDivision} 
            setSelectedDivision={setSelectedDivision} 
            setSelectedSection={setSelectedSection} 
            receiver={data ? data?.body : []}
            isForwarding={isForwarding}
          />
          
          {/* Submit Button */}
          <Button type="submit" onClick={() => console.log(form.formState.errors)}>Forward Ticket</Button>
        </form>
      </Form>
    </div>
  );
};

export default ForwardTicketComponent;