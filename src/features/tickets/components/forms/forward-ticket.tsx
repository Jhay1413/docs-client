import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import TicketForm from "./ticket-form";
import { ticketingMutationSchema } from "shared-contract";

import { useState, useEffect } from "react";
import { tsr } from "@/services/tsr";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";
import { useParams, useNavigate } from "react-router-dom";

export const ForwardTicketComponent = () => {
  const { id } = useParams(); // Get the ticket ID from the URL

  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [isForwarding, setIsForwarding] = useState(true); // Add this line

  // Fetch the existing ticket details
  const { data: ticketData, isLoading: isLoadingTicket } = tsr.ticketing.getTicketsById.useQuery({
    queryKey: ["ticket", id],
    queryData: { params: { id: id! } },
  });

//   const { mutate } = tsr.ticketing.getTicketsById.useMutation({
//     onSuccess: () => {
//       toast.success("Ticket Forwarded Successfully!");
//       navigate("/dashboard/tickets/list");
//     },
//     onError: (error) => {
//       console.error("Error forwarding ticket:", error);
//       toast.error("Failed to forward ticket. Please try again.");
//     },
//   });

  const form = useForm<z.infer<typeof ticketingMutationSchema>>({
    resolver: zodResolver(ticketingMutationSchema),
    mode: "onSubmit",
    defaultValues: {
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
      dateReceived: ticketData?.body.dateReceived,
      senderId: ticketData?.body.sender.userInfo?.firstName,
      receiverId: ticketData?.body.receiver.userInfo?.firstName || "", // This should be set to the new receiver's ID
      requesteeId: ticketData?.body.requestee.userInfo?.firstName,
      remarks: ticketData?.body.remarks,
      projectId: ticketData?.body.project?.id,
      transactionId: ticketData?.body.transactionId,
      attachments: ticketData?.body.attachments,
    },
  });

//   useEffect(() => {
//     if (ticketData?.body) {
//       form.reset({
//         ticketId: ticketData.body.ticketId,
//         requestType: ticketData.body.requestType,
//         subject: ticketData.body.subject,
//         section: ticketData.body.section,
//         division: ticketData.body.division,
//         status: ticketData.body.status,
//         requestDetails: ticketData.body.requestDetails,
//         priority: ticketData.body.priority,
//         dueDate: ticketData.body.dueDate,
//         dateForwarded: ticketData.body.dateForwarded,
//         dateReceived: ticketData.body.dateReceived,
//         senderId: ticketData.body.sender.id,
//         receiverId: ticketData.body.receiver.id, // This should be set to the new receiver's ID
//         requesteeId: ticketData.body.requestee.id,
//         remarks: ticketData.body.remarks,
//         projectId: ticketData.body.project?.projectName,
//         transactionId: ticketData.body.transactionId,
//         attachments: ticketData.body.attachments,
//       });
//     }
//   }, [ticketData, form]);

  console.log("Ticket data:", ticketData);
  const onSubmit: SubmitHandler<z.infer<typeof ticketingMutationSchema>> = async (data) => {
    // setIsSubmitting(true);
    // mutate({ body: data });
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
            receiver={[]} 
            isForwarding={isForwarding} // Pass the isForwarding state
          />
          
          {/* Submit Button */}
          <Button type="submit" onClick={() => console.log(form.formState.errors)}>Forward Ticket</Button>
        </form>
      </Form>
    </div>
  );
};

export default ForwardTicketComponent;