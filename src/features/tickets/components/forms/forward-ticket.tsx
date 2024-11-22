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
import { useParams, useNavigate, NavLink, useLocation } from "react-router-dom";
import { getCurrentUserId, useCurrentUserRole } from "@/hooks/use-user-hook";
import { ArrowLeft } from "lucide-react";

export const ForwardTicketComponent = () => {
  const { id } = useParams();
  const role = useCurrentUserRole();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectectedType, setSelectedType] = useState("");
  const navigate = useNavigate();
  const { data: ticketData, isLoading: isLoadingTicket } = tsr.ticketing.getTicketsById.useQuery({
    queryKey: ["ticket", id],
    queryData: { params: { id: id! } },
  });

  const { data, isError, error } = tsr.userAccounts.getUsersForTickets.useQuery({
    queryKey: ["usersForTicket"],
    queryData: {
      query: {
        division: ticketData?.body.division!,
        section: ticketData?.body.section!,
        role: role,
        mode: "forward",
        requesteedId: ticketData?.body.requestee.id,
      },
    },
  });

  const isForwarding = ticketData?.body.dateReceived !== null;

  const { mutate, isPending } = tsr.ticketing.forwardTickets.useMutation({
    onMutate: () => {},
    onSuccess: () => {
      toast.success("Ticket Forwarded !");
      navigate("/dashboard/tickets/list");
    },
    onError: (error) => {
      console.error("Error forwarding ticket:", error);
      toast.error("Failed to forward ticket. Please try again.");
    },
  });

  console.log("Ticket data:", ticketData);
  const onSubmit = async (data: z.infer<typeof ticketingMutationSchema>) => {
    setIsSubmitting(true);
    mutate({
      body: data,
      params: { id: id! },
    });
  };

  if (isLoadingTicket) {
    return <div>Loading ticket details...</div>;
  }

  const location = useLocation();
  // Set previousPath to the ticket inbox route
  const previousPath = `/dashboard/tickets/inbox/${getCurrentUserId()}`; // Assuming you want to go back to the user's inbox

  return (
    <div>
      <Button
        className="sticky top-0 bg-white bg-opacity-50 border-none rounded-lg p-2 shadow-md"
        onClick={() => navigate(previousPath, { state: { from: location.pathname}  }, )} // Navigate back with state
      >
        <ArrowLeft className="text-black hover:text-white" />
      </Button>
   
      <div className="flex flex-col gap-4 p-4 w-full h-full bs-white">
        <h1 className="text-4xl">Forward Ticket</h1>

        {/* The form */}

        <TicketForm receiver={data ? data?.body : []} isForwarding={isForwarding} ticketData={ticketData!.body!} mutateFn={onSubmit} isPending={isPending}/>
      </div>
    </div>
  );
};

export default ForwardTicketComponent;
