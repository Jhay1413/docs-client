import { filesQuerySchema } from "shared-contract";
import { completeStaffWorkQuerySchema } from "shared-contract/dist/schema/transactions/query-schema";
import { z } from "zod";

export const AttachmentOnPrint = ({ attachments }: { attachments: z.infer<typeof completeStaffWorkQuerySchema>[] }) => {
  return (
    <div className="flex flex-col gap-4 bg-black ">
      <div className="flex flex-col "></div>
    </div>
  );
};
