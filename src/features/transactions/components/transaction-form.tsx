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
  SelectGroup,
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

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { checkList } from "@/data/checklist";
import FormInput from "@/components/formInput";
import { Divisions } from "@/data/data";
import { CompanyInfo } from "@/features/companies";
import { getCurrentUserId, useCurrentUserRole } from "@/hooks/hooks/use-user-hook";
import { docRoute } from "@/data/doc-route";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionFormData } from "../schema/TransactionSchema";
import { useCurrentDivision } from "@/hooks/use-user-hook";

type fileProps = {
  name: string;
  file: File;
};

type props = {
  setFiles: Dispatch<SetStateAction<fileProps[]>>;
  company: z.infer<typeof CompanyInfo>[] | undefined;
  method?: string;
  defaultValue?: z.infer<typeof transactionFormData>;
  mutateFn: (data: z.infer<typeof transactionFormData>) => void;
};
export const TransactionForm = ({
  setFiles,
  company,
  method,
  defaultValue,
  mutateFn,
}: props) => {
  const role = useCurrentUserRole();
  const currentDivision = useCurrentDivision();
  const userId = getCurrentUserId();
  console.log(defaultValue)
  const route = docRoute.filter((data) => data.accessRole.includes(role));
  const form = useForm<z.infer<typeof transactionFormData>>({
    resolver: zodResolver(transactionFormData),
    mode: "onChange",
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
          companyId: defaultValue?.companyId,
          projectId: defaultValue?.projectId,
          forwardedTo: defaultValue?.forwardedTo,
          remarks: defaultValue?.remarks,
          forwardedById: userId,
          forwardedByRole: role,
          dateForwarded: new Date().toISOString(),
          documentSubType: defaultValue?.documentSubType,
        }
      : {
        dateForwarded : new Date().toISOString(),
        forwardedByRole : role,
        forwardedById: userId,
        originDepartment: currentDivision,
        transactionId : ""
      },
  });                                                                           
  const [selectedCompany, setSelectedCompany] = useState<string>(defaultValue?.companyId || "");
  const [team, setTeam] = useState(defaultValue?.team || "");
  const [selectedDivision, setSelectedDivision] = useState(defaultValue?.targetDepartment || "");
  const [applicationType, setApplicationType] = useState("");

  const temp_section = checkList.find((check) => check.name === team);
  const attachmentList = temp_section?.application.find((check) => check.value === applicationType);
  const sections = Divisions.find((division) => division.name === selectedDivision);

  const filteredCompany = company?.find((data) => data.id === selectedCompany);
  const project = filteredCompany?.companyProjects;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const name = e.target.name;

    if (file) {
      setFiles((prevFiles) => [...prevFiles, { name, file }]);
    }
  };

  const onSubmit: SubmitHandler<z.infer<typeof transactionFormData>> = async (
    data
  ) => {
    mutateFn(data);
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
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        setSelectedCompany(value);
                        field.onChange(value);
                      }}
                      disabled={(method === "UPDATE") && role !=="RECORDS"}
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
                      disabled={(method === "UPDATE") && role !=="RECORDS"}
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
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      disabled={(method === "UPDATE") && role !=="RECORDS"}
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
                    value = {field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setApplicationType(value);
                      }}
                      disabled={(method === "UPDATE" && role !=="RECORDS") || !team}
                      
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
                        {route.map((route, index) => (
                          <SelectItem key={index} value={route.name}>
                            {route.name}
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
                          disabled={method === "UPDATE" && role !== "MANAGER"}
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
                          onSelect={(value) =>
                            field.onChange(new Date(value!).toISOString())
                          }
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

          {method != "UPDATE" && (
            <div className="flex flex-col space-y-4 mt-12">
              <h1 className="text-2xl">List of Attachments Required</h1>
              <Table>
                <TableCaption>
                  A list of your required attachments.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Name</TableHead>
            
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attachmentList?.checkList?.map((check, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium w-[200px]">
                        {check.name}
                      </TableCell>

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
          )}
          <div className="flex justify-end mt-11">
            <Button type="submit" onClick={()=>console.log(form.formState.errors)}>Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
