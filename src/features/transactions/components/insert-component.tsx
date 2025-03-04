import { TransactionForm } from "../forms/transaction-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

import { transactionMutationSchema } from "shared-contract";
import { toast } from "react-toastify";
import { tsr } from "@/services/tsr";

export const InsertComponent = () => {
  const tsrQueryClient = tsr.useQueryClient();
  // const { add } = useTransaction({key:"inbox",url:"/v2"});
  const { mutateAsync, isPending } = tsr.transaction.insertTransactions.useMutation({
    onSuccess: () => {
      toast.success("Data submitted successfully ! ");
      navigate("/dashboard/transactions/list");
    },
    onError: (error) => {
      console.log(error);
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

  const onSubmit = async (transactionData: z.infer<typeof transactionMutationSchema>) => {
    try {
      if (transactionData.status !== "ARCHIVED" && !transactionData.receiverId) {
        throw new Error("Receiver not found !");
      }

      const attachments = transactionData.attachments.map(({ file, ...newData }) => newData);
      const payload = {
        ...transactionData,
        attachments: attachments,
      };
      await mutateAsync({ body: payload });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      toast.error(errorMessage);
      console.log(error);
    }
  };

  if (companiesIsLoading) return "loading";
  return (
    <div className="w-full h-full bg-white p-4 rounded-lg">
      <TransactionForm company={companies ? companies.body : null} mutateFn={onSubmit} isPending={isPending} />
    </div>
  );
};
