import { tsr } from "@/services/tsr";
import { completeStaffWorkQuerySchema, filesQuerySchema } from "shared-contract";
import { z } from "zod";

export const AttachmentOnPrint = ({ attachments }: { attachments: z.infer<typeof completeStaffWorkQuerySchema>[] }) => {
  const mutateData = attachments.map((data) => {
    const id = data.id!;
    if (data.attachments.length === 0) return;
    const urls = data.attachments.map((data) => {
      return { url: data };
    });
    return { id, data: urls };
  });
  const filteredData = mutateData.filter((data) => data !== undefined);
  const { data, error, isError } = tsr.awsContract.getMultipleSignedUrl.useQuery({
    queryKey: ["attachments-signedUrl"],
    queryData: {
      query: {
        data: filteredData,
      },
    },
  });
  if (!data) return "Loading";
  console.log(error);
  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex flex-col ">
        {data.body.map((data) => (
          <div className="" key={data.id}>
            <h1>Annex A</h1>
            {data.data.map((data) => (
              <img src={data.signedUrl} className="w-[100px]" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
