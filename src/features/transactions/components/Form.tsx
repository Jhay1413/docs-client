import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  TtransactionDetails,
  transactionData,
} from "../schema/TransactionSchema";
import { checkList } from "@/data/checklist";
import FormInput from "@/components/formInput";
import { Divisions } from "@/data/data";
import { useMutation } from "@tanstack/react-query";
import { uploadMultipleFiles } from "@/services/uploadFile";
import { newTransaction } from "../services/transactionApi";
import { getCurrentUserId, useCurrentDivision } from "@/hooks/use-user-hook";
import { toast } from "react-toastify";

type fileProps = {
  name: string;
  file: File;
};
export const TransactionForm = () => {
  const [team, setTeam] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [applicationType, setApplicationType] = useState("");
  const [files, setFiles] = useState<fileProps[]>([]);
  const [isLoading,setIsLoading] = useState(false);
  const temp_section = checkList.find((check) => check.name === team);
  const userId = getCurrentUserId();
  const currentDivision = useCurrentDivision();
  const attachmentList = temp_section?.application.find(
    (check) => check.value === applicationType
  );

  const sections = Divisions.find(
    (division) => division.name === selectedDivision
  );

  const form = useForm<TtransactionDetails>({
    resolver: zodResolver(transactionData),
    mode: "onChange",
    defaultValues: {
      transactionId: "",
      documentType: "",
      subject: "",
      company: "Envicomm Corporation",
      forwardedTo: "asdsadsa",
      remarks: "",
      createdBy: userId,
      fromDepartment: currentDivision,
      toDepartment: "",
      dueDate: new Date(),
      forwardedBy: userId,
      dateForwarded: new Date(), // Default value is current date
      team: "",
      documentSubType: "",
    },
  });


  const transactionMutation = useMutation(({
    mutationFn : newTransaction,
    onSuccess: (data) => {
      setIsLoading(false);
      toast.success("Transaction Created Successfully");
      console.log(data);
    },
    onError : (data) => {
      setIsLoading(false);
      toast.error("Error creating transaction");
      console.log(data)
      throw new Error("Error uploading file");
    },
    
  }))
  const onSubmit: SubmitHandler<TtransactionDetails> = async (transactionData) => {
    setIsLoading(true);

    const formData = new FormData();

    files.forEach((file,index) => {
      formData.append("files", file.file);
      formData.append(`fileNames[${index}]`, file.name);
    });
    const uploadFile = await uploadMultipleFiles(formData);
    if(!uploadFile){
      
    }
    const data = uploadFile.data.data
    const payload = {...transactionData,fileData: data}
   
    transactionMutation.mutate(payload);
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const name = e.target.name;

    if (file) {
      setFiles((prevFiles) => [...prevFiles, { name, file }]);
    }
  };
  return (
    <div className="w-full h-full bg-white p-4 rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-3 gap-12 ">
            <FormInput
              placeholder="Transaction Id "
              label="Transaction ID"
              name="transactionId"
            />
            <FormInput
              placeholder="Company"
              label="Company"
              name="company"
              disable
            />
            <FormInput placeholder="Subject" label="Subject" name="subject" />
            <FormField
              control={form.control}
              name="toDepartment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        setSelectedDivision(value);
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {Divisions.map((division) => (
                          <SelectItem
                            key={division.name}
                            value={division.name!}
                          >
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
            <FormField
              control={form.control}
              name="team"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>team</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        setTeam(value);
                        field.onChange(value);
                      }}
                      disabled={!selectedDivision}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select team" />
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
            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Document Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="application">APPLICATION</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="documentSubType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Sub Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setApplicationType(value);
                      }}
                      disabled={!team}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Document Sub" />
                      </SelectTrigger>
                      <SelectContent>
                        {temp_section?.application.map((type) => (
                          <SelectItem value={`${type.value}`}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="forwardedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forwarded To</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Forward to " />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 ">
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(value) => field.onChange(value)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateForwarded"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 ">
                  <FormLabel>Date Forwarded</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(value) => field.onChange(value)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="">
              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter Remarks" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col space-y-4 mt-12">
            <h1 className="text-2xl">List of Attachments Required</h1>
            <Table>
              <TableCaption>A list of your required attachments.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attachmentList?.checkList?.map((check) => (
                  <TableRow>
                    <TableCell className="font-medium w-[200px]">
                      {check.name}
                    </TableCell>
                    <TableCell>Not Submitted</TableCell>
                    <TableCell className="flex justify-end">
                      <div className="grid w-full max-w-sm items-center gap-1.5 justify-end">
                        <Input
                          name={`${check.value}`}
                          onChange={(e) => handleFileChange(e)}
                          type="file"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-24 flex justify-end ">
            <Button
              type="submit"
              onClick={() => console.log(form.formState.errors)}
              disabled={!form.formState.isValid || isLoading}
            >
              {isLoading ? "Loading..." : "Submit"}
             
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
