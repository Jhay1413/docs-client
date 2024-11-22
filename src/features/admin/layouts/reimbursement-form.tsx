import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ArrowLeft, CalendarIcon, Plus, XIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "react-router-dom";

// Define schema with expenditure fields as an array
const ReimbursementRequestMutationSchema = z.object({
  requestee: z.string().nonempty("Requestee name is required."),
  position: z.string().nonempty("Position is required."),
  dateRequested: z.string().nonempty("Date filed is required."),
  expenditure: z.array(
    z.object({
      name: z.string().nonempty("Expenditure name is required."),
      amount: z.number().min(1, "Amount must be greater than 0."),
      remarks: z.string(),
      attachment: z.string().optional(),
    })
  ),
});

const ReimbursementForm = () => {
  const form = useForm({
    resolver: zodResolver(ReimbursementRequestMutationSchema),
    mode: "onChange",
    defaultValues: {
      requestee: "",
      position: "",
      dateRequested: "",
      expenditure: [{ name: "", amount: 0, remarks: "", attachment: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "expenditure",
  });

  const onSubmit = (data: z.infer<typeof ReimbursementRequestMutationSchema>) => {
    console.log("Form submitted:", data);
  };

  return (
    <Form {...form}>
      <Button className="sticky top-0 bg-white bg-opacity-50 border-none rounded-lg p-2 shadow-md">
        <NavLink to={`/dashboard/admin/request`}>
          <ArrowLeft className="text-black hover:text-white" />
        </NavLink>
      </Button>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto bg-white p-6 shadow rounded">
        <div className="flex justify-center mb-4">
          <img src="/LogoV3.png" alt="Logo" className="h-32 w-auto m-4" />
        </div>
        <h2 className="text-3xl font-bold text-center">Reimbursement Request Form</h2>
        <p className="text-base text-center pb-8">NOTE: Please attach all receipts or any attachments together with this form</p>
        <Separator className="h-1 w-full bg-lime-700" />

        {/* Requestee */}
        <div className="grid grid-cols-3 gap-6 pt-8 px-24 pb-8">
          <FormField
            control={form.control}
            name="requestee"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter requestee name" className="border-b-2 border-b-gray-700 rounded-b-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input placeholder="Enter position" className="border-b-2 border-b-gray-700 rounded-b-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateRequested"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel>Date Filed</FormLabel>
                <FormControl>
                  <Popover >
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}                        
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
        </div>

        <Separator className="h-1 w-full bg-lime-700" />

        {/* Request Details Table */}
        <div className="pt-4 px-24 pb-8">
          <h3 className="text-lg font-semibold pb-4">Request Details</h3>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="text-center border-2 border-gray-700 p-2">Expenditure</th>
                  <th className="text-center border-2 border-gray-700 p-2">Amount (PHP)</th>
                  <th className="text-center border-2 border-gray-700 p-2">Attachment</th>
                  <th className="text-center border-2 border-gray-700 p-2">Remarks</th>
                  {/* <th className="text-center border border-transparent p-2">Actions</th> */}
                </tr>
              </thead>
              <tbody>
            {fields.map((field, index) => (
              <tr key={field.id} className="relative">
                <td className="border-2 border-gray-700 p-2">
                  <FormField
                    control={form.control}
                    name={`expenditure.${index}.name`}
                    render={({ field }) => (
                      <FormControl>
                        <Input placeholder="Enter expenditure" {...field} />
                      </FormControl>
                    )}
                  />
                </td>
                <td className="border-2 border-gray-700 p-2">
                  <FormField
                    control={form.control}
                    name={`expenditure.${index}.amount`}
                    render={({ field }) => (
                      <FormControl>
                        <Input type="number" placeholder="Amount" {...field} />
                      </FormControl>
                    )}
                  />
                </td>
                <td className="border-2 border-gray-700 p-2">
                  <FormField
                    control={form.control}
                    name={`expenditure.${index}.attachment`}
                    render={({ field }) => (
                      <FormControl>
                        <Input type="file" {...field} />
                      </FormControl>
                    )}
                  />
                </td>
                <td className="border-2 border-gray-700 p-2">
                  <FormField
                    control={form.control}
                    name={`expenditure.${index}.remarks`}
                    render={({ field }) => (
                      <FormControl>
                        <Input placeholder="Enter remarks" {...field} />
                      </FormControl>
                    )}
                  />
                </td>
                {/* Remove button positioned outside the table */}
                <td className="absolute top-0 right-[-120px] flex items-center justify-center">
                  <Button
                    variant="outline"
                    onClick={() => remove(index)}
                    className="text-red-600 border-red-600 flex items-center gap-2"
                  >
                    <XIcon size={20} />
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
            </table>
          </div>
          <Button type="button" variant="outline" className="flex items-center justify-center gap-2 mt-4" onClick={() => append({ name: "", amount: 0, remarks: "", attachment: "" })}>
            <Plus size={20} />
            Add Row
          </Button>
        </div>
        <Separator className="h-1 w-full bg-lime-700" />

        <div className="flex items-end justify-end">
            <Button type="submit" className="w-min mt-4">
            Submit Request
            </Button>
        </div>
      </form>
    </Form>
  );
};

export default ReimbursementForm;
