import { useTransaction } from "../hooks/query-gate";
import { useCompanies } from "@/features/companies";
import { TransactionForm } from "../forms/transaction-form";
import { signedUrlDataArray, transactionFormData } from "../schema/TransactionSchema";
import { z } from "zod";
import { prepare_file_payload, prepare_transaction_payload } from "../utils/pre-process-data";
import { getSignedUrl } from "../services/getSignedUrl";
import { redirect, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { transactionMutationSchema } from "shared-contract";
import { toast } from "react-toastify";
import { tsr } from "@/services/tsr";

export const InsertComponent = () => {
  const tsrQueryClient = tsr.useQueryClient();
  // const { add } = useTransaction({key:"inbox",url:"/v2"});
  const { mutateAsync, isPending } = tsr.transaction.insertTransacitons.useMutation({
    onSuccess: () => {
      toast.success("Data submitted successfully ! ");
      navigate("/dashboard/transactions/list");
    },
    onError: () => {
      toast.error("Something went wrong, Please retry ! ");
    },
    onSettled: () => {
      tsrQueryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const { data: companies, isLoading: companiesIsLoading } = tsr.company.fetchCompanies.useQuery({
    queryKey: ["companies"],
  });

  const navigate = useNavigate();

  const onSubmit = async (transactionData: z.infer<typeof transactionMutationSchema>, setIsSubmitting: (value: boolean) => void) => {
    const attachments = transactionData.attachments?.filter((data) => data.file?.length! > 0);

    if (!attachments || attachments.length === 0) return mutateAsync({ body: transactionData });

    const selectedCompany = companies?.body?.find((company) => transactionData.companyId === company.id);

    const signedUrlPayload = attachments?.map((attachment) => {
      return {
        company: selectedCompany!.companyName!,
        fileName: attachment.fileName!,
      };
    });

    const getSignedUrlForUpload = await getSignedUrl(signedUrlPayload);
    const validatedData = signedUrlDataArray.safeParse(getSignedUrlForUpload);

    if (!validatedData.success) return null;

    const res = await prepare_file_payload(attachments, validatedData.data);

    const payload = prepare_transaction_payload(transactionData, res);

    await mutateAsync({ body: payload });
  };

  if (companiesIsLoading) return "loading";
  return (
    <div className="w-full h-full bg-white p-4 rounded-lg">
      <TransactionForm company={companies ? companies.body : null} mutateFn={onSubmit} />
    </div>
  );
};
