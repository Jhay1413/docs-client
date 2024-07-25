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
type Props = {
  data: z.infer<typeof filesSchema>[];
};
export const DocumentTable = ({ data }: Props) => {
  const viewFile = async (key: string) => {
    const signedUrl = await getSignUrlForView(key);
    if (signedUrl) {
      window.open(signedUrl);
    }
  };
  return (
    <div className="flex flex-col space-y-4 mt-12">
      <h1 className="text-2xl">List of Attachments</h1>
      <Table>
        <TableCaption>A list of your Attachment.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>

            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[100px]">Remarks</TableHead>
            <TableHead className="w-[100px]">Created at</TableHead>
            <TableHead className="w-[100px]">Has File</TableHead>

            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium w-[300px]">
                <h1>{item.fileName}</h1>
              </TableCell>

              <TableCell className="font-medium w-[300px]">
                <h1>{item.fileStatus?.split("_").join(" ")}</h1>
              </TableCell>
              <TableCell className="font-medium w-[500px]">
                <h1>{item.remarks}</h1>
              </TableCell>
              <TableCell className="font-medium w-[500px]">
                <h1>{new Date(item.createdAt!).toDateString()}</h1>
              </TableCell>
              <TableCell className="font-medium w-[500px]">
                {item.fileUrl ? (
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
