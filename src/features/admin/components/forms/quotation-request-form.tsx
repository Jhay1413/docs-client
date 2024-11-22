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
import { CalendarIcon, Plus, XIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Define schema with expenditure fields as an array
const QuotationRequestMutationSchema = z.object({
    company: z.string().nonempty("Company is required."),
    project: z.string().nonempty("Purpose is required."),
    dateRequested: z.string().nonempty("Date filed is required."),
    items: z.array(
      z.object({
        price: z.number().min(1, "price is required."),
        particulars: z.string().nonempty("particulars is required"),
        remarks: z.string(),
      })
    ),
});  

const QuotationRequestForm = () => {
  const form = useForm({
    resolver: zodResolver(QuotationRequestMutationSchema),
    mode: "onChange",
    defaultValues: {
      company: "",
      project: "",
      dateRequested: "",
      items: [{ price: 0, particulars: "", remarks: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = (data: z.infer<typeof QuotationRequestMutationSchema>) => {
    console.log("Form submitted:", data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto bg-white p-6 shadow rounded">
        <div className="flex justify-center mb-4">
          <img src="/LogoV3.png" alt="Logo" className="h-32 w-auto m-4" />
        </div>
        <h2 className="text-3xl font-bold text-center">Quotation Request Form</h2>
        <Separator className="h-1 w-full bg-lime-700" />

        {/* Requestee */}
        <div className="grid grid-cols-3 gap-6 pt-8 px-24 pb-8">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Company name" className="border-b-2 border-b-gray-700 rounded-b-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="project"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel>Project Name & Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Project name" className="border-b-2 border-b-gray-700 rounded-b-none" {...field} />
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
                <FormLabel>Date</FormLabel>
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
                  <th className="text-center border-2 border-gray-700 p-2">Particulars</th>
                  <th className="text-center border-2 border-gray-700 p-2">Price</th>
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
                    name={`items.${index}.particulars`}
                    render={({ field }) => (
                      <FormControl>
                        <Input placeholder="Enter a particular " {...field} />
                      </FormControl>
                    )}
                  />
                </td>
                <td className="border-2 border-gray-700 p-2">
                  <FormField
                    control={form.control}
                    name={`items.${index}.price`}
                    render={({ field }) => (
                      <FormControl>
                        <Input type="number" placeholder="Number of items" {...field} />
                      </FormControl>
                    )}
                  />
                </td>

                <td className="border-2 border-gray-700 p-2">
                  <FormField
                    control={form.control}
                    name={`items.${index}.remarks`}
                    render={({ field }) => (
                      <FormControl>
                        <Input placeholder="Enter Remarks" {...field} />
                      </FormControl>
                    )}
                  />
                </td>

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
          <Button type="button" variant="outline" className="flex items-center justify-center gap-2 mt-4" onClick={() => append({ price: 0, particulars: "", remarks: "" })}>
            <Plus size={20} />
            Add Row
          </Button>
          <p className="text-base text-center pb-8">NOTE: Write an "NF" / Nothing Follows at the end of the last item requested.</p>
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

export default QuotationRequestForm;
