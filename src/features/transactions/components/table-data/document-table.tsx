import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X } from "lucide-react";
import { z } from "zod";
import { filesSchema } from "../../schema/TransactionSchema";
import { getSignUrlForView } from "../../services/getSignedUrl";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
type Props = {
  data: z.infer<typeof filesSchema>[];
};
export const DocumentTable = ({ data }: Props) => {
  const componentRef = useRef<HTMLDivElement | null>(null);
  const viewFile = async (key: string) => {
    const signedUrl = await getSignUrlForView(key);
    if (signedUrl) {
      window.open(signedUrl);
    }
  };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current!,
  });
  return (
    <div className="flex flex-col ">
      <div className="justify-between w-full flex items-center bg-[#BBD979] h-16 px-4 ">
        <h1 className="text-2xl text-[#414140]">Initial Evaluation Report</h1>
        <div className="flex ">
          <Button
            variant="default"
            className="px-4 py text-white"
            onClick={handlePrint}
          >
            Print
          </Button>
        </div>
      </div>

      <Table>
        <TableCaption>A list of your Attachment.</TableCaption>
        <TableHeader className="bg-[#8CBF3F] rounded-md ">
          <TableRow>
            <TableHead className=" text-[#414140]">Name</TableHead>

            <TableHead className="text-center text-[#414140]">Status</TableHead>
            <TableHead className="text-center text-[#414140]">
              Remarks
            </TableHead>
            <TableHead className="text-center text-[#414140]">
              Created at
            </TableHead>
            <TableHead className="text-center text-[#414140]">Final</TableHead>

            <TableHead className="text-center text-[#414140]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium w-[500px]">
                <h1>{item.fileName}</h1>
              </TableCell>

              <TableCell className="font-medium w-[200px] text-center">
                <h1>{item.fileStatus?.split("_").join(" ")}</h1>
              </TableCell>
              <TableCell className="font-medium w-[500px] text-center">
                <h1>{item.remarks}</h1>
              </TableCell>
              <TableCell className="font-medium w-[500px] text-center">
                <h1>{new Date(item.createdAt!).toDateString()}</h1>
              </TableCell>
              <TableCell className="font-medium w-[500px] text-center">
                {item.fileStatus == "FINAL_ATTACHMENT" ? (
                  <Check className="text-green-500" />
                ) : (
                  <X className="text-red-500" />
                )}
              </TableCell>

              <TableCell className="h-full w-32 flex items-center justify-center ">
                <Button
                  type="button"
                  onClick={() => viewFile(item.fileUrl!)}
                  disabled={item.fileUrl ? false : true}
                  className="hide-on-print"
                >
                  View file
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
