// TicketFormEPD.tsx
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useEffect } from "react";

const TicketFormMRKT= () => {
  const { control } = useFormContext(); // Ensure you're using it inside a FormProvider

  if (!control) {
    return <div>Error: No form context found!</div>; // Optional: Handle if context is missing
  }

  return (
    <div className="">

    </div>
  );
};

export default TicketFormMRKT;