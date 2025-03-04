import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useCompany } from "../hooks/query-gate";
import { CompanyForm } from "./company-form";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { CompanyInfo } from "../schema/companySchema";
import { z } from "zod";
import { tsr } from "@/services/tsr";
import { companyFormData } from "shared-contract";

export const EditComponent = () => {
  const { id } = useParams();

  const { mutate, isPending } = tsr.company.editCompanyById.useMutation({
    onMutate: (data) => {},
    onSuccess: () => {},
    onError: () => {},
  });
  const { data, isLoading } = tsr.company.fetchCompany.useQuery({
    queryKey: ["company", id],
    queryData: { params: { id: id! } },
  });
  const form = useForm<z.infer<typeof companyFormData>>({
    resolver: zodResolver(companyFormData),
    defaultValues: {
      id: data?.body?.id,
      companyId: data?.body?.companyId,
      email: data?.body?.email,
      companyAddress: data?.body?.companyAddress,
      companyName: data?.body?.companyName,
      companyProjects: data?.body?.companyProjects,
      contactPersons: data?.body?.contactPersons,
    },
  });
  const {
    fields: projectFields,
    append: appendProject,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "companyProjects",
  });

  const onSubmit: SubmitHandler<z.infer<typeof companyFormData>> = async (formData) => {
    mutate({
      params: { id: id! },

      body: formData,
    });
  };
  useEffect(() => {
    if (data?.body) {
      form.reset({
        id: data.body.id,
        companyId: data.body.companyId,
        email: data.body.email,
        companyAddress: data.body.companyAddress,
        companyName: data.body.companyName,
        companyProjects: data.body.companyProjects,
        contactPersons: data.body.contactPersons,
      });
    }
  }, [data?.body, form]);

  if (isLoading) return "Loading!!";
  return (
    <div className="flex flex-col gap-4 p-4 w-full h-full bg-white ">
      <h1 className="text-4xl ">Company Form</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CompanyForm fields={projectFields} append={appendProject} remove={remove} />
          <Separator className="mt-4" />
          <div className="mt-4 flex w-full justify-end">
            <Button type="submit" onClick={() => console.log(form.formState.errors)} disabled={isPending}>
              {isPending ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
