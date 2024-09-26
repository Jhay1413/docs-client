import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useParams } from "react-router-dom";
import { useTransaction } from "../hooks/query-gate";
import { transactionData } from "../schema/TransactionSchema";
import { historyColumn } from "./table-columns/history-column";
import { DataTable } from "@/components/data-table";
import { TransactionDetails } from "./transaction-details";
import { useState } from "react";
import { IerPage } from "./table-data/ier-summary";
import { CompleteStaffWorkForm } from "../forms/csw-form";
import { CswComponent } from "./table-data/csw-list";
import { tsr } from "@/services/tsr";

enum View {
  IER,
  CSW,
  DETAILS,
}
export const HistoryComponent = () => {
  const { id } = useParams();
  const [view, setView] = useState<View>(View.DETAILS);
  const { data, isPending } = tsr.transaction.fetchTransactionById.useQuery({
    queryKey: ["transaction", id],
    queryData: {
      params: { id: id! },
    },
  });
  // const { entity, update } = useTransaction({
  //   key: `transactions`,
  //   url: `v2/${id}`,
  //   id,
  // });

  // const validatedData = transactionData.safeParse(entity.data);
  // console.log(data?.body);
  // if (entity.isLoading) return "loading";

  // if (!succ?.bodyess || !data?.body) {
  //   console.log(entity.data);
  //   console.log(erro?.bodyr.errors);
  //   return "something went wrong !";
  // }

  if (isPending || !data?.body) {
    return "loading";
  }
  const attachmentForIer =
    data.body.attachments?.filter(
      (attachment) => attachment.fileType === "INITIAL_DOC"
    ) || [];
  return (
    <div className="flex flex-col w-full  p-4 rounded-lg">
      <div className=" space-y-8">
        {/* <h1 className="font-roboto text-xl">{id}</h1> */}
        <div className="flex justify-start px-2 gap-4 ">
          <div className="flex w-16  shadow-xl ">
            <button
              className={`w-full text-sm bg-transparent border-0 shadow-none focus:outline-none flex items-center justify-center  p-2   ${
                view === View.DETAILS
                  ? "border-b-2 border-b-green-500 text-sm"
                  : ""
              }`}
              onClick={() => setView(View.DETAILS)}
              type="button"
            >
              Details
            </button>
          </div>

          <div className="flex w-16  shadow-xl ">
            <button
              className={`w-full text-sm bg-transparent border-0 shadow-none focus:outline-none flex items-center justify-center  p-2   ${
                view === View.CSW
                  ? "border-b-2 border-b-green-500 text-sm"
                  : "text-sm"
              }`}
              onClick={() => setView(View.CSW)}
            >
              CSW
            </button>
          </div>

          <div className="flex w-16  shadow-xl ">
            <button
              className={`w-full text-sm bg-transparent border-0 shadow-none focus:outline-none flex items-center justify-center  p-2   ${
                view === View.IER
                  ? "border-b-2 border-b-green-500 text-sm"
                  : "text-sm"
              }`}
              onClick={() => setView(View.IER)}
            >
              IER
            </button>
          </div>
        </div>
        <Separator className="h" />
        <div className="">
          <h1 className="text-xl font-normal">{data?.body.transactionId}</h1>
        </div>
        {view === View.IER ? (
          <IerPage data={attachmentForIer} />
        ) : view === View.CSW ? (
          <CswComponent
            transactionId={data?.body.id || ""}
            data={data?.body.completeStaffWork || []}
          />
        ) : (
          <>
            <TransactionDetails data={data?.body} />
            <div className="flex flex-col">
              <h1 className="text-muted-foreground text-lg">History</h1>
              <DataTable
                columns={historyColumn}
                data={data?.body?.transactionLogs!}
              />
            </div>
          </>
        )}
        <Separator />
      </div>
    </div>
  );
};
