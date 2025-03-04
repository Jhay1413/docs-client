// TicketForm.tsx
import { SubmitHandler, useForm, useFormContext } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import FormInput from "@/components/formInput";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import FormTextArea from "@/components/formTextArea";
import { ChangeEvent, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Check, ChevronsUpDown, FileCode, ImageUp, XCircle } from "lucide-react";
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
import axios, { AxiosProgressEvent } from "axios";

import DragNdrop from "@/features/others/drag-drop";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

const baseUrlV2 = import.meta.env.VITE_ENDPOINT;
type Props = {
  selectedDivision?: string;
  setSelectedDivision?: React.Dispatch<React.SetStateAction<string>>;
  selectedSection?: string;
  setSelectedSection?: React.Dispatch<React.SetStateAction<string>>;
  mutateFn: (data: z.infer<typeof ticketingMutationSchema>) => void;
  ticketData?: z.infer<typeof ticketFullDetailsSchema>;
  isPending: boolean;
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
type ticketFiles = {
  name: string;
  loading: number;
}[];

const TicketForm = ({
  selectedDivision,
  setSelectedDivision,
  selectedSection,
  setSelectedSection,
  receiver,
  isForwarding,
  mutateFn,
  isPending,
  ticketData,
}: Props) => {
  const userId = getCurrentUserId();
  const sections = Divisions.find((division) => division.name === selectedDivision || ticketData?.division);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<ticketFiles>([]);
  const [showProgress, setShowProgress] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<ticketFiles>([]);
  const [uploadedKeys, setUploadedKeys] = useState<string[]>([]);

  const form = useForm<z.infer<typeof ticketingMutationSchema>>({
    resolver: zodResolver(ticketingMutationSchema),
    mode: "onChange",
    defaultValues: {
      ticketId: ticketData?.ticketId || "",
      subject: ticketData?.subject || "",
      section: ticketData?.section || "",
      division: ticketData?.division || "",
      status: ticketData?.status || "ROUTING",
      requestDetails: ticketData?.requestDetails || "",
      priority: ticketData?.priority || undefined,
      dueDate: ticketData?.dueDate || "",
      dateForwarded: ticketData?.dateForwarded || new Date().toISOString(),
      dateReceived: null,
      senderId: userId,
      requesteeId: ticketData?.requestee.id || userId,
      projectId: ticketData?.project?.id || null,
      transactionId: ticketData?.transactionId || null,
      attachments: ticketData?.attachments || [],
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof ticketingMutationSchema>> = async (data) => {
    mutateFn({ ...data, attachments: [...data.attachments, ...uploadedKeys] });
  };
  const onError = () => {
    if (form.formState.errors) console.log(form.formState.errors);
    toast.error("Please check all required fields . ", {
      position: "bottom-right",
    });
  };

  const handleFilesSelected = (newFiles: File[]) => {
    handleFileUpload(newFiles);
  };

  const handleFileUpload = async (filesToUpload: File[]) => {
    setShowProgress(true);

    // Reset the loading state for all files before starting new uploads
    const initialFilesState = filesToUpload.map((file) => ({ name: file.name, loading: 0 }));
    setFiles(initialFilesState);

    for (const file of filesToUpload) {
      const formData = new FormData();
      formData.append("thumbnail", file);
      formData.append("company", "Envicomm");
      formData.append("fileName", file.name);

      try {
        const result = await axios.post(`${baseUrlV2}/posts`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (e) => {
            const total = e.total || 1;
            setFiles((prevState) => {
              const newFiles = [...prevState];
              const currentIndex = newFiles.findIndex((f) => f.name === file.name);
              if (currentIndex !== -1) {
                newFiles[currentIndex].loading = Math.floor((e.loaded / total) * 100);
              }
              return newFiles;
            });
          },
        });
        setUploadedKeys((prevKeys) => [...prevKeys, result.data.key]);
        setUploadedFile((prevFiles) => [...prevFiles, { name: file.name, loading: 100 }]);
      } catch (error) {
        toast.error("Something went wrong!");
        console.log(error);
      }
    }
    setShowProgress(false);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFile((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setUploadedKeys((prevKeys) => prevKeys.filter((_, i) => i !== index));
  };

  console.log("selectedSection:", selectedSection);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <div className="grid grid-cols-2 h-full gap-4 w-full p-4 bg-gray-50 rounded-md shadow-lg">
          <div className="col-span-1 w-full">

          <FormInput name="subject" label="Subject* " placeholder="Enter subject" disable={isForwarding} />
          </div>

          {/* Division Select */}

          <div className="">
            {selectedDivision === "Technical Department" && <TicketFormEPD isForwarding={isForwarding} />}
            {selectedDivision === "Operations Department" && <TicketFormIT />}
            {selectedDivision === "Sales/Marketing Department" && <TicketFormMRKT />}
          </div>

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
              <FormItem className="">
                <FormLabel>Section* </FormLabel>

                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      if (setSelectedSection) setSelectedSection(value);
                      console.log(value)
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                    disabled={!selectedDivision || isForwarding}
                  >
                    <SelectTrigger>
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
              <FormItem>
                <FormLabel>Status*</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isForwarding}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ROUTING">For Routing</SelectItem>
                      <SelectItem value="ON_PROCESS">On Process</SelectItem>
                      <SelectItem value="ON_GOING">On Going</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="SIGN_AND_SEAL">For Sign and Seal</SelectItem>
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
              <FormItem>
                <FormLabel>Priority*</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <SelectTrigger>
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
                <FormLabel>Receiver* </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      console.log(value);
                      field.onChange(value); // Ensure this is called
                    }}
                    value={field.value!}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select receiver" />
                    </SelectTrigger>
                    <SelectContent>
                      {receiver.map((user) => (
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
          <div className="col-span-2 ">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1 mb-6">
                <FormTextArea name="requestDetails" label="Request Details*" placeholder="Enter details" disable={isForwarding} />
              </div>

              <div className="col-span-1 mb-6">
                <FormTextArea name="remarks" label="Remarks*" placeholder="Enter remarks" />
              </div>
            </div>
          </div>

          {/* Attachments (Grid Layout) */}
          <div className="col-span-2">
            <div className="grid grid-cols-2 gap-4">
              {/* Drag and Drop Section */}
              <div>
                <p className="font-bold text-sm text-gray-800">Attachments</p>
                <div className="flex w-full flex-col mt-2 items-center justify-center rounded-md border-blue-300 border-dashed border-2">
                  <DragNdrop onFilesSelected={handleFilesSelected} width="100%" height="100%" />
                </div>
              </div>

              {/* Scrollable Progress Display */}
              <ScrollArea className="w-full min-h-full max-h-48 p-4 rounded-md">
                {showProgress && (
                  <div className="flex flex-col gap-2 text-white">
                    {files.map((file, index) => (
                      <div className="flex justify-start items-center gap-2 rounded-md bg-blue-300 p-2" key={index}>
                        <div className="w-20">
                          <FileCode size={32} />
                        </div>
                        <div className="w-1/2">
                          <h1>{file.name}</h1>
                        </div>
                        <div className="flex justify-end w-full">
                          <Progress value={file.loading} className="w-[60%] h-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex flex-col gap-2 text-white">
                  {uploadedFile.map((file, index) => (
                    <div className="flex justify-start items-center gap-2 rounded-md bg-blue-300 p-2" key={index}>
                      <div className="w-20">
                        <FileCode size={32} />
                      </div>
                      <div className="w-full">
                        <h1>{file.name}</h1>
                      </div>
                      <div className="flex justify-end w-full gap-2">
                        <Check size={28} />
                        <XCircle size={28} className="cursor-pointer hover:text-red-500" onClick={() => handleRemoveFile(index)} />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end py-4">
          <Button type="submit" className="w-[256px]" onClick={() => console.log(form.formState.defaultValues)} disabled={isPending}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TicketForm;
