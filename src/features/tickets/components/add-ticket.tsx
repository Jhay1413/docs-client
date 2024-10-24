import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { z } from "zod";
import TicketForm from "./ticket-form";
import { ticketingMutationSchema } from "shared-contract";

export const AddTicketComponent = () => {
  const form = useForm<z.infer<typeof ticketingMutationSchema>>({
    resolver: zodResolver(ticketingMutationSchema),
    defaultValues: {
      ticketId: "",
      requestType: "",
      subject: "",
      section: "",
      division: "",
      status: "",
      requestDetails: "",
      priority: "",
      dueDate: "", // Make sure to match the format here as well
      dateForwarded: new Date().toISOString(),
      dateReceived: null,
      senderId: "",
      receiverId: "",
      requesteeId: "",
      remarks: null,
      projectId: null, // Use undefined instead of null
      transactionId: null,
      attachments: null,
      file: undefined,
    },
  });

  // The submit handler
  const onSubmit: SubmitHandler<z.infer<typeof ticketingMutationSchema>> = (data) => {
    console.log("Form data submitted:", data);
  };

  return (
    <div className="flex flex-col gap-4 p-4 w-full h-full bg-white">
      <h1 className="text-4xl">Add Ticket</h1>

      {/* The form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Ticket Form Fields */}
          <TicketForm />

          {/* Submit Button */}
          <Button type="submit" onClick={()=>console.log(form.formState.errors)}>Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default AddTicketComponent;
