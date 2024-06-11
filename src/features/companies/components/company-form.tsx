import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { TCompanyFullInfo, companyFullInfo } from "../schema/companySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { useEffect, useState } from "react";
import { useCompany } from "../hooks/useCompanyHooks";

export const CompanyForm = () => {
  const [retainership, setRetainership] = useState(false);
  const { add } = useCompany("company", null);
  const form = useForm<TCompanyFullInfo>({
    resolver: zodResolver(companyFullInfo),
    defaultValues: {
      companyId: "",
      companyAddress: "",
      companyName: "",
      companyProjects: [
        {
          projectName: "",
          projectAddress: "",
          retainer: false,
          date_expiry: null,
          contactPersons: {
            name: "",
            contactNumber: "",
          },
        },
      ],
      contactPersons:
        {
          name: "",
          contactNumber: "",
        } || null,
    },
  });

  useEffect(() => {
    if (add.status === "success") {
      form.reset();
    }
  }, [add.status, form.reset]);
  const {
    fields: projectFields,
    append: appendProject,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "companyProjects",
  });

  const onSubmit: SubmitHandler<TCompanyFullInfo> = async (data) => {
     add.mutate(data);
    
  };
  return (
    <div className="flex flex-col gap-4 p-4 w-full h-full bg-white ">
      <h1 className="text-4xl ">Company Form</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                name="contactPersons.name"
                placeholder="Contact Person Name"
                label="Contact Person Name"
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

              {projectFields.map((_, index) => (
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
                      name={`companyProjects.${index}.projectName`}
                      label="Project Name"
                      placeholder="Project Name"
                    />
                    <FormInput
                      name={`companyProjects.${index}.projectAddress`}
                      label="Project Address"
                      placeholder="Project Address"
                    />
                    <FormField
                      control={form.control}
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
                      label="Contact person address"
                      placeholder="Contact person address"
                    />
                    {retainership && (
                      <FormInput
                        type="date"
                        name={`companyProjects.${index}.date_expiry`}
                        label="Expiry Date"
                      />
                    )}
                  </div>
                  {index === projectFields.length - 1 && (
                    <div key={`child_${index}`} className="absolute  right-0  ">
                      <Button
                        variant="ghost"
                        onClick={() =>
                          appendProject({
                            projectName: "",
                            projectAddress: "",
                            retainer: false,
                            date_expiry: null,
                            contactPersons: {
                              name: "",
                              contactNumber: "",
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
          <Separator className="mt-4" />
          <div className="mt-4 flex w-full justify-end">
            <Button
              type="submit"
              onClick={() => console.log(form.formState.errors)}
              disabled={add.isPending}
            >
              {add.isPending ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
