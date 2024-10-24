// TicketFormEPD.tsx
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useEffect } from "react";

const TicketFormEPD = () => {
  const { control } = useFormContext(); // Ensure you're using it inside a FormProvider

  if (!control) {
    return <div>Error: No form context found!</div>; // Optional: Handle if context is missing
  }

  return (
    <div className="grid grid-cols-2 gap-6 bg-gray-50 rounded-md mb-4">
      {/* Project (Dropdown Select) */}
      <FormField
        control={control}
        name="project"
        render={({ field }) => (
          <FormItem className="col-span-1">
            <FormLabel>Project</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Project A">Project A</SelectItem>
                  <SelectItem value="Project B">Project B</SelectItem>
                  <SelectItem value="Project C">Project C</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Transaction ID (Input) */}
      <FormField
        control={control}
        name="transactionId"
        render={({ field }) => (
          <FormItem className="col-span-1">
            <FormLabel>Transaction ID</FormLabel>
            <FormControl>
              <input
                type="text"
                className="w-full h-10 px-4 text-sm border border-gray-300 rounded-md"
                {...field}
                placeholder="Enter transaction ID"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TicketFormEPD;