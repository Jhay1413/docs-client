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


enum View {
  IER,
  CSW,
  DETAILS
}
export const HistoryComponent = () => {
  const { id } = useParams();
  const [view,setView] = useState<View>(View.DETAILS)

  const { entity } = useTransaction(`${id}`, "transactions", id);
  const validatedData = transactionData.safeParse(entity.data);

  if (entity.isLoading) return "loading";

  if (!validatedData.success || !validatedData.data) {
    console.log(entity.data);
    console.log(validatedData.error.errors);
    return "something went wrong !";
  }
  const attachmentForIer =
    validatedData.data.attachments?.filter(
      (attachment) => attachment.fileType === "INITIAL_DOC"
    ) || [];

  
  return (
    <div className="flex flex-col w-full  p-4 rounded-lg">
      <div className="flex flex-col space-y-12">
        <h1 className="font-roboto text-xl">{id}</h1>
        <div className="flex gap-4 justify-start">
          <div className="flex w-32  bg-white border-2 shadow-xl border-gray-200 rounded-md hover:bg-green-500 ">
            <Button
              variant="link"
              className={`w-full hover:text-white ${
                view === View.DETAILS ? "bg-green-500" : ""
              }`}
              onClick={()=>setView(View.DETAILS)}
            >
              Details
            </Button>
          </div>

          <div className="flex w-32  bg-white border-2 shadow-xl border-gray-200 rounded-md hover:bg-green-500 ">
            <Button
              variant="link"
              className={`w-full hover:text-white ${
                view === View.CSW ? "bg-green-500" : ""
              }`}
              onClick={()=>setView(View.CSW)}
            >
              CSW
            </Button>
          </div>

          <div className="flex w-32  bg-white border-2 shadow-xl border-gray-200 rounded-md hover:bg-green-500 ">
            <Button
              variant="link"
              type="button"
              className={`w-full hover:text-white ${
                view === View.IER ? "bg-green-500" : ""
              }`}
              onClick={()=>setView(View.IER)}
            >
              IER
            </Button>
          </div>
        </div>
        <Separator className="h" />

        {view === View.IER ? (
          <IerPage data={attachmentForIer} />
        ) : view === View.CSW ? (
          <CompleteStaffWorkForm
            transactionId={validatedData.data.id || ""}
            data={validatedData.data.completeStaffWork || []}
          />
        ) : (
          <>
            <TransactionDetails data={validatedData.data} />
            <div className="flex flex-col">
              <h1 className="text-muted-foreground text-lg">History</h1>
              <DataTable
                columns={historyColumn}
                data={validatedData.data?.transactionLogs!}
              />
            </div>
          </>
        )}
        <Separator />
      </div>
    </div>
  );
};
