import { Separator } from "@/components/ui/separator";
import { useLocation } from "react-router-dom";
import { transactionLogsData } from "../schema/TransactionSchema";
import { DocumentTable } from "./table-data/document-table";

export const ViewHistory = () => {
  const { state } = useLocation();
  const validatedData = transactionLogsData.safeParse(state.transactionInfo);
  console.log(state);
  if (!validatedData.success) 
    console.log(validatedData.error.errors);
  if(!validatedData.data) return "Something went wrong !"

  return (
    <div className="flex flex-col w-full  p-4 rounded-lg">
      <div className="flex flex-col space-y-12">
        <h1 className="text-muted-foreground text-lg">Details</h1>
        <div className="flex gap-y-10 gap-x-12 w-full shadow-md p-4 rounded-lg">
          <div className="grid grid-cols-3 gap-10 p-4 w-full">
            <div className="flex flex-col">
              <h1 className="text-muted-foreground text-sm">Company name:</h1>
              <h1 className="text-base font-semibold">
                {validatedData.data?.company}
              </h1>
            </div>

            <div className="flex flex-col">
              <h1 className="text-muted-foreground text-sm">Project name:</h1>
              <h1 className="text-base font-semibold">
                {validatedData.data?.project}
              </h1>
            </div>
            <div className="flex flex-col">
              <h1 className="text-muted-foreground text-sm">Department:</h1>
              <h1 className="text-base font-semibold">
                {validatedData.data?.originDepartment}
              </h1>
            </div>
            <div className="flex flex-col">
              <h1 className="text-muted-foreground text-sm">Section:</h1>
              <h1 className="text-base font-semibold">
                {validatedData.data?.team}
              </h1>
            </div>
            <div className="flex flex-col">
              <h1 className="text-muted-foreground text-sm">Document type:</h1>
              <h1 className="text-base font-semibold">
                {validatedData.data?.documentType}
              </h1>
            </div>
            <div className="flex flex-col">
              <h1 className="text-muted-foreground text-sm">
                Document Sub type:
              </h1>
              <h1 className="text-base font-semibold">
                {validatedData.data?.documentSubType}
              </h1>
            </div>
            <div className="flex flex-col">
              <h1 className="text-muted-foreground text-sm">Subject:</h1>
              <h1 className="text-base font-semibold">
                {validatedData.data?.subject}
              </h1>
            </div>
          </div>
          <div className=" w-2 bg-green-500" />
          <div className="grid grid-cols-3 gap-10 p-4 w-full">
            <div className="flex flex-col">
              <h1 className="text-muted-foreground text-sm">Forwarded To:</h1>
              <h1 className="text-base font-semibold">
                {validatedData.data?.targetDepartment}
              </h1>
            </div>
            <div className="flex flex-col">
              <h1 className="text-muted-foreground text-sm">Due Date:</h1>
              <h1 className="text-base font-semibold">
                {validatedData.data?.dueDate}
              </h1>
            </div>
            <div className="flex flex-col">
              <h1 className="text-muted-foreground text-sm">Priority:</h1>
              <h1 className="text-base font-semibold">
                {validatedData.data?.priority}
              </h1>
            </div>
            <div className="flex flex-col">
              <h1 className="text-muted-foreground text-sm">Status:</h1>
              <h1 className="text-base font-semibold">
                {validatedData.data?.status}
              </h1>
            </div>
            <div className="flex flex-col col-span-2">
              <h1 className="text-muted-foreground text-sm">Remarks:</h1>
              <h1 className="text-base font-semibold">
                {validatedData.data?.remarks}
              </h1>
            </div>
            <div className="flex flex-col">
              <h1 className="text-muted-foreground text-sm">Date Forwarded:</h1>
              <h1 className="text-base font-semibold">
                {new Date(validatedData.data?.dateForwarded).toDateString()}
              </h1>
            </div>
          </div>
        </div>
        <Separator />
        <DocumentTable data= {validatedData.data.attachments!} />
      </div>
    </div>
  );
};
