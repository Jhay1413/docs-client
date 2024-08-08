import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
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
  SelectContent, SelectItem,
  SelectTrigger,
  SelectValue
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

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

import FormInput from "@/components/formInput";
import { Divisions } from "@/data/data";
import { CompanyInfo } from "@/features/companies";
import {
  getCurrentUserId,
  useCurrentUserRole,
} from "@/hooks/hooks/use-user-hook";
import { docRoute } from "@/data/doc-route";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  departmentEntities,
  transactionFormData,
} from "../schema/TransactionSchema";
import { useCurrentDivision } from "@/hooks/use-user-hook";
import FormTextArea from "@/components/formTextArea";
import { Label } from "@/components/ui/label";
import { getSignUrlForView } from "../services/getSignedUrl";
import { checkList } from "@/data/checklist-new";

import { Check, ChevronsUpDown } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useTransactions } from "../hooks/query-gate";
import { useForwardedToUser } from "../hooks/custom-hook";

type props = {
  company: z.infer<typeof CompanyInfo>[] | undefined;
  method?: string;
  defaultValue?: z.infer<typeof transactionFormData>;
  mutateFn: (
    data: z.infer<typeof transactionFormData>,
    isSubmitting: (value: boolean) => void
  ) => void;
};
export const TransactionForm = ({
  company,
  method,
  defaultValue,
  mutateFn,
}: props) => {
  const role = useCurrentUserRole();
  const currentDivision = useCurrentDivision();
  const userId = getCurrentUserId();
  const route = docRoute.find((data) => data.name === role);
  const { entities } = useTransactions(
    "transactionEntities",
    "v2/departmentEntities"
  );

  const validateEntities = z.array(departmentEntities).safeParse(entities.data);
  const [selectedCompany, setSelectedCompany] = useState<string>(
    defaultValue?.companyId || ""
  );
  const fileInputRef = useRef<(HTMLInputElement | null)[]>([]);
  const [team, setTeam] = useState(defaultValue?.team || "");
  const [selectedDivision, setSelectedDivision] = useState(
    defaultValue?.targetDepartment || ""
  );
  const [subType, setSubType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const temp_section = checkList.find((check) => check.name === team);
  const attachmentList = useMemo(
    () => temp_section?.application.find((check) => check.name === subType),
    [subType, temp_section]
  );
  const sections = Divisions.find(
    (division) => division.name === selectedDivision
  );
  const filteredCompany = company?.find((data) => data.id === selectedCompany);
  const project = filteredCompany?.companyProjects;

  const filterdForwardedTo = useForwardedToUser(
    validateEntities.data,
    role,
    selectedDivision,
    team
  )
  const form = useForm<z.infer<typeof transactionFormData>>({
    resolver: zodResolver(transactionFormData),
    mode: "onSubmit",
    defaultValues: defaultValue
      ? {
          documentType: defaultValue?.documentType,
          subject: defaultValue?.subject,
          dueDate: defaultValue?.dueDate,
          team: defaultValue?.team,
          status: defaultValue?.status,
          priority: defaultValue?.priority,
          originDepartment: currentDivision,
          targetDepartment: defaultValue?.targetDepartment,
          transactionId: defaultValue?.transactionId,
          companyId: defaultValue?.companyId || "",
          projectId: defaultValue?.projectId,
          receiverId: defaultValue?.receiverId,
          remarks: defaultValue?.remarks,
          forwarderId: userId,
          dateForwarded: new Date().toISOString(),
          documentSubType: defaultValue?.documentSubType,
          attachments: defaultValue.attachments?.sort((a, b) =>
            (b.fileUrl || "").localeCompare(a.fileUrl || "")
          )
        }
      : {
          dateForwarded: new Date().toISOString(),
          forwarderId: userId,
          originDepartment: currentDivision,
          transactionId: "",
          attachments: attachmentList?.checkList?.map((item) => ({
            fileName: item,
            fileOriginalName: undefined,
            remarks: "",
            fileType: "INITIAL_DOC",
            fileStatus: null,
            fileUrl: null,
            file: undefined,
          })),
        },
  });
  useEffect(() => {
    if (!defaultValue) {
      form.setValue(
        "attachments",
        attachmentList?.checkList?.map((item) => ({
          fileName: item,
          fileOriginalName: undefined,
          remarks: "",
          fileType: "INITIAL_DOC",
          fileStatus: null,
          fileUrl: null,
          file: undefined,
        })) || [] // Ensure to handle case when attachmentList or checkList might be undefined
      );
    }
  }, [attachmentList]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attachments",
  });

  const onSubmit: SubmitHandler<z.infer<typeof transactionFormData>> = async (
    data
  ) => {
    setIsSubmitting(true);
    mutateFn(data, setIsSubmitting);
  };

  const viewFile = async (key: string) => {
    const signedUrl = await getSignUrlForView(key);
    if (signedUrl) {
      window.open(signedUrl);
    }
  };
  const reattachFile = (index: number) => {
    if (fileInputRef && fileInputRef.current![index]) {
      fileInputRef!.current![index]!.click();
    }
  };
  return (
    <div className="w-full h-full bg-white p-4 rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-3 gap-12 ">
            <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-end">
                  <FormLabel>Company</FormLabel>

                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            " justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? company?.find((comp) => comp.id === field.value)
                                ?.companyName
                            : "Select Company"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput placeholder="Search Company..." />
                        <CommandList>
                          <CommandEmpty>No company found.</CommandEmpty>
                          <CommandGroup>
                            {company?.map((comp) => (
                              <CommandItem
                                value={comp.companyName}
                                key={comp.id}
                                onSelect={(currentValue) => {
                                  const selected = company.find(
                                    (comp) =>
                                      comp.companyName.trim().toLowerCase() ===
                                      currentValue.trim().toLowerCase()
                                  );

                                  form.setValue("companyId", selected?.id);
                                  setSelectedCompany(selected?.id || "");
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    comp.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {comp.companyName}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => (
                <FormItem className="bg-black">
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        setSelectedCompany(value);
                        field.onChange(value);
                      }}
                      disabled={method === "UPDATE" && role !== "RECORDS"}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {company &&
                            company.map((company) => (
                              <SelectItem
                                key={company.companyName}
                                value={company.id!}
                              >
                                {company.companyName}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      defaultValue={field.value}
                      disabled={method === "UPDATE" && role !== "RECORDS"}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Project" />
                      </SelectTrigger>
                      <SelectContent>
                        {project &&
                          project.map((project) => (
                            <SelectItem
                              key={project.projectName}
                              value={project.id!}
                            >
                              {project.projectName}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormInput placeholder="Subject" label="Subject" name="subject" />
            <FormField
              control={form.control}
              name="targetDepartment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        setSelectedDivision(value);
                        field.onChange(value);
                      }}
                      disabled={method === "UPDATE" && role !== "RECORDS"}
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
                  <FormLabel>Team</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        setTeam(value);
                        field.onChange(value);
                      }}
                      defaultValue={field.value}
                      disabled={
                        (method === "UPDATE" && role !== "RECORDS") ||
                        !selectedDivision
                      }
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
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      disabled={method === "UPDATE" && role !== "RECORDS"}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Document Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Application">APPLICATION</SelectItem>
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
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSubType(value);
                      }}
                      disabled={method === "UPDATE" && role !== "RECORDS"}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Document Sub" />
                      </SelectTrigger>
                      <SelectContent>
                        {temp_section?.application.map((type, index) => (
                          <SelectItem key={index} value={`${type.name}`}>
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
              name="receiverId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forwarded To</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      disabled={form.getValues("status") === "ARCHIEVED"}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Forward to " />
                      </SelectTrigger>
                      <SelectContent>
                        {filterdForwardedTo.map((route, index) => (
                          <SelectItem key={index} value={route.id}>
                            {route.fullname}
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
                          disabled={
                            method === "UPDATE" &&
                            role !== "RECORDS" &&
                            role !== "MANAGER"
                          }
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
                          onSelect={(value) => {
                            console.log(new Date(value!).toISOString());
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
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      disabled={
                        method === "UPDATE" &&
                        role !== "RECORDS" &&
                        role !== "MANAGER"
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="URGENT">URGENT</SelectItem>
                        <SelectItem value="HIGH">HIGH</SelectItem>
                        <SelectItem value="LOW">LOW</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      disabled={
                        method === "UPDATE" &&
                        role !== "RECORDS" &&
                        role !== "MANAGER"
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ON-PROCESS">ON-PROCESS</SelectItem>
                        <SelectItem value="APPROVE">APPROVE</SelectItem>
                        <SelectItem value="DORMANT">DORMANT</SelectItem>
                        <SelectItem value="DROP">DROP</SelectItem>
                        <SelectItem value="RECIEVED">RECIEVED</SelectItem>
                        <SelectItem value="ARCHIVED">FOR ARCHIVE</SelectItem>
                      </SelectContent>
                    </Select>
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

          <div className="flex flex-col space-y-4 mt-12 ">
            <h1 className="text-2xl">List of Attachments Required</h1>
            <ScrollArea className="w-full whitespace-nowrap rounded-md border">
              <Table>
                <TableCaption>
                  A list of your required attachments.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Name</TableHead>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[100px]">Remarks</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium w-[300px]">
                        <FormInput
                          name={`attachments.${index}.fileName`}
                          label="Filename"
                        />
                      </TableCell>

                      <TableCell className="font-medium w-[300px]">
                        <FormField
                          control={form.control}
                          name={`attachments.${index}.fileType`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>File type</FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value || ""}
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                  }}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="INITIAL_DOC">
                                      Initial documents
                                    </SelectItem>
                                    <SelectItem value="FOLLOWED_UP">
                                      Follow-up documents
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`attachments.${index}.fileStatus`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>File status</FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value || ""}
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                  }}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="FOR_REVIEW">
                                      For Review
                                    </SelectItem>
                                    <SelectItem value="FINAL_ATTACHMENT">
                                      Final Attachment
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell className="font-medium w-[500px]">
                        <FormTextArea
                          name={`attachments.${index}.remarks`}
                          label="Remarks"
                        />
                      </TableCell>

                      <TableCell className="h-full w-96 ">
                        <div className="w-full">
                          <div className={`${item.fileUrl && "hidden"}`}>
                            <FormField
                              control={form.control}
                              name={`attachments.${index}.file`}
                              render={({ field: { onChange }, ...field }) => (
                                <FormItem>
                                  <FormLabel>File</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="file"
                                      accept="application/pdf"
                                      {...field}
                                      onChange={(event) =>
                                        onChange(event.target.files)
                                      }
                                      ref={(el) =>
                                        (fileInputRef.current![index] = el)
                                      }
                                    />
                                  </FormControl>
                                  <FormDescription></FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className={`${!item.fileUrl && "hidden"}`}>
                            <Label>Actions</Label>
                            <div className="flex  gap-4">
                              <Button
                                type="button"
                                onClick={() => viewFile(item.fileUrl!)}
                              >
                                View file
                              </Button>
                              <Button
                                type="button"
                                onClick={() => reattachFile(index)}
                              >
                                Update
                              </Button>
                              <Button
                                onClick={() => {
                                  remove(index);
                                }}
                                type="button"
                                disabled={item.fileName ? true : false}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableCell>
                    <Button
                      onClick={() => {
                        append({
                          fileName: "",
                          fileOriginalName: "",
                          remarks: "",
                          fileType: "INITIAL_DOC",
                          fileStatus: null,
                          fileUrl: null,
                          file: undefined,
                        });
                      }}
                      type="button"
                    >
                      Add
                    </Button>
                  </TableCell>
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          <div className="flex justify-end mt-11">
            <Button
              type="submit"
              onClick={() => console.log(form.formState.errors)}
              disabled={isSubmitting}
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
