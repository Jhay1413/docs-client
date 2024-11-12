import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { cn } from "@/lib/utils";

import { format } from "date-fns";
import { CalendarIcon, SquarePen, X } from "lucide-react";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

import { Divisions } from "@/data/data";
import { getCurrentUserId, useCurrentUserRole } from "@/hooks/hooks/use-user-hook";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCurrentDivision } from "@/hooks/use-user-hook";
import FormTextArea from "@/components/formTextArea";
import { Label } from "@/components/ui/label";
import { getSignedUrl, getSignedUrlV2, getSignUrlForView } from "../services/getSignedUrl";
import { checkList } from "@/data/checklist-new";

import { Check, ChevronsUpDown } from "lucide-react";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "react-toastify";
import { Separator } from "@/components/ui/separator";
import { companyQuerySchema, filesMutationSchema, transactionMutationSchema, transactionQueryData } from "shared-contract";
import { tsr } from "@/services/tsr";
import axios, { AxiosProgressEvent } from "axios";
import { useMutation } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
interface UploadStatus {
  isLoading: boolean;
  isSuccess: boolean;
  isFailed: boolean;
  progress: number;
  fileName?: string;
}

type props = {
  company: z.infer<typeof companyQuerySchema>[] | null;
  method?: string;
  defaultValue?: z.infer<typeof transactionQueryData> | null;
  mutateFn: (data: z.infer<typeof transactionMutationSchema>) => void;
  isPending: boolean;
  isForwarding: boolean;
};
const baseUrlV2 = import.meta.env.VITE_ENDPOINT;
export const TransactionForm = ({ company, method, defaultValue, mutateFn, isPending, isForwarding }: props) => {
  const role = useCurrentUserRole();
  const currentDivision = useCurrentDivision();
  const userId = getCurrentUserId();

  const fileInputRef = useRef<(HTMLInputElement | null)[]>([]);

  const [selectedCompany, setSelectedCompany] = useState<string>(defaultValue?.companyId || "");
  const [team, setTeam] = useState(defaultValue?.team || null);
  const [selectedDivision, setSelectedDivision] = useState(defaultValue?.targetDepartment || "");
  const [subType, setSubType] = useState("");
  const [category, setCategory] = useState("");
  const temp_section = checkList.find((check) => check.name === team);
  const attachmentList = useMemo(() => temp_section?.application.find((check) => check.name === subType), [subType, temp_section]);
  const sections = Divisions.find((division) => division.name === selectedDivision);
  const filteredCompany = company?.find((data) => data.id === selectedCompany);
  const project = filteredCompany?.companyProjects;
  const companyName = company?.find((data) => selectedCompany === data.id);

  const { data: filterdForwardedTo } = tsr.userAccounts.getUserByRoleAccess.useQuery({
    queryKey: ["users-for-forward"],
    queryData: {
      query: {
        id: userId,
        targetDivision: selectedDivision,
        team: team,
      },
    },
    staleTime: Infinity,
  });
  const mutation = useMutation({
    mutationFn: async ({ data, index, fileName }: { data: FormData; index: number; fileName: string }) => {
      setUploadStatus((prev) => {
        const newStatus = [...prev];
        newStatus[index] = { isLoading: true, isSuccess: false, isFailed: false, progress: 0, fileName: fileName }; // Mark as success
        return newStatus;
      });
      const result = await axios.post(`${baseUrlV2}/posts`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (e: AxiosProgressEvent) => {
          const total = e.total || 1;
          var percentCompleted = Math.round((e.loaded * 100) / total);
          console.log(percentCompleted);
          setUploadStatus((prev) => {
            const newStatus = [...prev];
            newStatus[index].progress = percentCompleted; // Update progress
            return newStatus;
          });
        },
      });
      return { result, index, fileName };
    },
    onSuccess: (data, context) => {
      setUploadStatus((prev) => {
        const newStatus = [...prev];
        newStatus[context.index] = { isLoading: false, isSuccess: true, isFailed: false, progress: 100, fileName: context.fileName }; // Mark as success
        return newStatus;
      });
      form.setValue(`attachments.${context.index}.fileOriginalName`, data.fileName);
      form.setValue(`attachments.${context.index}.fileUrl`, data?.result.data.key);
      return context;
    },
    onError: (error, context) => {
      setUploadStatus((prev) => {
        const newStatus = [...prev];
        newStatus[context.index] = { isLoading: false, isSuccess: false, isFailed: true, progress: 0, fileName: context.fileName }; // Mark as failed
        return newStatus;
      });
      return context;
    },
  });

  const form = useForm<z.infer<typeof transactionMutationSchema>>({
    resolver: zodResolver(transactionMutationSchema),
    mode: "onSubmit",
    defaultValues: defaultValue
      ? {
          id: defaultValue.id,
          documentType: defaultValue?.documentType,
          subject: defaultValue?.subject,
          dueDate: defaultValue ? new Date(defaultValue.dueDate).toISOString() : new Date().toISOString(),
          team: defaultValue.team,
          category: defaultValue.category || category,
          status: defaultValue?.status,
          priority: defaultValue?.priority,
          originDepartment: currentDivision,
          targetDepartment: defaultValue?.targetDepartment,
          transactionId: defaultValue?.transactionId,
          companyId: defaultValue?.companyId || "",
          projectId: defaultValue?.projectId || "",
          receiverId: defaultValue?.receiverId,
          forwarderId: userId,
          dateForwarded: new Date().toISOString(),
          documentSubType: defaultValue?.documentSubType,
          attachments: defaultValue.attachments?.sort((a, b) => (b.fileUrl || "").localeCompare(a.fileUrl || "")),
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
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attachments",
  });
  const [uploadStatus, setUploadStatus] = useState<UploadStatus[]>([]);

  // Effect to initialize or update uploadStatus based on fields
  useEffect(() => {
    setUploadStatus(Array(fields.length).fill({ isLoading: false, isSuccess: false, isFailed: false, progress: 0 }));
  }, [defaultValue]);

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
        })) || [], // Ensure to handle case when attachmentList or checkList might be undefined
      );
      setUploadStatus(Array(fields.length).fill({ isLoading: false, isSuccess: false, isFailed: false, progress: 0 }));
    }
  }, [attachmentList]);

  const fileOnChangeSubmit = async (data: z.infer<typeof filesMutationSchema>, event: ChangeEvent<HTMLInputElement>, index: number) => {
    const files = event.target.files;
    const formData = new FormData();

    // const currentFileName = form.getValues(`attachments.${index}.fileName`);
    if (!files || files.length === 0) {
      throw new Error("No file attached !");
    }
    const fileName = files[0].name;

    console.log(fileName);
    formData.append("thumbnail", files[0]);
    formData.append("company", companyName?.companyName || "");
    formData.append("fileName", fileName);

    mutation.mutateAsync({ data: formData, index, fileName });
  };
  const onSubmit: SubmitHandler<z.infer<typeof transactionMutationSchema>> = async (data) => {
    mutateFn(data);
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
  const onError = () => {
    if (form.formState.errors) console.log(form.formState.errors);
    toast.error("Please check all required fields . ", {
      position: "bottom-right",
    });
  };
  return (
    <div className="w-full h-full bg-white p-4 rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <div className="grid grid-cols-3 gap-8 ">
            <div className="col-span-3 grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-end">
                    <FormLabel>Company</FormLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" role="combobox" disabled={isForwarding} className={cn(" justify-between", !field.value && "text-muted-foreground")}>
                            {field.value ? company?.find((comp) => comp.id === field.value)?.companyName : "Select Company"}
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
                                      (comp) => comp.companyName.trim().toLowerCase() === currentValue.trim().toLowerCase(),
                                    );

                                    form.setValue("companyId", selected?.id!);
                                    setSelectedCompany(selected?.id || "");
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", comp.id === field.value ? "opacity-100" : "opacity-0")} />
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
                              <SelectItem key={project.projectName} value={project.id!}>
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
            </div>
            <Separator className="col-span-3" />
            <div className="col-span-3 grid grid-cols-3 gap-4 grid-rows-2">
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
                        disabled={role !== "RECORDS" && role !== "DMS" && role !== "MANAGER" && method == "UPDATE"}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Department" />
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
                        defaultValue={field.value || undefined}
                        disabled={(role !== "RECORDS" && role !== "DMS" && role !== "MANAGER" && method == "UPDATE") || !selectedDivision}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select team" />
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
              <div className="row-span-2 ">
                <FormTextArea placeholder="Subject" label="Subject" name="subject" disable={isForwarding} />
              </div>
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
                          const category = temp_section?.application.find((data) => data.name.toLocaleLowerCase() == value.toLocaleLowerCase());
                          category ? form.setValue("category", category.category) : form.setValue("category", "");
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
            </div>
            <Separator className="col-span-3 mt-4" />
            <div className="col-span-3 grid grid-cols-3 gap-4 grid-rows-2">
              <FormField
                control={form.control}
                name="receiverId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forwarded To</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value!}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        disabled={form.getValues("status") === "ARCHIVED"}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Forward to " />
                        </SelectTrigger>
                        <SelectContent>
                          {filterdForwardedTo?.body.map((route, index) => (
                            <SelectItem key={index} value={route.accountId}>
                              {route.firstName} {route.lastName} - <span className="font-bold">{route.account.accountRole}</span>
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
                            className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                            disabled={method === "UPDATE" && role !== "RECORDS" && role !== "MANAGER"}
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
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="row-span-2 h-full">
                <FormTextArea placeholder="Remarks" label="Remarks" name="remarks" />
              </div>
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        disabled={method === "UPDATE" && role !== "RECORDS" && role !== "MANAGER"}
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
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        disabled={method === "UPDATE" && role !== "RECORDS" && role !== "MANAGER"}
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
            </div>
            <Separator className="col-span-3 mt-4" />
          </div>

          <div className="flex flex-col space-y-4 mt-12 ">
            <h1 className="text-2xl">List of Attachments Required</h1>
            <ScrollArea className="w-full whitespace-nowrap rounded-md border">
              <Table>
                <TableCaption>A list of your required attachments.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead className="w-[200px]">Status</TableHead>
                    <TableHead className="w-[200px]">Filename</TableHead>
                    <TableHead className="w-[100px]">Remarks</TableHead>
                    <TableHead className="">File</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="">
                  {fields.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium w-[300px]">
                        <FormField
                          control={form.control}
                          name={`attachments.${index}.fileType`}
                          render={({ field }) => (
                            <FormItem>
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
                                    <SelectItem value="INITIAL_DOC">Initial documents</SelectItem>
                                    <SelectItem value="FOLLOWED_UP">Follow-up documents</SelectItem>
                                    <SelectItem value="APPROVE">Approve</SelectItem>
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
                                    <SelectItem value="FOR_REVIEW">For Review</SelectItem>
                                    <SelectItem value="FINAL_ATTACHMENT">Final Attachment</SelectItem>
                                    <SelectItem value="NOT_APPLICABLE">Not Applicable</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell className="font-medium w-[300px]">
                        <FormTextArea name={`attachments.${index}.fileName`} />
                      </TableCell>
                      <TableCell className="font-medium w-[500px]">
                        <FormTextArea name={`attachments.${index}.remarks`} />
                      </TableCell>
                      <TableCell className="">
                        <div className="flex justify-center flex-col gap-2">
                          <div className="flex w-full gap-4 justify-center items-center ">
                            <FormField
                              control={form.control}
                              name={`attachments.${index}.file`}
                              render={({ field: { onChange }, ...field }) => (
                                <FormItem className="hidden">
                                  <FormControl>
                                    <Input
                                      type="file"
                                      accept="application/pdf"
                                      {...field}
                                      onChange={(e) => {
                                        fileOnChangeSubmit(item, e, index);
                                      }}
                                      disabled={form.getValues(`attachments.${index!}.fileName`) === " "}
                                      ref={(el) => (fileInputRef.current![index] = el)}
                                    />
                                  </FormControl>
                                  <FormDescription></FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            {uploadStatus[index]?.isLoading || uploadStatus[index]?.isSuccess || uploadStatus[index]?.isFailed ? (
                              <div className="flex flex-col w-full">
                                <h1 className="text-wrap">{uploadStatus[index].fileName}</h1>
                                <h1 className="text-muted-foreground text-sm">{uploadStatus[index].progress} / 100%</h1>
                                <Progress value={uploadStatus[index].progress} className="w-full h-2" />
                              </div>
                            ) : (
                              <div className="flex flex-col w-full">
                                <button type="button" onClick={() => viewFile(item.fileUrl!)}>
                                  <h1 className="text-wrap text-blue-500/85">{form.getValues(`attachments.${index}.fileOriginalName`)}</h1>
                                </button>
                              </div>
                            )}
                          </div>
                          {uploadStatus[index]?.isLoading && <div className="success-message">Uploading !</div>}
                          {uploadStatus[index]?.isSuccess && <div className="success-message">Upload successful!</div>}
                          {uploadStatus[index]?.isFailed && <div className="error-message">Upload failed!</div>}
                        </div>
                      </TableCell>

                      <TableCell className="w-32">
                        <div className="flex w-full items-center gap-4 justify-center">
                          <button type="button" onClick={() => reattachFile(index)}>
                            <SquarePen className="text-green-800" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              console.log(index);
                              remove(index);
                              setUploadStatus((prev) => {
                                const newStatus = [...prev];
                                newStatus.splice(index, 1);
                                return newStatus;
                              });
                            }}
                          >
                            <X className="text-red-800" />
                          </button>
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
                        setUploadStatus((prev) => [
                          ...prev,
                          { isLoading: false, isSuccess: false, isFailed: false, progress: 0 }, // New status for the appended field
                        ]);
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
            <Button type="submit" onClick={() => console.log(form.formState.errors)} disabled={isPending}>
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
