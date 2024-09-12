import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { ConferenceFormSchema } from "../schema/dashboardSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useCalendarFormState } from "../states/calendar-form-state-store";
import { useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup
} from "@/components/ui/select";

export const ConferenceSchedForm = () => {
  const { selectedDate } = useCalendarFormState();
  const form = useForm<z.infer<typeof ConferenceFormSchema>>({
    resolver: zodResolver(ConferenceFormSchema),
    mode: "onSubmit",
    defaultValues:{
        endDate : selectedDate
    }
  });
  const timeSlots = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ];
  useEffect(() => {
    form.setValue("startDate", selectedDate);
  }, [selectedDate]);
  const onSubmit: SubmitHandler<z.infer<typeof ConferenceFormSchema>> = async (
    data
  ) => {
    const temp_Date = new Date(data.startDate).toISOString().split('T')[0];
    const new_start_date = new Date(`${temp_Date}T${data.startTime}`).toISOString();
    const new_end_Date = new Date(`${data.endDate}T${data.endTime}`);

    console.log();
    console.log(new_end_Date);
  };

  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col w-full gap-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="description" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 z-auto ">
                <FormLabel>Start date</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={true}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 ">
                      <Calendar
                        mode="single"
                        onSelect={(value) => {
                          console.log(new Date(value!).toISOString());
                          field.onChange(new Date(value!));
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
          
          <div className="flex w-full justify-between z-0">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start time</FormLabel>
                  <FormControl>
                    <Select
                       onValueChange={(value) => {
                       
                        field.onChange(value);
                      }}>
                      <SelectTrigger className="w-[180px] z-0">
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {timeSlots.map((val, index) => (
                            <SelectItem value={val} key={`${val}${index}`}>
                              {val}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End time</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                       
                        field.onChange(value);
                      }}>
                      <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((val, index) => (
                          <SelectItem value={val} key={`${val}${index}`}>
                            {val}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex justify-end w-full items-center mt-4">
            <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};
