import { useParams } from "react-router-dom";
import { z } from "zod";
import { filesSchema } from "../../schema/TransactionSchema";
import { DocumentTable } from "./document-table";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";

type Props = {
  data: z.infer<typeof filesSchema>[];
};
export const IerPage = ({ data }: Props) => {
  const { id } = useParams();
  console.log(id);
  const componentRef = useRef<HTMLDivElement | null>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current!,
  });
  return (
    <div className="flex flex-col">
     
     <div className="flex w-full justify-end py-4 ">
          <Button
            variant="default"
            className="px-4 py text-white"
            onClick={handlePrint}
          >
            Print
          </Button>
        </div>
      <div className="flex items-center justify-center" ref={componentRef}>
        <DocumentTable data={data} />
      </div>
    </div>
  );
};
