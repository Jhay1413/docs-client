// TicketForm.tsx
import { SubmitHandler, useForm, useFormContext } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import FormInput from "@/components/formInput";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import FormTextArea from "@/components/formTextArea";
import { ChangeEvent, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Check, ChevronsUpDown, FileCode, ImageUp } from "lucide-react";
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
import { Progress } from "@radix-ui/react-progress";
import { ScrollArea } from "@/components/ui/scroll-area";

const baseUrlV2 = import.meta.env.VITE_ENDPOINT;
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
type ticketFiles = {
  name: string;
  loading: number;
}[];


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
      senderId: userId,
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
    console.log("ASdsad");
    mutateFn({...data,attachments:uploadedKeys});
  };
  const onError = () => {
    if (form.formState.errors) console.log(form.formState.errors);
    toast.error("Please check all required fields . ", {
      position: "bottom-right",
    });
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files![0];
    const formData = new FormData();

    if (!files) {
      throw new Error("No file attached !");
    }
    const fileName = files.name;
    const fileSubString = files.name.length > 12 ? `${files.name.substring(0, 13)}... .${files.name.split(".")[1]}` : files.name;

    formData.append("thumbnail", files);
    formData.append("company", "Envicomm");
    formData.append("fileName", fileName);

    setFiles((prevState) => [...prevState, { name: fileSubString, loading: 0 }]);
    setShowProgress(true);

    try {
      const result = await axios.post(`${baseUrlV2}/posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },

        onUploadProgress: (e: AxiosProgressEvent) => {
          const total = e.total || 1;
          setFiles((prevState) => {
            const newFiles = [...prevState];
            newFiles[newFiles.length - 1].loading = Math.floor((e.loaded / total) * 100);
            return newFiles;
          });
          if (e.loaded == total) {
            setUploadedFile([...uploadedFile, { name: fileSubString, loading: 100 }]);
            setFiles([]);
            setShowProgress(false);
          }
        },
      });
      setUploadedKeys((prevKeys) => [...prevKeys, result.data.key]);
    } catch (error) {
      toast.error("Something went wrong !");
      console.log(error);
    }
  };
 

  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <div className="grid grid-cols-3 h-full gap-6 p-4 bg-gray-50 rounded-md shadow-lg ">
          <div className="col-span-3 ">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="requestType"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Request Type* </FormLabel>
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
                <FormInput name="subject" label="Subject* " placeholder="Enter subject" disable={isForwarding} />
              </div>
              <div className="">
                {selectedType === "EPD" && <TicketFormEPD isForwarding={isForwarding} />}
                {selectedType === "IT" && <TicketFormIT />}
                {selectedType === "Marketing" && <TicketFormMRKT />}
              </div>
            </div>
          </div>
          {/* <div className="col-span-3 grid grid-cols-2 gap-4 ">
            <div className="col-span-2 grid gap-4 grid-cols-2 ">
              <div className="flex flex-col gap-4  bg-blue-500 ">
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
                <FormInput name="subject" label="Subject" placeholder="Enter subject" />
              </div>
              <div className="grid grid-cols-2 ">
                {selectedType === "EPD" && <TicketFormEPD isForwarding={isForwarding} />}
                {selectedType === "IT" && <TicketFormIT />}
                {selectedType === "Marketing" && <TicketFormMRKT />}
              </div>
            </div>

          
          </div> */}

          {/* Conditional Rendering of Ticket Forms */}

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
              <FormItem>
                <FormLabel>Section* </FormLabel>

                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      if (setSelectedSection) setSelectedSection(value);
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="On process">On process</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
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
          <div className="col-span-3 ">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1 mb-6">
                <FormTextArea name="requestDetails" label="Request Details" placeholder="Enter details" />
              </div>

              <div className="col-span-1 mb-6">
                <FormTextArea name="remarks" label="Remarks" placeholder="Enter remarks" />
              </div>
            </div>
          </div>
          
          {/* Attachments (Medium Div) */}
          <div className="col-span-3 ">
            <div className="grid grid-cols-2 gap-4">
              <div className="">
                 <p className="font-bold text-sm text-gray-800">Attachments</p>
                  <div className="flex w-full flex-col mt-2 items-center justify-center rounded-md border-blue-300  border-dashed border-2 h-48">
                      <p className="text-xl">Upload File</p>
                      <div className="flex items-center justify-center ">
                        <input type="file" hidden ref={fileInputRef} onChange={uploadFile} />
                        <div className="flex items-center justify-center" onClick={handleFileInputClick}>
                          <ImageUp className=" w-24 h-24 bg-blue-200 rounded-xl text-blue-500" />
                        </div>
                      </div>
                  </div>
              </div>
              <ScrollArea className="w-full min-h-full max-h-48 p-4 rounded-md">
                {showProgress && (
                <div className="flex flex-col gap-2 text-white">
                  {files.map((file, index) => (
                    <div className="flex justify-start items-center gap-2 rounded-md bg-blue-300 p-2 " key={index}>
                      <div className="w-20">
                        <FileCode size={32} />
                      </div>
                      <div className="w-1/2 ">
                        <h1>{file.name}</h1>
                      </div>
                      <div className="flex justify-end w-full">
                        <Progress value={file.loading} className="w-[60%] h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              
                )}
                <div className="flex flex-col gap-2 text-white">
                  {uploadedFile.map((file, index) => (
                    <div className="flex justify-start items-center gap-2 rounded-md bg-blue-300 p-2  " key={index}>
                      <div className="w-20">
                        <FileCode size={32} />
                      </div>

                      <div className="w-full ">
                        <h1>{file.name}</h1>
                      </div>
                      <div className="flex justify-end w-full">
                        <Check />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
           
            

            
          </div>
          {/* Attachments (File Input with Button Trigger) */}
        </div>
        <div className="flex justify-end py-4">
          <Button type="submit" className="w-[256px]" onClick={() => console.log(form.formState.defaultValues)}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TicketForm;
