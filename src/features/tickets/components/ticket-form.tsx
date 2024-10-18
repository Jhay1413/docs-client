import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import FormInput from "@/components/formInput";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import FormTextArea from "@/components/formTextArea";
import { useRef } from "react";

const TicketForm = () => {
  const { control } = useFormContext(); // Ensure you're using it inside a FormProvider

  if (!control) {
    return <div>Error: No form context found!</div>; // Optional: Handle if context is missing
  }

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6 p-4 bg-gray-50 rounded-md shadow-lg mb-4">
      {/* Request Type (Dropdown Select) */}
      <FormField
        control={control}
        name="requestType"
        render={({ field }) => (
          <FormItem className="col-span-1">
            <FormLabel>Request Type</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
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
      <FormInput name="subject" label="Subject" placeholder="Enter subject" />

      {/* Request Details (Large TextArea) */}
      <div className="col-span-3 mb-6">
        <FormTextArea name="requestDetails" label="Request Details" placeholder="Enter details" />
      </div>

      {/* Section (Dropdown Select) */}
      <FormField
        control={control}
        name="section"
        render={({ field }) => (
          <FormItem className="col-span-1">
            <FormLabel>Section</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select section" />
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

      {/* Division (Dropdown Select) */}
      <FormField
        control={control}
        name="division"
        render={({ field }) => (
          <FormItem className="col-span-1">
            <FormLabel>Division</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select division" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Team Leader">Team Lead</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
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
            <FormLabel>Status</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="On process">On process</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
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
            <FormLabel>Priority</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
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
            <FormLabel>Due Date</FormLabel>
            <FormControl>
              <input
                type="date"
                className="w-full h-10 px-4 text-sm border border-gray-300 rounded-md"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Project (Dropdown Select) */}
      <FormField
        control={control}
        name="project"
        render={({ field }) => (
          <FormItem className="col-span-1">
            <FormLabel>Project</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Project A">Project A</SelectItem>
                  <SelectItem value="Project B">Project B</SelectItem>
                  <SelectItem value="Project C">Project C</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Receiver (Dropdown Select) */}
      <FormField
        control={control}
        name="receiver"
        render={({ field }) => (
          <FormItem className="col-span-1">
            <FormLabel>Receiver</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select receiver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="John Doe">John Doe</SelectItem>
                  <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                  <SelectItem value="Mark Johnson">Mark Johnson</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Requestee (Dropdown Select) */}
      <FormField
        control={control}
        name="requestee"
        render={({ field }) => (
          <FormItem className="col-span-1">
            <FormLabel>Requestee</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select requestee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Requestee 1">Requestee 1</SelectItem>
                  <SelectItem value="Requestee 2">Requestee 2</SelectItem>
                  <SelectItem value="Requestee 3">Requestee 3</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Remarks (Medium TextArea) */}
      <FormTextArea name="remarks" label="Remarks" placeholder="Enter remarks" />

      {/* Attachments (File Input with Button Trigger) */}
      <FormField
        control={control}
        name="attachments"
        render={({ field }) => (
          <FormItem className="col-span-3">
            <FormLabel>Attachments</FormLabel>
            <FormControl>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={handleFileUploadClick}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  Upload File
                </button>
                <span>{field.value ? field.value.name : "No file chosen"}</span>
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
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
