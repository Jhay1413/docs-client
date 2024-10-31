// TicketForm.tsx
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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


type Props = {
  selectedDivision: string;
  setSelectedDivision: React.Dispatch<React.SetStateAction<string>>;
  setSelectedSection: React.Dispatch<React.SetStateAction<string>>;
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

const TicketForm = ({ selectedDivision, setSelectedDivision, setSelectedSection, receiver, isForwarding }: Props) => {
  const { control, watch } = useFormContext();
  const requestType = watch("requestType");

  const sections = Divisions.find(division => division.name === selectedDivision);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6 p-4 bg-gray-50 rounded-md shadow-lg mb-4">
      
      {/* Subject (Small Input) */}
      <div className="col-span-2 mb-6">
        <FormTextArea name="subject" label="Subject" placeholder="Enter subject" />
      </div>

      {/* Conditional Rendering of Ticket Forms */}
      <div className="col-span-2">
        {requestType === "EPD" && <TicketFormEPD isForwarding={isForwarding} />}
        {requestType === "IT" && <TicketFormIT />}
        {requestType === "Marketing" && <TicketFormMRKT />}
      </div>

      <div className="col-span-3 mb-6">
        <FormTextArea name="requestDetails" label="Request Details" placeholder="Enter details" />
      </div>

      {/* Division Select */}
      <FormField
        control={control}
        name="division"
        render={({ field }) => (
          <FormItem className="col-span-1">
            <FormLabel>Division*</FormLabel>
            <FormControl>
              <Select onValueChange={(value) => {
                          setSelectedDivision(value);
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
        control={control}
        name="section"
        render={({ field }) => (
          <FormItem className="col-span-1">
            <FormLabel>Section</FormLabel>
            {isForwarding ? (
              <FormControl>
                <input
                  type="text"
                  className="w-full h-10 px-4 text-sm border border-gray-300 rounded-md"
                  {...field}
                  placeholder="Enter section"
                  disabled
                  readOnly // Make it read-only during forwarding
                />
              </FormControl>
            ) : (
              <FormControl>
                <Select onValueChange={(value) => {
                  setSelectedSection(value);
                  field.onChange(value);
                }}
                defaultValue={field.value}
                disabled={!selectedDivision}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections?.section?.map((section) => (
                      <SelectItem
                        key={section.value}
                        value={section.value!}
                      >
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Status (Dropdown Select) */}
      <FormField
        control={control}
        name="status"
        render={({ field }) => (
          <FormItem className="col-span-1">
            <FormLabel>Status*</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isForwarding}>
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
        control={control}
        name="priority"
        render={({ field }) => (
          <FormItem className="col-span-1">
            <FormLabel>Priority*</FormLabel>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                value={field.value || ""} // Ensure it handles an empty state properly
                disabled={isForwarding}
              >
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
        control={control}
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
                  <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")} disabled={isForwarding}>
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
        control={control}
        name="receiverId"
        render={({ field }) => (
          <FormItem className="col-span-1">
            <FormLabel>Receiver</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value} >
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
      <div className="mb-4">
        <FormTextArea name="remarks" label="Remarks" placeholder="Enter remarks" />
      </div>

      {/* Attachments (File Input with Button Trigger) */}
      <FormField
        control={control}
        name="file"
        render={({ field }) => (
          <FormItem className="col-span-3 mt-4">
            <FormLabel>Attachments</FormLabel>
            <FormControl>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={handleFileUploadClick}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                  disabled={isForwarding}
                >
                  Upload File
                </button>
                <span>{field.value ? field.value.name : "No file chosen"}</span>
                {/* Hidden File Input */}
                <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => field.onChange(e.target.files?.[0])} disabled={isForwarding} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TicketForm;