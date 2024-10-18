import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { cn } from "@/lib/utils";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import FormTextArea from "@/components/formTextArea";
import { completeStaffWork, signedUrlData } from "../schema/TransactionSchema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useTransaction } from "../hooks/query-gate";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSignedUrl } from "../services/getSignedUrl";
import { useState } from "react";
import { uploadFile } from "../services/uploadFile";
import { Textarea } from "@/components/ui/textarea";
import { tsr } from "@/services/tsr";
type Props = {
  data?: z.infer<typeof completeStaffWork>[];
  transactionId: string;
};
export function CompleStaffWorkDialog({ transactionId }: Props) {
  const tsrQueryClient = tsr.useQueryClient();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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
                attachmentUrl: data.body.attachmentUrl,
              },
            ],
          },
        };
      });
      return { lastGoodKnown };
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
  const form = useForm<z.infer<typeof completeStaffWork>>({
    resolver: zodResolver(completeStaffWork),
    mode: "onSubmit",
    defaultValues: {
      date: new Date().toISOString(),
      remarks: "",
      attachmentFile: undefined,
    },
  });

  const submit = async (data: z.infer<typeof completeStaffWork>) => {
    setIsSubmitting(true);

    if (!data.attachmentFile) {
      const { attachmentFile, ...final_payload } = data;
      return mutate({
        params: {
          id: transactionId,
        },
        body: final_payload,
      });
    }
    const signedUrlPayload = [
      {
        company: "Envicomm/csw",
        fileName: data.attachmentFile?.name || "",
      },
    ];
    const signedUrl = await getSignedUrl<z.infer<typeof signedUrlData>>(signedUrlPayload);

    await uploadFile(signedUrl[0].signedUrl!, data.attachmentFile!);
    const payload = { ...data, attachmentUrl: signedUrl[0].key! };

    const { attachmentFile, ...final_payload } = payload;

    return mutate({
      params: {
        id: transactionId,
      },
      body: final_payload,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add CSW</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] ">
        <DialogHeader>
          <DialogTitle>Complete Staff Work</DialogTitle>
          <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
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
            <div className="w-full">
              <FormField
                control={form.control}
                name="attachmentFile"
                render={({ field: { onChange }, ...field }) => (
                  <FormItem>
                    <FormLabel>File</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} type="file" {...field} onChange={(event) => onChange(event.target.files![0])} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
