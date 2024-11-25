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
import SignatoriesSection from "./signatories-section";

// Define schema with expenditure fields as an array
const PurchaseRequestMutationSchema = z.object({
    department: z.string().nonempty("Department is required."),
    purpose: z.string().nonempty("Purpose is required."),
    dateRequested: z.string().nonempty("Date filed is required."),
    items: z.array(
      z.object({
        quantity: z.number().min(1, "Quantity is required."),
        uom: z.string().nonempty("Unit of measurement is required"),
        description: z.string().nonempty("Item Description is required"),
        suppliers: z.string().nonempty("Suppliers is required"),
        remarks: z.string(),
      })
    ),
});  

const PurchaseRequestForm = () => {
  const form = useForm({
    resolver: zodResolver(PurchaseRequestMutationSchema),
    mode: "onChange",
    defaultValues: {
      department: "",
      purpose: "",
      dateRequested: "",
      items: [{ quantity: 0, uom: "", description: "", suppliers: "", remarks: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = (data: z.infer<typeof PurchaseRequestMutationSchema>) => {
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
        <h2 className="text-3xl font-bold text-center">Purchase Request Form</h2>
        <Separator className="h-1 w-full bg-lime-700" />

        {/* Requestee */}
        <div className="grid grid-cols-3 gap-6 pt-8 px-24 pb-8">
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Department name" className="border-b-2 border-b-gray-700 rounded-b-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel>Purpose</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Purpose" className="border-b-2 border-b-gray-700 rounded-b-none" {...field} />
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
          <h3 className="text-lg font-semibold pb-4 text-center">Request Details</h3>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="text-center border-2 border-gray-700 p-2">Quantity</th>
                  <th className="text-center border-2 border-gray-700 p-2">Unit of Measurement (UOM)</th>
                  <th className="text-center border-2 border-gray-700 p-2">Item Description</th>
                  <th className="text-center border-2 border-gray-700 p-2">Suppliers</th>
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
                    name={`items.${index}.quantity`}
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
                    name={`items.${index}.uom`}
                    render={({ field }) => (
                      <FormControl>
                        <Input placeholder="Enter unit of measurement" {...field} />
                      </FormControl>
                    )}
                  />
                </td>
                <td className="border-2 border-gray-700 p-2">
                  <FormField
                    control={form.control}
                    name={`items.${index}.description`}
                    render={({ field }) => (
                      <FormControl>
                        <Input placeholder="Enter item description" {...field} />
                      </FormControl>
                    )}
                  />
                </td>
                <td className="border-2 border-gray-700 p-2">
                  <FormField
                    control={form.control}
                    name={`items.${index}.suppliers`}
                    render={({ field }) => (
                      <FormControl>
                        <Input placeholder="Enter Suppliers" {...field} />
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
          <Button type="button" variant="outline" className="flex items-center justify-center gap-2 mt-4" onClick={() => append({ quantity: 0, uom: "", description: "", suppliers: "", remarks: "" })}>
            <Plus size={20} />
            Add Row
          </Button>
          <p className="text-base text-center pb-8">NOTE: Write an "NF" / Nothing Follows at the end of the last item requested.</p>
        </div>
        <Separator className="h-1 w-full bg-lime-700" />

        <SignatoriesSection form={form}/> 

        <Separator className="h-1 w-full bg-lime-700" />

        <div className="flex items-end justify-end">
            <Button type="submit" className="w-min mt-4">
              Submit Request
            </Button>
        </div>
        <div className="flex justify-center mb-4">
          <img src="/logo-footer.png" alt="Logo" className="h-40 w-auto m-4" />
        </div>
      </form>
    </Form>
  );
};

export default PurchaseRequestForm;
