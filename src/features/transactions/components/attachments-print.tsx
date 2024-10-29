import { completeStaffWorkQuerySchema, filesQuerySchema } from "shared-contract";

import { z } from "zod";

export const AttachmentOnPrint = ({ attachments }: { attachments: z.infer<typeof completeStaffWorkQuerySchema>[] }) => {
  const mutateData = attachments.map((data) => {
    const id = data.id;
    const urls = data.attachments.map((data) => {
      return { url: data };
    });
    return { id, data: urls };
  });

  return (
    <div className="flex flex-col gap-4 bg-black ">
      <div className="flex flex-col "></div>
    </div>
  );
};
