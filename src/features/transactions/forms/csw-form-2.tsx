import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
type Props = {
  data?: z.infer<typeof completeStaffWork>[];
  transactionId: string;
};
export function CompleStaffWorkDialog({ transactionId }: Props) {
  const { update } = useTransaction({
    key: "transactions",
    url: `v2/${transactionId}`,
    id: transactionId,
    updateUrl: `v2/${transactionId}/csw`,
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
    try {
      const signedUrlPayload = [
        {
          company: "Envicomm",
          fileName: data.attachmentFile?.item.name || "",
        },
      ];
      const signedUrl = await getSignedUrl<z.infer<typeof signedUrlData>>(
        signedUrlPayload
      );

      const payload = signedUrl.map((datawithUrl) => {
        if (!datawithUrl.signedStatus) return data;
        return { ...data, attachmentUrl: datawithUrl.key };
      });
      update.mutate(payload[0]);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add CSW</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Staff Work</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <FormField
              control={form.control}
              name="date"
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

            <FormTextArea name="remarks" label="Remarks" />

            <div className="w-full">
              <FormField
                control={form.control}
                name="attachmentFile"
                render={({ field: { onChange }, ...field }) => (
                  <FormItem>
                    <FormLabel>File</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="application/pdf"
                        {...field}
                        onChange={(event) => onChange(event.target.files)}
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={update.isPending}>Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
