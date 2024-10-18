import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ticketingFormData } from "../schema/ticketsSchema";
import { z } from "zod";
import TicketForm from "./ticket-form";

export const AddTicketComponent = () => {
  // We're not using mutation here, so no mutation hook

  const form = useForm<z.infer<typeof ticketingFormData>>({
    resolver: zodResolver(ticketingFormData),
    defaultValues: {
      ticketId: "",
      subject: "",
      section: "",
      division: "",
      status: "",
      requestDetails: "",
      priority: "low",
      dueDate: "", // Make sure to match the format here as well
      senderId: "",
      receiverId: "",
      requesteeId: "",
      remarks: null,
      projectId: null, // Replace null with undefined
      transactionId: null, // Replace null with undefined
      attachments: null, // Replace null with undefined
    },
  });

  // We'll skip submission for now by commenting out the submit handler
  // const onSubmit: SubmitHandler<z.infer<typeof ticketingFormData>> = (data) => {
  //   // No mutation logic for now
  //   console.log("Form data:", data);
  // };

  return (
    <div className="flex flex-col gap-4 p-4 w-full h-full bg-white">
      <h1 className="text-4xl">Add Ticket</h1>
      <Form {...form}>
        <form>
          {/* Add your form fields here */}
          <TicketForm></TicketForm>
          <Button type="submit" >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};
