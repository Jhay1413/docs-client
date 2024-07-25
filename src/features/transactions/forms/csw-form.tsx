import { useFieldArray, useForm } from "react-hook-form";
import { completeStaffWork, signedUrlData } from "../schema/TransactionSchema";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { useTransaction } from "../hooks/query-gate";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import FormTextArea from "@/components/formTextArea";
import { getSignedUrl } from "../services/getSignedUrl";
import { uploadFile } from "../services/uploadFile";

type FormValues = {
  id: string;
  csw: z.infer<typeof completeStaffWork>[];
};
type Props = {
  data: z.infer<typeof completeStaffWork>[];
  transactionId: string;
};

export const CompleteStaffWorkForm = ({ data, transactionId }: Props) => {
  const { update } = useTransaction({
    key: "transaction",
    url: `v2/${transactionId}/csw`,
  });
  const [isEdit, setIsEdit] = useState(false);
  const form = useForm<FormValues>({
    mode: "onSubmit",
    defaultValues: {
      id: transactionId,
      csw: data || [],
    },
  });

  useEffect(() => {
    if (data) {
      form.setValue(
        "csw",
        data.map((csw) => ({
          id: csw.id,
          date: csw.date,
          remarks: csw.remarks,
          attachmentUrl: csw.attachmentUrl,
        }))
      );
    }
  }, [data, form]);

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "csw",
  });
  const submit = async (data: FormValues) => {
    const dataToUpdate = data.csw.filter((data) => data.attachmentFile);
    if (!dataToUpdate || dataToUpdate.length < 0)
      return update.mutate(data.csw);

    const signedUrlPayload = data.csw.map((data, index) => {
      return {
        company: "Envicomm",
        fileName: data.attachmentFile?.item.name || "",
        index: index,
      };
    });
    const signedUrl = await getSignedUrl<z.infer<typeof signedUrlData>>(
      signedUrlPayload
    );

    const uploadedFile = await Promise.all(
      dataToUpdate.map(async (csw, index) => {
        const attachmentToUpload = signedUrl.find(
          (signed) => signed.index === index
        );

        if (!attachmentToUpload?.signedStatus || !attachmentToUpload.signedUrl)
          return csw;
        const response = await uploadFile(
          attachmentToUpload.signedUrl,
          csw.attachmentFile![0]
        );

        if (!response?.ok) return csw;

        return {
          ...csw,
          attachmentUrl: attachmentToUpload.key,
        };
      })
    );
    const payload = uploadedFile.map((uploadedFile) => {
      const { attachmentFile, ...newData } = uploadedFile;
      return { ...newData, id: undefined };
    });
    update.mutate(payload);
  };
  return (
    <>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <Table>
              <TableCaption>A list of your required attachments.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead className="w-[100px]">Remarks</TableHead>
                  {isEdit && <TableHead className="    ">Action</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium w-[300px]">
                      <FormField
                        control={form.control}
                        name={`csw.${index}.date`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-2 ">
                            <FormLabel>Date</FormLabel>
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
                                    onSelect={(value) => {
                                      console.log(
                                        new Date(value!).toISOString()
                                      );
                                      field.onChange(
                                        new Date(value!).toISOString()
                                      );
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
                    </TableCell>
                    <TableCell className="font-medium w-[300px]">
                      <FormTextArea
                        name={`csw.${index}.remarks`}
                        label="Remarks"
                      />
                    </TableCell>

                    <TableCell className="h-full w-96 ">
                      <div className="w-full">
                        <FormField
                          control={form.control}
                          name={`csw.${index}.attachmentFile`}
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
                                />
                              </FormControl>
                              <FormDescription></FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-between">
              <Button
                type="button"
                onClick={() =>
                  append({
                    date: new Date().toISOString(),
                    remarks: "",
                    attachmentFile: undefined,
                  })
                }
              >
                Add
              </Button>
              <Button type="submit" disabled={update.isPending}>
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};
