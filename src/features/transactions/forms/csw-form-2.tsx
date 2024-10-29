import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { cn } from "@/lib/utils";

import { format } from "date-fns";
import { CalendarIcon, Check, FileCode, ImageUp } from "lucide-react";

import FormTextArea from "@/components/formTextArea";
import { completeStaffWork, signedUrlData } from "../schema/TransactionSchema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useTransaction } from "../hooks/query-gate";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSignedUrl } from "../services/getSignedUrl";
import { ChangeEvent, useRef, useState } from "react";
import { uploadFile } from "../services/uploadFile";
import { Textarea } from "@/components/ui/textarea";
import { tsr } from "@/services/tsr";
import { Progress } from "@/components/ui/progress";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosProgressEvent } from "axios";
import { completeStaffWorkMutationSchema } from "shared-contract/dist/features/transactions/mutation-schema";
import { toast } from "react-toastify";
type Props = {
  data?: z.infer<typeof completeStaffWork>[];
  transactionId: string;
};
type cswFiles = {
  name: string;
  loading: number;
}[];
type uploaded = {
  keys: string;
};
const baseUrlV2 = import.meta.env.VITE_ENDPOINT;
export function CompleStaffWorkDialog({ transactionId }: Props) {
  const tsrQueryClient = tsr.useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<cswFiles>([]);
  const [showProgress, setShowProgress] = useState(false);

  const [uploadedFile, setUploadedFile] = useState<cswFiles>([]);
  const [uploadedKeys, setUploadedKeys] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Allow null

  const { mutate, isPending } = tsr.transaction.addCompleteStaffWork.useMutation({
    onMutate: (data) => {
      const lastGoodKnown = tsrQueryClient.transaction.fetchTransactionById.getQueryData(["transaction", transactionId]);

      tsrQueryClient.transaction.fetchTransactionById.setQueryData(["transaction", transactionId], (old) => {
        if (!old) return old;
        return {
          ...old,
          body: {
            ...old.body!,

            completeStaffWork: [
              ...(old?.body?.completeStaffWork || []),
              {
                date: new Date(data.body.date!).toDateString(),
                remarks: data.body.remarks,
                attachments: data.body.attachments || [],
              },
            ],
          },
        };
      });
      return { lastGoodKnown };
    },
    onSuccess: () => {
      toast.success("Data submitted !");
      setFiles([]);
      setUploadedFile([]);
      setUploadedKeys([]);
    },
    onError: (error, newPost, context) => {
      tsrQueryClient.transaction.fetchTransactionById.setQueryData(["transaction", transactionId], context?.lastGoodKnown);
    },
    onSettled: () => {
      setIsSubmitting(false);
      setIsOpen(false);
      tsrQueryClient.invalidateQueries({ queryKey: ["transaction", transactionId] });
    },
  });

  const form = useForm<z.infer<typeof completeStaffWorkMutationSchema>>({
    resolver: zodResolver(completeStaffWorkMutationSchema),
    mode: "onChange",
    defaultValues: {
      date: new Date().toISOString(),
      remarks: "",
      attachments: undefined,
      attachmentFile: undefined,
    },
  });
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
  const submit = async (data: z.infer<typeof completeStaffWorkMutationSchema>) => {
    console.log(uploadedKeys);
    setIsSubmitting(true);

    const payload = {
      date: data.date,
      remarks: data.remarks,
      attachmentUrl: "",
      attachments: uploadedKeys,
    };

    mutate({
      params: {
        id: transactionId,
      },
      body: payload,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add CSW</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] ">
        <DialogHeader>
          <DialogTitle>Complete Staff Work</DialogTitle>
          <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2  ">
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
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
                          disabled={isPending}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormTextArea
              name="remarks"
              label="Remarks"
              disable={isPending}
            /> */}
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Textarea placeholder="remarks" {...field} disabled={isPending} className="z-10" />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex w-full flex-col p-4 gap-4 items-center justify-center rounded-md border-blue-300  border-dashed border-2 ">
              <p className="text-xl">Upload File</p>

              <div className="flex items-center justify-center ">
                <input type="file" hidden ref={fileInputRef} onChange={uploadFile} />
                <div className="flex items-center justify-center" onClick={handleFileInputClick}>
                  <ImageUp className=" w-24 h-24 bg-blue-200 rounded-xl text-blue-500" />
                </div>
              </div>
            </div>

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
            <DialogFooter className="mt-4">
              <Button type="submit" disabled={isSubmitting} onClick={() => console.log(form.formState.errors)}>
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
