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

export const HistoryComponent = () => {
  const { id } = useParams();

  const [isIerOpen, setIierOpen] = useState(false);
  const [isCswOpen, setIsCswOpen] = useState(false);
  const [isDetailsOpen, setDetailsIsOpen] = useState(false);

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

  const openDetailsPage = () => {
    setDetailsIsOpen(true);
    setIierOpen(false);
  };
  const openIerPage = () => {
    setIierOpen(true);
    setDetailsIsOpen(false);
  };
  return (
    <div className="flex flex-col w-full  p-4 rounded-lg">
      <div className="flex flex-col space-y-12">
        <h1 className="font-roboto text-xl">{id}</h1>
        <div className="flex gap-4 justify-start">
          <div className="flex w-32  bg-white border-2 shadow-xl border-gray-200 rounded-md hover:bg-green-500 ">
            <Button
              variant="link"
              className={`w-full hover:text-white ${
                isDetailsOpen ? "bg-green-500" : ""
              }`}
              onClick={openDetailsPage}
            >
              Details
            </Button>
          </div>

          <div className="flex w-32  bg-white border-2 shadow-xl border-gray-200 rounded-md hover:bg-green-500 ">
            <Button
              variant="link"
              className="w-full hover:text-white"
              onClick={openIerPage}
            >
              CSW
            </Button>
          </div>

          <div className="flex w-32  bg-white border-2 shadow-xl border-gray-200 rounded-md hover:bg-green-500 ">
            <Button
              variant="link"
              type="button"
              className={`w-full hover:text-white ${
                isIerOpen ? "bg-green-500" : ""
              }`}
              onClick={openIerPage}
            >
              IER
            </Button>
          </div>
        </div>
        <Separator className="h" />

        {isIerOpen ? (
          <IerPage data={attachmentForIer} />
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
