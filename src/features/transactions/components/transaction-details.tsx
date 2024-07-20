import { z } from "zod"
import { transactionData } from "../schema/TransactionSchema"

type Props = {
    data: z.infer<typeof transactionData>
}
export const TransactionDetails = ({data}:Props) =>{
    return (
        <>
            <h1 className="text-muted-foreground text-lg">Details</h1>
        <div className="grid grid-cols-3 gap-y-10 w-full shadow-md px-16 py-8 rounded-lg">
          <div className="flex flex-col">
            <h1 className="text-muted-foreground text-sm">Company name:</h1>
            <h1 className="text-base font-semibold">
              {data?.company?.companyName}
            </h1>
          </div>
          <div className="flex flex-col">
            <h1 className="text-muted-foreground text-sm">Company address:</h1>
            <h1 className="text-base font-semibold">
              {data?.company?.companyAddress}
            </h1>
          </div>
          <div className="flex flex-col">
            <h1 className="text-muted-foreground text-sm">Company address:</h1>
            <h1 className="text-base font-semibold">
              {data?.company?.email}
            </h1>
          </div>
          <div className="flex flex-col">
            <h1 className="text-muted-foreground text-sm">
              Company contact person:
            </h1>
            <h1 className="text-base font-semibold">
              {data?.company?.contactPersons?.name}
            </h1>
          </div>
          <div className="flex flex-col col-span-2">
            <h1 className="text-muted-foreground text-sm">
              Company contact number:
            </h1>
            <h1 className="text-base font-semibold">
              {data?.company?.contactPersons?.contactNumber}
            </h1>
          </div>
          <div className="flex flex-col">
            <h1 className="text-muted-foreground text-sm">Project name:</h1>
            <h1 className="text-base font-semibold">
              {data?.project?.projectName}
            </h1>
          </div>
          <div className="flex flex-col">
            <h1 className="text-muted-foreground text-sm">Project address:</h1>
            <h1 className="text-base font-semibold">
              {data?.project?.projectAddress}
            </h1>
          </div>
          <div className="flex flex-col">
            <h1 className="text-muted-foreground text-sm">Contact Person:</h1>
            <h1 className="text-base font-semibold">
              {data?.project?.contactPersons?.name}
            </h1>
          </div>
          <div className="flex flex-col">
            <h1 className="text-muted-foreground text-sm">Contact email:</h1>
            <h1 className="text-base font-semibold">
              {data?.project?.contactPersons?.email}
            </h1>
          </div>
          <div className="flex flex-col">
            <h1 className="text-muted-foreground text-sm">Contact number:</h1>
            <h1 className="text-base font-semibold">
              {data?.project?.contactPersons?.contactNumber}
            </h1>
          </div>
        </div>
        <div className="flex gap-y-10 gap-x-12 w-full shadow-md p-4 rounded-lg">
          <div className="grid grid-cols-3 gap-10 p-4 w-full">
            <div className="flex flex-col">
              <h1 className="text-muted-foreground text-sm">Department:</h1>
              <h1 className="text-base font-semibold">
                {data?.originDepartment}
              </h1>
            </div>
            <div className="flex flex-col">
              <h1 className="text-muted-foreground text-sm">Section:</h1>
              <h1 className="text-base font-semibold">
                {data?.team}
              </h1>
            </div>
            <div className="flex flex-col">
              <h1 className="text-muted-foreground text-sm">Document type:</h1>
              <h1 className="text-base font-semibold">
                {data?.documentType}
              </h1>
            </div>
            <div className="flex flex-col">
              <h1 className="text-muted-foreground text-sm">
                Document Sub type:
              </h1>
              <h1 className="text-base font-semibold">
                {data?.documentSubType}
              </h1>
            </div>
            <div className="flex flex-col">
              <h1 className="text-muted-foreground text-sm">Subject:</h1>
              <h1 className="text-base font-semibold">
                {data?.subject}
              </h1>
            </div>
          </div>
          <div className=" w-2 bg-green-500" />
          <div className="grid grid-cols-3 gap-10 p-4 w-full">
            <div className="flex flex-col">
              <h1 className="text-muted-foreground text-sm">Forwarded To:</h1>
              <h1 className="text-base font-semibold">
                {data?.targetDepartment}
              </h1>
            </div>
            <div className="flex flex-col">
              <h1 className="text-muted-foreground text-sm">Due Date:</h1>
              <h1 className="text-base font-semibold">
                {data?.dueDate}
              </h1>
            </div>
            <div className="flex flex-col">
              <h1 className="text-muted-foreground text-sm">Priority:</h1>
              <h1 className="text-base font-semibold">
                {data?.priority}
              </h1>
            </div>
            <div className="flex flex-col">
              <h1 className="text-muted-foreground text-sm">
               Status:
              </h1>
              <h1 className="text-base font-semibold">
                {data?.status}
              </h1>
            </div>
            <div className="flex flex-col col-span-2 row-span-2 ">
              <h1 className="text-muted-foreground text-sm">Remarks:</h1>
              <h1 className="text-base font-semibold">
                {data?.remarks}
              </h1>
            </div>
            <div className="flex flex-col">
              <h1 className="text-muted-foreground text-sm">
               Date Forwarded:
              </h1>
              <h1 className="text-base font-semibold">
                {data?.dateForwarded}
              </h1>
            </div>
          </div>
        </div>
        </>
    )
}