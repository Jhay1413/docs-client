// TicketForm.tsx
import { SubmitHandler, useForm, useFormContext } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import FormInput from "@/components/formInput";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import FormTextArea from "@/components/formTextArea";
import { useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import TicketFormEPD from "./ticket-form-EPD";
import TicketFormMRKT from "./ticket-form-MRKT";
import TicketFormIT from "./ticket-form-IT";
import { Divisions } from "@/data/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { ticketFullDetailsSchema, ticketingMutationSchema } from "shared-contract";
import { z } from "zod";
import { getCurrentUserId } from "@/hooks/use-user-hook";
import { toast } from "react-toastify";

type Props = {
  selectedDivision?: string;
  setSelectedDivision?: React.Dispatch<React.SetStateAction<string>>;
  setSelectedSection?: React.Dispatch<React.SetStateAction<string>>;
  selectedType?: string;
  setSelectedType?: React.Dispatch<React.SetStateAction<string>>;
  mutateFn: (data: z.infer<typeof ticketingMutationSchema>) => void;
  ticketData?: z.infer<typeof ticketFullDetailsSchema>;
  receiver: {
    id: string;
    userInfo: {
      firstName: string;
      lastName: string;
    };
    accountRole: string;
  }[];
  isForwarding?: boolean;
};

const TicketForm = ({
  selectedDivision,
  setSelectedDivision,
  setSelectedSection,
  receiver,
  isForwarding,
  selectedType,
  setSelectedType,
  mutateFn,
  ticketData,
}: Props) => {
  const userId = getCurrentUserId();
  const sections = Divisions.find((division) => division.name === selectedDivision);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof ticketingMutationSchema>>({
    resolver: zodResolver(ticketingMutationSchema),
    mode: "onSubmit",
    defaultValues: {
      ticketId: ticketData?.ticketId || "",
      requestType: ticketData?.requestType || "",
      subject: ticketData?.subject || "",
      section: ticketData?.section || "",
      division: ticketData?.division || "",
      status: ticketData?.status,
      requestDetails: ticketData?.requestDetails || "",
      priority: ticketData?.priority || "",
      dueDate: ticketData?.dueDate || "",
      dateForwarded: ticketData?.dateForwarded || new Date().toISOString(),
      dateReceived: null,
      senderId: ticketData?.sender.id || userId,
      requesteeId: ticketData?.requestee.id || userId,
      remarks: ticketData?.remarks,
      projectId: ticketData?.project?.id || null,
      transactionId: ticketData?.transactionId || null,
      attachments: ticketData?.attachments || [],
    },
  });

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const onSubmit: SubmitHandler<z.infer<typeof ticketingMutationSchema>> = async (data) => {
    console.log(data);
    mutateFn(data);
  };
  const onError = () => {
    if (form.formState.errors) console.log(form.formState.errors);
    toast.error("Please check all required fields . ", {
      position: "bottom-right",
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <div className="grid grid-cols-3 h-full gap-6 p-4 bg-gray-50 rounded-md shadow-lg ">
          <FormField
            control={form.control}
            name="requestType"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Request Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      if (setSelectedType) setSelectedType(value);
                    }}
                    defaultValue={field.value}
                    disabled={isForwarding}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select request type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EPD">EPD</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Subject (Small Input) */}
          <div className="col-span-1 mb-4">
            <FormTextArea name="subject" label="Subject" placeholder="Enter subject" />
          </div>

          {/* Conditional Rendering of Ticket Forms */}
          <div className="col-span-2 ">
            {selectedType === "EPD" && <TicketFormEPD isForwarding={isForwarding} />}
            {selectedType === "IT" && <TicketFormIT />}
            {selectedType === "Marketing" && <TicketFormMRKT />}
          </div>

          <div className="col-span-3 mb-6">
            <FormTextArea name="requestDetails" label="Request Details" placeholder="Enter details" />
          </div>

          {/* Division Select */}

          <FormField
            control={form.control}
            name="division"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel>Division*</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      if (setSelectedDivision) setSelectedDivision(value);

                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                    disabled={isForwarding}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select division" />
                    </SelectTrigger>
                    <SelectContent>
                      {Divisions.map((division) => (
                        <SelectItem key={division.name} value={division.name!}>
                          {division.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Section (Input or Dropdown Select) */}
          <FormField
            control={form.control}
            name="section"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel>Section</FormLabel>

                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      if (setSelectedSection) setSelectedSection(value);
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                    disabled={!selectedDivision || isForwarding}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections?.section?.map((section) => (
                        <SelectItem key={section.value} value={section.value!}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status (Dropdown Select) */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel>Status*</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="On process">On process</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                      <SelectItem value="For Sign and Seal">For Sign and Seal</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Priority (Dropdown Select) */}
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel>Priority*</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                      <SelectItem value="Important">Important</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Due Date (Input Date Picker) */}
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel>Due Date*</FormLabel>
                <FormControl>
                  {/* <input
                type="date"
                className="w-full h-10 px-4 text-sm border border-gray-300 rounded-md"
                {...field}
                disabled={isForwarding}
              /> */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                        disabled={isForwarding}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        onSelect={(value) => {
                          field.onChange(new Date(value!).toISOString());
                        }}
                        initialFocus
                        disabled={isForwarding}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Receiver (Input or Dropdown Select) */}
          <FormField
            control={form.control}
            name="receiverId"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel>Receiver</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select receiver" />
                    </SelectTrigger>
                    <SelectContent>
                      {(receiver ?? []).map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.userInfo.firstName} {user.userInfo.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Remarks (Medium TextArea) */}
          <div className="col-span-3">
            <FormTextArea name="remarks" label="Remarks" placeholder="Enter remarks" />
          </div>

          {/* Attachments (File Input with Button Trigger) */}
        </div>
        <div className="flex justify-end py-4">
          <Button type="submit" className="w-[256px]" onClick={() => console.log(form.formState.errors)}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TicketForm;
