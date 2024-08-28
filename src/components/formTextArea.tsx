// ItemInput.tsx

import { useFormContext } from "react-hook-form"; // Import useFormContext
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";

type InputProps = {
  name: string;
  placeholder?: string;
  label?: string;
  description?: string;
  link?: string;
  disable?: boolean;
  type?: string;
  readOnly?: boolean;
  value?:string
};

const FormTextArea = ({
  name,
  placeholder,
  label,
  description,
  type,
  disable,
  readOnly,
  value
}: InputProps) => {
  const { control } = useFormContext(); // Use useFormContext to access the form control

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem    className="w-full h-full"> 
          <FormLabel>{label}</FormLabel>
          <FormControl className="w-full h-full">
            <Textarea
              className="grow"
              placeholder={placeholder}
              {...field}
              disabled={disable}
              readOnly={readOnly}
              value={field.value}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormTextArea;
