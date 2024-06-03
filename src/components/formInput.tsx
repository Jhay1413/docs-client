// ItemInput.tsx

import { useFormContext } from "react-hook-form"; // Import useFormContext
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type InputProps = {
  name: string;
  placeholder: string;
  label?: string;
  description?: string;
  link?: string;
  disable?: boolean;
  type?: string;
  readOnly?: boolean;
};

const FormInput = ({
  name,
  placeholder,
  label,
  description,
  type,
  disable,
  readOnly
}: InputProps) => {
  const { control } = useFormContext(); // Use useFormContext to access the form control

  return (
    <div>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input type= {type} placeholder={placeholder} {...field} disabled={disable} readOnly = {readOnly}/>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default FormInput;
