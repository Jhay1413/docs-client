import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { TCompanyFullInfo, companyFullInfo } from "../schema/companySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useCompany } from "../hooks/query-gate";
import { CompanyForm } from "./company-form";
import { useParams } from "react-router-dom";

export const EditComponent = () => {
  const { id } = useParams();
  const { entity } = useCompany(`/${id}`, "companies", id);
  console.log(entity.data);
  const form = useForm<TCompanyFullInfo>({
    resolver: zodResolver(companyFullInfo),
    defaultValues: {
      id:entity.data?.id,
      companyId: entity.data?.companyId,
      companyAddress: entity.data?.companyAddress,
      companyName: entity.data?.companyName,
      companyProjects: entity.data?.companyProjects,
      contactPersons:
        {
          name: entity.data?.contactPersons?.name,
          contactNumber: entity.data?.contactPersons?.contactNumber,
        } || null,
    },
  });

  //   useEffect(() => {
  //     if (add.isSuccess) {
  //       form.reset();
  //     }
  //   }, [add.isSuccess, form.reset]);
  const {
    fields: projectFields,
    append: appendProject,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "companyProjects",
  });

  const onSubmit: SubmitHandler<TCompanyFullInfo> = async () => {
    // add.mutate(data);
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
            {/* <Button
              type="submit"
              onClick={() => console.log(form.formState.errors)}
              disabled={add.isPending}
            >
              {add.isPending ? "Submitting..." : "Submit"}
            </Button> */}
          </div>
        </form>
      </Form>
    </div>
  );
};
