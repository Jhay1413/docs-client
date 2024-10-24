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
import { useCurrentUserRole } from "@/hooks/use-user-hook";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { tsr } from "@/services/tsr";
import { useDebounce } from "use-debounce";
import { keepPreviousData } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

const TicketForm = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const { control, watch } = useFormContext(); // Ensure you're using it inside a FormProvider
  const requestType = watch("requestType"); // Watch the requestType field
  const [ selectedDivision, setSelectedDivision ] = useState("");
  const [ selectedSection, setSelectedSection ] = useState("");
  const role = useCurrentUserRole();
  
  const sections = Divisions.find(
    (division) => division.name === selectedDivision
  ); // Ensure you're using it inside a FormProvider
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500); // Adjust the delay as needed
  if (!control) {
    return <div>Error: No form context found!</div>; // Optional: Handle if context is missing
  }

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const { data, isError, error } = tsr.company.fetchCompanyProjectsBySearch.useQuery({
    queryKey: ["projects", debouncedSearchQuery],
    queryData: {
      query: {
        projectName: debouncedSearchQuery,
      },
    },

    placeholderData: keepPreviousData,
  });
  console.log(data);
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
                </SelectContent >
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Subject (Small Input) */}
      <FormInput name="subject" label="Subject" placeholder="Enter subject" />

      <div className="col-span-2">
        {/* Conditionally render the EPD form */}
        {requestType === "EPD" && <TicketFormEPD />}
        {requestType === "IT" && <TicketFormIT />}
        {requestType === "Marketing" && <TicketFormMRKT />}
      </div>
      {/* Request Details (Large TextArea) */}
      <div className="col-span-3 mb-6">
        <FormTextArea name="requestDetails" label="Request Details" placeholder="Enter details" />
      </div>

{/* Division (Dropdown Select) */}
<FormField
        control={control}
        name="division"
        render={({ field }) => (
          <FormItem className="col-span-1">
            <FormLabel>Division</FormLabel>
            <FormControl>
              <Select onValueChange={(value) => {
                          setSelectedDivision(value);
                          field.onChange(value);
                        }}
                         defaultValue={field.value}>
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

      {/* Section (Dropdown Select) */}
      <FormField
        control={control}
        name="section"
        render={({ field }) => (
          <FormItem className="col-span-1">
            <FormLabel>Section</FormLabel>
            <FormControl>
              <Select                         onValueChange={(value) => {
                          setSelectedSection(value);
                          field.onChange(value);
                        }}
                        defaultValue={field.value}
                        disabled={
                          !selectedDivision
                        }>
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
              <Select
                onValueChange={field.onChange}
                value={field.value || ""} // Ensure it handles an empty state properly
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
            <FormLabel>Due Date</FormLabel>
            <FormControl>
              {/* <input
                type="date"
                className="w-full h-10 px-4 text-sm border border-gray-300 rounded-md"
                {...field}
              /> */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
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
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
 )}
      />

      {/* Sender (Dropdown Select) */}
      {/* <FormField
        control={control}
        name="sender"
        render={({ field }) => (
<<<<<<< HEAD
          <FormItem className="flex col-span-1 flex-col w-full justify-center">
            <FormLabel>Project</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button variant="outline" role="combobox" className={cn(" justify-between", !field.value && "text-muted-foreground")}>
                    {selectedProject ? selectedProject : "Select Project..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command shouldFilter={false}>
                  <CommandInput placeholder="Search Company..." onValueChange={(e) => setSearchQuery(e)} />
                  <CommandList>
                    <CommandEmpty>No project found.</CommandEmpty>
                    <CommandGroup>
                      {data?.body?.map((data) => (
                        <CommandItem
                          value={data.id}
                          key={data.id}
                          onSelect={() => {
                            setSelectedProject(data.projectName);
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", data.id === field.value ? "opacity-100" : "opacity-0")} />
                          {data.projectName}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
=======
          <FormItem className="col-span-1">
            <FormLabel>Sender</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select sender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="John Doe">John Doe</SelectItem>
                  <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                  <SelectItem value="Mark Johnson">Mark Johnson</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
>>>>>>> dev
            <FormMessage />
          </FormItem>
        )}
      /> */}

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
      {/* <FormField
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
      /> */}

      {/* Remarks (Medium TextArea) */}
      <div className="mb-4">
      <FormTextArea name="remarks" label="Remarks" placeholder="Enter remarks" />
      </div>
      

      {/* Attachments (File Input with Button Trigger) */}
      <FormField
        control={control}
        name="file"
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
                <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => field.onChange(e.target.files?.[0])} />
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