import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useParams } from "react-router-dom";
import { useTransaction } from "../hooks/query-gate";
import { transactionData } from "../schema/TransactionSchema";
import { historyColumn } from "./table-columns/history-column";
import { DataTable } from "@/components/data-table";

export const HistoryComponent = () => {
  const { id } = useParams();

  const { entity } = useTransaction(`${id}`, "transactions", id);
  const validatedData = transactionData.safeParse(entity.data);

  if (entity.isLoading) {
    return "loading";
  }
  if (!validatedData.success) {
    console.log(entity.data)
    console.log(validatedData.error.errors);
  }
  if (!entity.data) {
    return "";
  }
  return (
    <div className="flex flex-col w-full  p-4 rounded-lg">
      <div className="flex flex-col space-y-12">
        <h1 className="font-roboto text-xl">{id}</h1>
        <div className="flex gap-4 justify-start">
          <div className="flex w-32  bg-white border-2 shadow-xl border-gray-200 rounded-md hover:bg-green-500 ">
            <Button variant="link" className="w-full hover:text-white">
              Details
            </Button>
          </div>

          <div className="flex w-32  bg-white border-2 shadow-xl border-gray-200 rounded-md hover:bg-green-500 ">
            <Button variant="link" className="w-full hover:text-white">
              History
            </Button>
          </div>

          <div className="flex w-32  bg-white border-2 shadow-xl border-gray-200 rounded-md hover:bg-green-500 ">
            <Button variant="link" className="w-full hover:text-white">
              CSW
            </Button>
          </div>
        </div>
        <Separator className="h" />
        <h1 className="text-muted-foreground text-lg">Details</h1>
        <div className="grid grid-cols-3 gap-y-10 w-full shadow-md px-16 py-8 rounded-lg">
          <div className="flex flex-col">
            <h1 className="text-muted-foreground text-sm">Company name:</h1>
            <h1 className="text-base font-semibold">
              {validatedData.data?.company?.companyName}
            </h1>
          </div>
          <div className="flex flex-col">
            <h1 className="text-muted-foreground text-sm">Company address:</h1>
            <h1 className="text-base font-semibold">
              {validatedData.data?.company?.companyAddress}
            </h1>
          </div>
          <div className="flex flex-col">
            <h1 className="text-muted-foreground text-sm">Company address:</h1>
            <h1 className="text-base font-semibold">
              {validatedData.data?.company?.email}
            </h1>
          </div>
          <div className="flex flex-col">
            <h1 className="text-muted-foreground text-sm">
              Company contact person:
            </h1>
            <h1 className="text-base font-semibold">
              {validatedData.data?.company?.contactPersons?.name}
            </h1>
          </div>
          <div className="flex flex-col col-span-2">
            <h1 className="text-muted-foreground text-sm">
              Company contact number:
            </h1>
            <h1 className="text-base font-semibold">
              {validatedData.data?.company?.contactPersons?.contactNumber}
            </h1>
          </div>
          <div className="flex flex-col">
            <h1 className="text-muted-foreground text-sm">Project name:</h1>
            <h1 className="text-base font-semibold">
              {validatedData.data?.project?.projectName}
            </h1>
          </div>
          <div className="flex flex-col">
            <h1 className="text-muted-foreground text-sm">Project address:</h1>
            <h1 className="text-base font-semibold">
              {validatedData.data?.project?.projectAddress}
            </h1>
          </div>
          <div className="flex flex-col">
            <h1 className="text-muted-foreground text-sm">Contact Person:</h1>
            <h1 className="text-base font-semibold">
              {validatedData.data?.project?.contactPersons?.name}
            </h1>
          </div>
          <div className="flex flex-col">
            <h1 className="text-muted-foreground text-sm">Contact email:</h1>
            <h1 className="text-base font-semibold">
              {validatedData.data?.project?.contactPersons?.email}
            </h1>
          </div>
          <div className="flex flex-col">
            <h1 className="text-muted-foreground text-sm">Contact number:</h1>
            <h1 className="text-base font-semibold">
              {validatedData.data?.project?.contactPersons?.contactNumber}
            </h1>
          </div>
        </div>
        <div className="flex gap-y-10 gap-x-12 w-full shadow-md p-4 rounded-lg">
          <div className="grid grid-cols-3 gap-10 p-4 w-full">
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
              <h1 className="text-muted-foreground text-sm">
               Status:
              </h1>
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
              <h1 className="text-muted-foreground text-sm">
               Date Forwarded:
              </h1>
              <h1 className="text-base font-semibold">
                {validatedData.data?.dateForwarded}
              </h1>
            </div>
          </div>
        </div>
        <Separator />

        <div className="flex flex-col">
          <h1 className="text-muted-foreground text-lg">History</h1>
          <DataTable
            columns={historyColumn}
            data={validatedData.data?.transactionLogs!}
          />
        </div>
      </div>
    </div>
  );
};
