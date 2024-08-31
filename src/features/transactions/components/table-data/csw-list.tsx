import { DataTable } from "@/components/data-table";
import { useTransaction } from "../../hooks/query-gate";
import { z } from "zod";
import { completeStaffWork } from "../../schema/TransactionSchema";
import { cswColumn } from "../table-columns/csw-column";
import { CompleStaffWorkDialog } from "../../forms/csw-form-2";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUserRole } from "@/hooks/hooks/use-user-hook";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useCurrentUserFirstName } from "@/hooks/use-user-hook";

type Props = {
  transactionId: string;
  data: z.infer<typeof completeStaffWork>[];
};

export const CswComponent = ({ transactionId, data }: Props) => {
  const name = useCurrentUserFirstName();
  const role = useCurrentUserRole();
  const componentRef = useRef<HTMLDivElement | null>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current!,
  });
  return (
    <div className="flex flex-col gap-2">
      {role === "CH" && (
        <div className="">
          <CompleStaffWorkDialog transactionId={transactionId} />
        </div>
      )}
      <div className="flex w-full justify-end py-4 ">
        <Button
          variant="default"
          className="px-4 py text-white"
          onClick={handlePrint}
        >
          Print
        </Button>
      </div>
      <div className="flex flex-col w-full h-full gap-2" ref={componentRef}>
        <div className="justify-between w-full flex items-center bg-[#BBD979] h-16 px-4  ">
          <h1 className="text-2xl text-[#414140]">Complete Staff Work</h1>
        </div>
        <DataTable columns={cswColumn} data={data} />
        <div className="show-print hidden">
            <h1 className="text-muted-foreground text-lg">Generated by:</h1>
            <h1 className="text-lg font-semibold">{name}</h1>
      </div>
      </div>
    </div>
  );
};
