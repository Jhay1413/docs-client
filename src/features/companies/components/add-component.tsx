import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useCompany } from "../hooks/query-gate";
import { CompanyForm } from "./company-form";
import { CompanyInfo } from "../schema/companySchema";
import { z } from "zod";

export const AddComponent = () => {
  const { add } = useCompany("/", "companies", null);

  const form = useForm<z.infer<typeof CompanyInfo>>({
    resolver: zodResolver(CompanyInfo),
    defaultValues: {
      companyId: "",
      companyAddress: "",
      companyName: "",
      email: null,
      companyProjects: [
        {
          projectName: "",
          projectAddress: "",
          retainer: false,
          date_expiry: null,
          email:null,
          contactPersons: {
            name: "",
            contactNumber: "",
            email:null
          },
        },
      ],
      contactPersons:
        {
          name: "",
          contactNumber: "",
          email: null
        } || null,
    },
  });

  useEffect(() => {
    if (add.isSuccess) {
      form.reset();
    }
  }, [add.isSuccess, form.reset]);
  const {
    fields: projectFields,
    append: appendProject,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "companyProjects",
  });

  const onSubmit: SubmitHandler<z.infer<typeof CompanyInfo>> = async (data) => {
    add.mutate(data);
  };
  return (
    <div className="flex flex-col gap-4 p-4 w-full h-full bg-white ">
      <h1 className="text-4xl ">Company Form</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CompanyForm
            fields={projectFields}
            append={appendProject}
            remove={remove}
          />
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
