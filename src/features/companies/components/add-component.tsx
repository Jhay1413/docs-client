import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useCompany } from "../hooks/query-gate";
import { CompanyForm } from "./company-form";
import { z } from "zod";
import { companyFormData } from "shared-contract";
import { tsr } from "@/services/tsr";
import { toast } from "react-toastify";

export const AddComponent = () => {
  const tsrQueryClient = tsr.useQueryClient();
  const { add } = useCompany("/", "companies", null);
  const { mutate, isPending } = tsr.company.insertCompany.useMutation({
    onMutate: (data) => {
      const lastGoodKnown = tsrQueryClient.company.fetchCompanies.getQueryData(["companies"]);
      tsrQueryClient.company.fetchCompanies.setQueryData(["companies"], (old) => {
        if (!old || !old.body) return old;
        return {
          ...old,
          body: {
            ...old.body,
            data,
          },
        };
      });
      return { lastGoodKnown };
    },
    onSuccess: () => {
      toast.success("New company added ! ");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong ! ");
    },
  });
  const form = useForm<z.infer<typeof companyFormData>>({
    resolver: zodResolver(companyFormData),
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
          email: null,
          contactPersons: {
            name: "",
            contactNumber: "",
            email: null,
          },
        },
      ],
      contactPersons: null,
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

  const onSubmit: SubmitHandler<z.infer<typeof companyFormData>> = async (data) => {
    mutate({ body: data });
  };
  return (
    <div className="flex flex-col gap-4 p-4 w-full h-full bg-white ">
      <h1 className="text-4xl ">Company Form</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CompanyForm fields={projectFields} append={appendProject} remove={remove} />
          <Separator className="mt-4" />
          <div className="mt-4 flex w-full justify-end">
            <Button type="submit" onClick={() => console.log(form.formState.errors)} disabled={add.isPending}>
              {add.isPending ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
