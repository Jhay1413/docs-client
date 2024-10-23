import { Separator } from "@/components/ui/separator";
import { useParams, useSearchParams } from "react-router-dom";
import { historyColumn } from "./table-columns/history-column";
import { DataTable } from "@/components/data-table";
import { TransactionDetails } from "./transaction-details";
import { useEffect, useState } from "react";
import { IerPage } from "./table-data/ier-summary";
import { CswComponent } from "./table-data/csw-list";
import { tsr } from "@/services/tsr";
import { TransactionActions } from "./transaction-actions";
import { getCurrentUserId } from "@/hooks/use-user-hook";

enum View {
  IER,
  CSW,
  DETAILS,
}
export const HistoryComponent = () => {
  const tsrQueryClient = tsr.useQueryClient();
  const userId = getCurrentUserId();
  const { id } = useParams();
  const [view, setView] = useState<View>(View.DETAILS);
  const { data, isPending } = tsr.transaction.fetchTransactionById.useQuery({
    queryKey: ["transaction", id],
    queryData: {
      params: { id: id! },
    },
  });
  const { mutate } = tsr.notificationContract.readNotif.useMutation({
    onMutate: (data) => {
      const lastGoodKnown = tsrQueryClient.notificationContract.getNotificationsByUserId.getQueryData(["notifications", userId]);
      tsrQueryClient.notificationContract.getNotificationsByUserId.setQueryData(["notifications", userId], (old) => {
        if (!old || !old.body) return old;
        return {
          ...old,
          body: old.body.map((transaction) => {
            // Find the transaction by ID and modify its fields
            if (transaction.id === data.params.id) {
              return {
                ...transaction,
                dateRead: data.body.dateRead,
                isRead: true,
                // Update specific fields here, e.g., status: 'updated'
              };
            }
            return transaction; // Return unchanged transactions
          }),
        };
      });
      return { lastGoodKnown };
    },
    onError: (error, newPost, context) => {
      tsrQueryClient.notificationContract.getNotificationsByUserId.setQueryData(["notifications", userId], context?.lastGoodKnown);
    },
    onSettled: () => {
      tsrQueryClient.invalidateQueries({ queryKey: ["notifications", userId] });
    },
  });
  const [searchParams] = useSearchParams();
  const notifId = searchParams.get("notifId") || null;

  useEffect(() => {
    if (notifId) {
      mutate({
        params: { id: notifId },
        body: { dateRead: new Date().toISOString() },
      });
      return;
    }
  }, [mutate, notifId]);
  if (isPending || !data?.body) {
    return "loading";
  }
  const attachmentForIer = data.body.attachments?.filter((attachment) => attachment.fileType === "INITIAL_DOC") || [];
  return (
    <div className="flex flex-col w-full  p-4 rounded-lg">
      <div className=" space-y-8">
        {/* <h1 className="font-roboto text-xl">{id}</h1> */}
        <div className="flex justify-start px-2 gap-4 ">
          <div className="flex w-16  shadow-xl ">
            <button
              className={`w-full text-sm bg-transparent border-0 shadow-none focus:outline-none flex items-center justify-center  p-2   ${
                view === View.DETAILS ? "border-b-2 border-b-green-500 text-sm" : ""
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
                view === View.CSW ? "border-b-2 border-b-green-500 text-sm" : "text-sm"
              }`}
              onClick={() => setView(View.CSW)}
            >
              CSW
            </button>
          </div>

          <div className="flex w-16  shadow-xl ">
            <button
              className={`w-full text-sm bg-transparent border-0 shadow-none focus:outline-none flex items-center justify-center  p-2   ${
                view === View.IER ? "border-b-2 border-b-green-500 text-sm" : "text-sm"
              }`}
              onClick={() => setView(View.IER)}
            >
              IER
            </button>
          </div>
        </div>
        <Separator className="h" />
        <div className="flex justify-between">
          <h1 className="text-xl font-normal">{data?.body.transactionId}</h1>
          {data.body.receiverId === userId && data.body.dateReceived && <TransactionActions transactionId={id!} />}
        </div>
        {view === View.IER ? (
          <IerPage data={attachmentForIer} percentage={data.body.percentage} />
        ) : view === View.CSW ? (
          <CswComponent transactionId={data?.body.id || ""} data={data?.body.completeStaffWork || []} />
        ) : (
          <>
            <TransactionDetails data={data?.body} />
            <div className="flex flex-col">
              <h1 className="text-muted-foreground text-lg">History</h1>
              <DataTable columns={historyColumn} data={data.body.transactionLogs || []} hasPaginate={true} />
            </div>
          </>
        )}
        <Separator />
      </div>
    </div>
  );
};
