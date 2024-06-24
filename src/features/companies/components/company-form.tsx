import { FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove, useFormContext } from "react-hook-form";
import { TCompanyFullInfo } from "../schema/companySchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import FormInput from "@/components/formInput";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CirclePlus, CircleX } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

type Props = {
  fields: FieldArrayWithId<TCompanyFullInfo, "companyProjects">[];
  append: UseFieldArrayAppend<TCompanyFullInfo, "companyProjects">;
  remove: UseFieldArrayRemove;
};

export const CompanyForm = ({ fields, append, remove }: Props) => {
  const { control } = useFormContext();
  const [retainership, setRetainership] = useState(false);
  return (
    <div className="flex flex-col gap-4 ">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3">
          <h1 className="font-semibold text-2xl">Company Details</h1>
        </div>
        <Separator className="col-span-3" />
        <FormInput
          name="companyId"
          placeholder="Company ID"
          label="Company ID"
        />
        <FormInput
          name="companyName"
          placeholder="Company Name"
          label="Company Name"
        />
        <FormInput
          name="companyAddress"
          placeholder="Company Address"
          label="Company Address"
        />
         <FormInput
          name="email"
          placeholder="Email"
          label="Email"
        />
        <FormInput
          name="contactPersons.name"
          placeholder="Contact Person Name"
          label="Contact Person Name"
        />
        <FormInput
          name="contactPersons.email"
          placeholder="Contact Person Email"
          label="Contact Person Email"
        />
        <FormInput
          name="contactPersons.contactNumber"
          placeholder="Contact Person Number"
          label="Contact Person Number"
        />
        
      </div>
      <div className="w-full flex flex-col">
        <div className="col-span-3">
          <h1 className="font-semibold text-2xl">Company Projects</h1>
        </div>

        {fields.map((_, index) => (
          <div
            key={`parent_${index}`}
            className="flex justify-between gap-4 relative"
          >
            <div
              key={`Project_${index}`}
              className="grid grid-cols-3 gap-4 w-full "
            >
              <Separator className="col-span-3 my-4" />
              <FormInput
                name={`companyProjects.${index}.projectId`}
                label="Project ID"
                placeholder="Project ID"
              />
              <FormInput
                name={`companyProjects.${index}.projectName`}
                label="Project Name"
                placeholder="Project Name"
              />
              <FormInput
                name={`companyProjects.${index}.projectAddress`}
                label="Project Address"
                placeholder="Project Address"
              />
               <FormInput
               name={`companyProjects.${index}.email`}
                label="Project email"
                placeholder="Project email"
              />
              <FormField
                control={control}
                name={`companyProjects.${index}.retainer`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Retainership</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          const booleanValue = value === "true";
                          field.onChange(booleanValue);
                          setRetainership(booleanValue);
                        }}
                        defaultValue={String(field.value)}
                        value={String(field.value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select " />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormInput
                name={`companyProjects.${index}.contactPersons.name`}
                label="Contact person name"
                placeholder="Contact person name"
              />
              <FormInput
                name={`companyProjects.${index}.contactPersons.contactNumber`}
                label="Contact Number"
                placeholder="Contact Number"
              />
               <FormInput
                name={`companyProjects.${index}.contactPersons.email`}
                label="Contact Email"
                placeholder="Contact Email"
              />
              {retainership && (
                <FormInput
                  type="date"
                  name={`companyProjects.${index}.date_expiry`}
                  label="Expiry Date"
                />
              )}
            </div>
            {index === fields.length - 1 && (
              <div key={`child_${index}`} className="absolute  right-0  ">
                <Button
                  variant="ghost"
                  onClick={() =>
                    append({
                      projectId: "",
                      projectName: "",
                      projectAddress: "",
                      retainer: false,
                      date_expiry: null,
                      email:"",
                      contactPersons: {
                        name: "",
                        contactNumber: "",
                        email:null
                      },
                    })
                  }
                >
                  <CirclePlus />
                </Button>
                <Button variant="ghost" onClick={() => remove(index)}>
                  <CircleX />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
